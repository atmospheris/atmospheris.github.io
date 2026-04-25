<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { IsaAlgorithms, kelvinToCelsius, paToMbar, mToFeet } from 'atmospheris'

const props = defineProps({
  altitude: { type: Number, default: -2000 },
  unit: { type: String, default: 'meters' }
})

const emit = defineEmits(['update:altitude'])

const containerRef = ref(null)
const fallback = ref(false)
const overlayData = ref(null)
const altType = ref('H') // 'H' = geopotential, 'h' = geometric
const R = 6356766 // Nominal Earth radius

let THREE = null
let scene, camera, renderer, controls
let altitudeMarker, markerGlow, handleMesh, handleGlowMesh
let particleSystem
let animFrameId = null
let isDragging = false
let isHovering = false
let raycaster = null
let raycastTargets = []
let isTouchPrimary = false
let resizeObserver = null
let sliderObserver = null

// Drag state
let dragStartClientY = 0
let dragStartAlt = 0

// Scene dimensions
const COLUMN_WIDTH = 4
const COLUMN_HEIGHT = 16
const COLUMN_DEPTH = 2
const MIN_ALT = -2000
const MAX_ALT = 80000
const eps = 0.001

function altToY(alt) {
  return ((alt - MIN_ALT) / (MAX_ALT - MIN_ALT)) * COLUMN_HEIGHT - COLUMN_HEIGHT / 2
}

const layers = [
  { name: 'Troposphere', from: -2000, to: 11000, color: 0x2c84bf, opacity: 0.25 },
  { name: 'Tropopause', from: 11000, to: 20000, color: 0x33588e, opacity: 0.15 },
  { name: 'Stratosphere', from: 20000, to: 32000, color: 0x33588e, opacity: 0.2 },
  { name: 'Upper Strat.', from: 32000, to: 47000, color: 0x1f2b3e, opacity: 0.2 },
  { name: 'Stratopause', from: 47000, to: 51000, color: 0x33588e, opacity: 0.15 },
  { name: 'Mesosphere', from: 51000, to: 71000, color: 0x1f2b3e, opacity: 0.25 },
  { name: 'Thermosphere', from: 71000, to: 80000, color: 0x15202e, opacity: 0.3 },
]

const milestones = [
  { name: 'Sea Level', alt: 0 },
  { name: 'Mt. Everest', alt: 8849 },
  { name: 'Cruising Alt.', alt: 10668 },
  { name: 'Concorde Max', alt: 18300 },
  { name: 'Weather Balloon', alt: 35000 },
]

function getOverlayData(altMeters) {
  const isa = new IsaAlgorithms()
  const temp = isa.temperatureFromGeopotential(altMeters)
  const pres = isa.pressureFromGeopotential(altMeters)
  const dens = isa.densityFromGeopotential(altMeters)
  const sos = isa.speedOfSound(altMeters)
  const geoZ = altMeters > 0 ? R * altMeters / (R - altMeters) : altMeters
  return {
    geoH: altMeters,
    geoH_ft: mToFeet(altMeters),
    geoZ,
    geoZ_ft: mToFeet(geoZ),
    temperature: temp.toFixed(1),
    tempC: kelvinToCelsius(temp).toFixed(1),
    pressure: paToMbar(pres).toFixed(2),
    density: dens.toFixed(4),
    speedOfSound: sos.toFixed(1)
  }
}

function setAltitude(alt) {
  const clamped = Math.max(MIN_ALT, Math.min(MAX_ALT, Math.round(alt)))
  emit('update:altitude', clamped)
}

function onSliderInput(e) {
  setAltitude(Number(e.target.value))
}

function onNumberInput(e) {
  setAltitude(Number(e.target.value))
}

function adjustZoom(factor) {
  if (!camera || !controls) return
  const offset = camera.position.clone().sub(controls.target)
  const newOffset = offset.multiplyScalar(factor)
  if (newOffset.length() < 4 || newOffset.length() > 25) return
  camera.position.copy(controls.target).add(newOffset)
}

watch(() => props.altitude, (newAlt) => {
  if (isDragging) return
  const alt = newAlt ?? -2000
  const y = altToY(alt)
  if (altitudeMarker) altitudeMarker.position.y = y
  if (markerGlow) markerGlow.position.y = y
  // Follow the marker with the camera target
  if (controls) {
    controls.target.y = y
  }
  if (newAlt !== undefined && newAlt !== null) {
    overlayData.value = getOverlayData(newAlt ?? -2000)
  }
}, { immediate: true })

