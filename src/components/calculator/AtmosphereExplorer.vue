<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { IsaAlgorithms, TEMPERATURE_LAYERS, kelvinToCelsius, paToMbar, mToFeet } from 'atmospheris'

const props = defineProps({
  altitude: { type: Number, default: 0 },
  unit: { type: String, default: 'meters' }
})

const emit = defineEmits(['update:altitude'])

const containerRef = ref(null)
const fallback = ref(false)
const overlayData = ref(null)

let THREE = null
let scene, camera, renderer, controls
let altitudeMarker, markerGlow
let particleSystem
let animFrameId = null
let isDragging = false
let raycaster = null
let mouse = new (typeof window !== 'undefined' ? window.EventTarget : null) ? null : null

// Scene dimensions
const COLUMN_WIDTH = 4
const COLUMN_HEIGHT = 16
const COLUMN_DEPTH = 2
const MIN_ALT = -2000
const MAX_ALT = 80000
const eps = 0.001

// Convert altitude (m) to Y position in scene
function altToY(alt) {
  return ((alt - MIN_ALT) / (MAX_ALT - MIN_ALT)) * COLUMN_HEIGHT - COLUMN_HEIGHT / 2
}

// Convert Y position to altitude (m)
function yToAlt(y) {
  const alt = ((y + COLUMN_HEIGHT / 2) / COLUMN_HEIGHT) * (MAX_ALT - MIN_ALT) + MIN_ALT
  return Math.round(Math.max(MIN_ALT, Math.min(MAX_ALT, alt)))
}

// Layer colors and labels
const layers = [
  { name: 'Troposphere', from: -2000, to: 11000, color: 0x3b82f6, opacity: 0.25 },
  { name: 'Tropopause', from: 11000, to: 20000, color: 0x6366f1, opacity: 0.15 },
  { name: 'Stratosphere', from: 20000, to: 32000, color: 0x8b5cf6, opacity: 0.2 },
  { name: 'Upper Strat.', from: 32000, to: 47000, color: 0xa855f7, opacity: 0.2 },
  { name: 'Stratopause', from: 47000, to: 51000, color: 0xc084fc, opacity: 0.15 },
  { name: 'Mesosphere', from: 51000, to: 71000, color: 0x1e1b4b, opacity: 0.25 },
  { name: 'Thermosphere', from: 71000, to: 80000, color: 0x0f0b2e, opacity: 0.3 },
]

// Milestones
const milestones = [
  { name: 'Sea Level', alt: 0 },
  { name: 'Mt. Everest', alt: 8849 },
  { name: 'Cruising Alt.', alt: 10668 },
  { name: 'Concorde Max', alt: 18300 },
  { name: 'Weather Balloon', alt: 35000 },
]

function getOverlayData(altMeters) {
  const isa = new IsaAlgorithms()
  const geoAlt = altMeters
  const temp = isa.temperatureFromGeopotential(geoAlt)
  const pres = isa.pressureFromGeopotential(geoAlt)
  const dens = isa.densityFromGeopotential(geoAlt)
  const sos = isa.speedOfSound(geoAlt)

  return {
    altitude: altMeters,
    altitudeFt: mToFeet(altMeters),
    temperature: temp.toFixed(1),
    tempC: kelvinToCelsius(temp).toFixed(1),
    pressure: paToMbar(pres).toFixed(2),
    density: dens.toFixed(4),
    speedOfSound: sos.toFixed(1)
  }
}

watch(() => props.altitude, (newAlt) => {
  if (altitudeMarker && !isDragging) {
    const y = altToY(newAlt || 0)
    altitudeMarker.position.y = y
    if (markerGlow) markerGlow.position.y = y
  }
  if (newAlt !== undefined && newAlt !== null) {
    overlayData.value = getOverlayData(newAlt || 0)
  }
}, { immediate: true })

onMounted(async () => {
  if (!containerRef.value) return
  try {
    THREE = await import('three')
    await buildSceneInternal(THREE)
  } catch (e) {
    console.warn('WebGL not available:', e)
    fallback.value = true
  }
})

async function buildSceneInternal(THREE) {
  // Rebuild buildScene but with THREE in scope
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x030712)

  camera = new THREE.PerspectiveCamera(50, containerRef.value.clientWidth / containerRef.value.clientHeight, 0.1, 100)
  const markerY = altToY(props.altitude || 0)
  camera.position.set(8, markerY, 8)
  camera.lookAt(0, markerY, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  containerRef.value.appendChild(renderer.domElement)

  // OrbitControls
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = false
  controls.minDistance = 5
  controls.maxDistance = 20
  controls.maxPolarAngle = Math.PI * 0.8
  controls.minPolarAngle = Math.PI * 0.2
  controls.target.set(0, markerY, 0)

  // Lights
  scene.add(new THREE.AmbientLight(0x6366f1, 0.4))
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
  dirLight.position.set(5, 10, 7)
  scene.add(dirLight)

  // Column group
  const column = new THREE.Group()

  // Layer bands
  layers.forEach(layer => {
    const yBot = altToY(layer.from)
    const yTop = altToY(layer.to)
    const height = Math.max(eps, yTop - yBot)
    const geo = new THREE.BoxGeometry(COLUMN_WIDTH, height, COLUMN_DEPTH)
    const mat = new THREE.MeshPhongMaterial({
      color: layer.color,
      transparent: true,
      opacity: layer.opacity,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.y = yBot + height / 2
    column.add(mesh)

    // Label
    const label = makeTextSprite(THREE, layer.name, { color: 'rgba(255,255,255,0.4)', scale: 2.5, fontSize: 28 })
    label.position.set(COLUMN_WIDTH / 2 + 0.3, yBot + height / 2, COLUMN_DEPTH / 2 + 0.1)
    column.add(label)
  })

  // Milestones
  milestones.forEach(ms => {
    const y = altToY(ms.alt)
    const label = makeTextSprite(THREE, `${ms.name} (${ms.alt.toLocaleString()}m)`, { color: 'rgba(129,140,248,0.6)', scale: 2, fontSize: 24 })
    label.position.set(-COLUMN_WIDTH / 2 - 2.5, y, 0)
    column.add(label)

    const dotGeo = new THREE.SphereGeometry(0.05, 8, 8)
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 })
    const dot = new THREE.Mesh(dotGeo, dotMat)
    dot.position.set(-COLUMN_WIDTH / 2, y, 0)
    column.add(dot)
  })

  // Particles
  const particleCount = 20000
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * COLUMN_WIDTH * 0.8
    const randAlt = Math.pow(Math.random(), 2.5) * (MAX_ALT - MIN_ALT) + MIN_ALT
    positions[i * 3 + 1] = altToY(randAlt)
    positions[i * 3 + 2] = (Math.random() - 0.5) * COLUMN_DEPTH * 0.8
  }
  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particleMat = new THREE.PointsMaterial({
    color: 0x818cf8,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  particleSystem = new THREE.Points(particleGeo, particleMat)
  column.add(particleSystem)
  scene.add(column)

  // Altitude marker — use thin box so visible from any angle
  const markerGeo = new THREE.BoxGeometry(COLUMN_WIDTH + 1, 0.08, COLUMN_DEPTH + 0.5)
  const markerMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.9 })
  altitudeMarker = new THREE.Mesh(markerGeo, markerMat)
  altitudeMarker.position.y = altToY(props.altitude || 0)
  scene.add(altitudeMarker)

  const glowGeo = new THREE.BoxGeometry(COLUMN_WIDTH + 2, 0.4, COLUMN_DEPTH + 1)
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.15 })
  markerGlow = new THREE.Mesh(glowGeo, glowMat)
  markerGlow.position.y = altitudeMarker.position.y
  scene.add(markerGlow)

  // Interaction
  raycaster = new THREE.Raycaster()
  const mouseVec = new THREE.Vector2()
  const el = renderer.domElement

  function getMousePos(e) {
    const rect = el.getBoundingClientRect()
    mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }

  function onPointerDown(e) {
    getMousePos(e)
    raycaster.setFromCamera(mouseVec, camera)
    const hits = raycaster.intersectObject(altitudeMarker)
    if (hits.length > 0) {
      isDragging = true
      controls.enabled = false
      el.style.cursor = 'grabbing'
    }
  }

  function onPointerMove(e) {
    if (!isDragging) {
      getMousePos(e)
      raycaster.setFromCamera(mouseVec, camera)
      const hits = raycaster.intersectObject(altitudeMarker)
      el.style.cursor = hits.length > 0 ? 'grab' : 'default'
      return
    }
    getMousePos(e)
    raycaster.setFromCamera(mouseVec, camera)
    const camDir = new THREE.Vector3()
      camera.getWorldDirection(camDir)
      const plane = new THREE.Plane()
      plane.setFromNormalAndCoplanarPoint(camDir.negate(), altitudeMarker.position)
    const pt = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, pt)
    if (pt) {
      const alt = yToAlt(pt.y)
      emit('update:altitude', alt)
    }
  }

  function onPointerUp() {
    isDragging = false
    controls.enabled = true
    el.style.cursor = 'default'
  }

  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('pointerup', onPointerUp)
  el.addEventListener('pointerleave', onPointerUp)

  // Resize
  function onResize() {
    if (!containerRef.value) return
    camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  }
  window.addEventListener('resize', onResize)

  // Animate
  function animate() {
    animFrameId = requestAnimationFrame(animate)
    if (particleSystem) particleSystem.rotation.y += 0.0003
    if (markerGlow) markerGlow.material.opacity = 0.1 + 0.05 * Math.sin(Date.now() * 0.003)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Initial overlay
  overlayData.value = getOverlayData(props.altitude || 0)
}