onMounted(async () => {
  if (!containerRef.value) return
  isTouchPrimary = typeof window !== 'undefined' &&
    window.matchMedia('(hover: none)').matches
  try {
    THREE = await import('three')
    // Wait for layout to settle — ensures containerRef has correct dimensions
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    await buildScene(THREE)
  } catch (e) {
    console.warn('WebGL not available:', e)
    fallback.value = true
  }
})

async function buildScene(THREE) {
  // Ensure container has dimensions
  if (!containerRef.value || containerRef.value.clientHeight < 10) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  const cw = containerRef.value.clientWidth
  const ch = containerRef.value.clientHeight
  if (cw < 10 || ch < 10) {
    console.warn('Explorer container too small:', cw, 'x', ch)
    fallback.value = true
    return
  }

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a1520)

  camera = new THREE.PerspectiveCamera(
    50,
    cw / ch,
    0.1,
    100
  )
  const markerY = altToY(props.altitude ?? -2000)
  camera.position.set(8, markerY, 8)
  camera.lookAt(0, markerY, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(cw, ch)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.style.touchAction = 'none'
  containerRef.value.appendChild(renderer.domElement)
  const el = renderer.domElement

  // Prevent context menu on right-click so orbit works
  el.addEventListener('contextmenu', e => e.preventDefault())

  // ===== POINTER HANDLERS — registered BEFORE OrbitControls =====
  // Interaction model (NO raycasting — entire canvas is the scrub surface):
  //   Desktop: left-drag = altitude, right-drag = orbit, scroll = zoom
  //   Mobile:  single-finger = altitude, zoom via +/- buttons
  function onPointerDown(e) {
    // Mobile: any touch = altitude drag
    if (e.pointerType === 'touch') {
      isDragging = true
      dragStartClientY = e.clientY
      dragStartAlt = props.altitude ?? -2000
      el.setPointerCapture(e.pointerId)
      if (altitudeMarker) altitudeMarker.material.opacity = 1.0
      if (markerGlow) markerGlow.material.opacity = 0.3
      if (handleMesh) handleMesh.scale.setScalar(1.4)
      e.stopImmediatePropagation()
      e.preventDefault()
      return
    }

    // Desktop: right-click or middle-click → let OrbitControls handle it
    if (e.button !== 0) return

    // Desktop: left-click → altitude drag (entire canvas)
    // Disable OrbitControls so it ignores this left-click
    isDragging = true
    if (controls) controls.enabled = false
    dragStartClientY = e.clientY
    dragStartAlt = props.altitude ?? -2000
    el.style.cursor = 'grabbing'
    el.setPointerCapture(e.pointerId)
    if (altitudeMarker) altitudeMarker.material.opacity = 1.0
    if (markerGlow) markerGlow.material.opacity = 0.3
    if (handleMesh) handleMesh.scale.setScalar(1.4)
  }

  function onPointerMove(e) {
    if (!isDragging) {
      // Hover feedback (desktop only)
      if (isTouchPrimary || e.pointerType === 'touch') return
      isHovering = true
      if (altitudeMarker) altitudeMarker.material.opacity = 1.0
      if (markerGlow) markerGlow.material.opacity = 0.2
      if (handleMesh) handleMesh.scale.setScalar(1.2)
      return
    }

    // Drag: vertical delta → altitude change
    const deltaY = dragStartClientY - e.clientY
    const containerHeight = el.clientHeight
    const altRange = MAX_ALT - MIN_ALT
    const altChange = (deltaY / containerHeight) * altRange
    const newAlt = Math.round(dragStartAlt + altChange)
    const clamped = Math.max(MIN_ALT, Math.min(MAX_ALT, newAlt))
    const y = altToY(clamped)

    if (altitudeMarker) altitudeMarker.position.y = y
    if (markerGlow) markerGlow.position.y = y

    // Update overlay data immediately during drag (not just via watcher)
    overlayData.value = getOverlayData(clamped)

    // Follow the marker with the camera target so it stays visible
    if (controls) {
      controls.target.y = y
    }

    emit('update:altitude', clamped)
  }

  function onPointerUp(e) {
    if (!isDragging) return
    isDragging = false
    el.style.cursor = 'default'
    try { el.releasePointerCapture(e.pointerId) } catch (_) {}
    if (altitudeMarker) altitudeMarker.material.opacity = 0.9
    if (markerGlow) markerGlow.material.opacity = 0.12
    if (handleMesh) handleMesh.scale.setScalar(1.0)
    // Re-enable controls after OrbitControls has processed its own pointerup
    if (controls) {
      queueMicrotask(() => { controls.enabled = true })
    }
  }

  function onPointerLeave() {
    isHovering = false
    if (!isDragging) {
      if (altitudeMarker) altitudeMarker.material.opacity = 0.9
      if (markerGlow) markerGlow.material.opacity = 0.12
      if (handleMesh) handleMesh.scale.setScalar(1.0)
    }
  }

  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('pointerup', onPointerUp)
  el.addEventListener('pointerleave', onPointerUp)
  el.addEventListener('pointerleave', onPointerLeave)

  // ===== OrbitControls — created AFTER our handlers =====
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
  // Remap mouse buttons: right-click = orbit, left-click handled by our altitude drag
  // Use numeric constants: ROTATE=0, DOLLY=1, PAN=2
  controls.mouseButtons = {
    LEFT: -1,
    MIDDLE: 1,
    RIGHT: 0
  }

  // Touch devices: disable orbit entirely (altitude via swipe, zoom via buttons)
  if (isTouchPrimary) {
    controls.enableRotate = false
    controls.enableZoom = false
  }

  // Lights
  scene.add(new THREE.AmbientLight(0x33588e, 0.4))
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
  dirLight.position.set(5, 10, 7)
  scene.add(dirLight)

  // Column
  const column = new THREE.Group()

  layers.forEach(layer => {
    const yBot = altToY(layer.from)
    const yTop = altToY(layer.to)
    const height = Math.max(eps, yTop - yBot)
    const geo = new THREE.BoxGeometry(COLUMN_WIDTH, height, COLUMN_DEPTH)
    const mat = new THREE.MeshPhongMaterial({
      color: layer.color, transparent: true, opacity: layer.opacity, side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.y = yBot + height / 2
    column.add(mesh)

    const label = makeTextSprite(THREE, layer.name, { color: 'rgba(255,255,255,0.4)', scale: 2.5, fontSize: 28 })
    label.position.set(COLUMN_WIDTH / 2 + 0.3, yBot + height / 2, COLUMN_DEPTH / 2 + 0.1)
    column.add(label)
  })

  const boundaryAlts = [11000, 20000, 32000, 47000, 51000, 71000]
  boundaryAlts.forEach(alt => {
    const y = altToY(alt)
    const lineGeo = new THREE.BoxGeometry(COLUMN_WIDTH + 0.6, 0.015, COLUMN_DEPTH + 0.2)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x7abae5, transparent: true, opacity: 0.35 })
    const line = new THREE.Mesh(lineGeo, lineMat)
    line.position.y = y
    column.add(line)
  })

  milestones.forEach(ms => {
    const y = altToY(ms.alt)
    const label = makeTextSprite(THREE, `${ms.name} (${ms.alt.toLocaleString()}m)`, {
      color: 'rgba(129,140,248,0.6)', scale: 2, fontSize: 24
    })
    label.position.set(-COLUMN_WIDTH / 2 - 2.5, y, 0)
    column.add(label)
    const dotGeo = new THREE.SphereGeometry(0.05, 8, 8)
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x7abae5 })
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
    color: 0x7abae5, size: 0.04, transparent: true, opacity: 0.6,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
  })
  particleSystem = new THREE.Points(particleGeo, particleMat)
  column.add(particleSystem)
  scene.add(column)

  // Altitude marker
  const markerGeo = new THREE.BoxGeometry(COLUMN_WIDTH + 1, 0.15, COLUMN_DEPTH + 0.5)
  const markerMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b, transparent: true, opacity: 0.9, side: THREE.DoubleSide
  })
  altitudeMarker = new THREE.Mesh(markerGeo, markerMat)
  altitudeMarker.position.y = altToY(props.altitude ?? -2000)
  scene.add(altitudeMarker)

  // Handle sphere
  const handleGeo = new THREE.SphereGeometry(0.3, 16, 16)
  const handleMat = new THREE.MeshPhongMaterial({
    color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.3,
    transparent: true, opacity: 0.95
  })
  handleMesh = new THREE.Mesh(handleGeo, handleMat)
  handleMesh.position.set(-COLUMN_WIDTH / 2 - 0.6, 0, 0)
  altitudeMarker.add(handleMesh)

  // Handle glow
  const hGlowGeo = new THREE.SphereGeometry(0.5, 16, 16)
  const hGlowMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b, transparent: true, opacity: 0.15, side: THREE.DoubleSide
  })
  handleGlowMesh = new THREE.Mesh(hGlowGeo, hGlowMat)
  handleGlowMesh.position.copy(handleMesh.position)
  altitudeMarker.add(handleGlowMesh)

  // Marker glow
  const glowGeo = new THREE.BoxGeometry(COLUMN_WIDTH + 2, 0.5, COLUMN_DEPTH + 1)
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b, transparent: true, opacity: 0.12, side: THREE.DoubleSide
  })
  markerGlow = new THREE.Mesh(glowGeo, glowMat)
  markerGlow.position.y = altitudeMarker.position.y
  scene.add(markerGlow)

  // Resize — use ResizeObserver for reliable dimension tracking
  resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const w = entry.contentRect.width
      const h = entry.contentRect.height
      if (w > 0 && h > 0 && camera && renderer) {
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
    }
  })
  resizeObserver.observe(containerRef.value)

  // Sync vertical slider width to track container height
  function syncSliderSize() {
    const track = containerRef.value?.querySelector('.altitude-slider-track')
    const slider = containerRef.value?.querySelector('.altitude-slider')
    if (track && slider && track.clientHeight > 0) {
      slider.style.width = track.clientHeight + 'px'
    }
  }
  syncSliderSize()
  // Also sync on container resize
  sliderObserver = new ResizeObserver(syncSliderSize)
  const trackEl = containerRef.value?.querySelector('.altitude-slider-track')
  if (trackEl) sliderObserver.observe(trackEl)

  // Animate
  function animate() {
    animFrameId = requestAnimationFrame(animate)
    if (particleSystem) particleSystem.rotation.y += 0.0003
    if (markerGlow && !isDragging && !isHovering) {
      markerGlow.material.opacity = 0.08 + 0.04 * Math.sin(Date.now() * 0.003)
    }
    if (handleGlowMesh && !isDragging) {
      handleGlowMesh.material.opacity = 0.1 + 0.05 * Math.sin(Date.now() * 0.004)
      handleGlowMesh.scale.setScalar(1.0 + 0.15 * Math.sin(Date.now() * 0.004))
    }
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  overlayData.value = getOverlayData(props.altitude ?? -2000)
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
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (sliderObserver) {
    sliderObserver.disconnect()
    sliderObserver = null
  }
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

    <!-- Side controls: altitude slider + number input -->
    <div v-if="!fallback" class="explorer-controls">
      <div class="altitude-type-label">{{ altType === 'H' ? 'H (geopotential)' : 'h (geometric)' }}</div>
      <div class="altitude-slider-track">
        <input
          type="range"
          class="altitude-slider"
          :min="MIN_ALT"
          :max="MAX_ALT"
          :value="Math.round(altitude)"
          step="100"
          @input="onSliderInput"
        />
        <div class="slider-ticks">
          <span class="tick" style="top: 0">80 km</span>
          <span class="tick" style="top: 25%">60 km</span>
          <span class="tick" style="top: 50%">40 km</span>
          <span class="tick" style="top: 75%">19 km</span>
          <span class="tick" style="bottom: 0">-2 km</span>
        </div>
      </div>
      <div class="altitude-input-group">
        <input
          type="number"
          class="altitude-number-input"
          :value="Math.round(altitude)"
          :min="MIN_ALT"
          :max="MAX_ALT"
          step="100"
          @change="onNumberInput"
        />
        <span class="altitude-input-unit">m</span>
      </div>
    </div>

    <!-- Overlay with current altitude properties -->
    <div v-if="overlayData && !fallback" class="explorer-overlay">
      <div class="overlay-alt-type-toggle">
        <button :class="{ active: altType === 'H' }" @click="altType = 'H'">H</button>
        <button :class="{ active: altType === 'h' }" @click="altType = 'h'">h</button>
      </div>
      <h4>{{ altType === 'H' ? 'Geopotential Altitude (H)' : 'Geometric Altitude (h)' }}</h4>
      <div class="altitude-display">
        {{ (altType === 'H' ? overlayData.geoH : overlayData.geoZ).toLocaleString() }} m
        <span class="altitude-ft">({{ (altType === 'H' ? overlayData.geoH_ft : overlayData.geoZ_ft).toLocaleString() }} ft)</span>
      </div>
      <div class="overlay-props">
        <div class="property-row">
          <span class="label">Temperature</span>
          <span class="value">{{ overlayData.temperature }} K</span>
        </div>
        <div class="property-row indent">
          <span class="label"></span>
          <span class="value dim">{{ overlayData.tempC }} °C</span>
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
    </div>

    <!-- Zoom buttons -->
    <div v-if="!fallback" class="explorer-zoom-buttons">
      <button class="zoom-btn" @click="adjustZoom(0.8)" title="Zoom in">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <button class="zoom-btn" @click="adjustZoom(1.25)" title="Zoom out">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
    </div>

    <div v-if="!fallback" class="explorer-hint">
      {{ isTouchPrimary
        ? 'Swipe up/down to change altitude. Use the slider for precise control.'
        : 'Drag to change altitude. Right-drag to orbit. Scroll to zoom.'
      }}
    </div>
  </div>
</template>