function makeTextSprite(THREE, text, opts = {}) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const fontSize = opts.fontSize || 36
  canvas.width = 512
  canvas.height = 64
  ctx.font = `${fontSize}px Inter, system-ui, sans-serif`
  ctx.fillStyle = opts.color || 'rgba(255,255,255,0.5)'
  ctx.textAlign = opts.align || 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, opts.align === 'center' ? 256 : 10, 32)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(opts.scale || 3, (opts.scale || 3) * 0.125, 1)
  return sprite
}

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  if (renderer) {
    renderer.dispose()
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }
  if (controls) controls.dispose()
})
</script>

<template>
  <div class="atmosphere-explorer" ref="containerRef">
    <!-- Fallback for no WebGL -->
    <div v-if="fallback" class="explorer-fallback">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
      <p>3D visualization requires WebGL.<br>Use the Charts tab for 2D graphs.</p>
    </div>

    <!-- Overlay with current altitude properties -->
    <div v-if="overlayData" class="explorer-overlay">
      <h4>Current Altitude</h4>
      <div class="altitude-display">{{ overlayData.altitude.toLocaleString() }} m</div>
      <div class="property-row">
        <span class="label">Temperature</span>
        <span class="value">{{ overlayData.temperature }} K ({{ overlayData.tempC }} °C)</span>
      </div>
      <div class="property-row">
        <span class="label">Pressure</span>
        <span class="value">{{ overlayData.pressure }} mbar</span>
      </div>
      <div class="property-row">
        <span class="label">Density</span>
        <span class="value">{{ overlayData.density }} kg/m³</span>
      </div>
      <div class="property-row">
        <span class="label">Speed of Sound</span>
        <span class="value">{{ overlayData.speedOfSound }} m/s</span>
      </div>
    </div>

    <div v-if="!fallback" class="explorer-hint">
      Drag the yellow marker to explore altitudes. Rotate with mouse.
    </div>
  </div>
</template>
