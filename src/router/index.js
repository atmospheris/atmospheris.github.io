import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: () => import('@/views/CalculatorView.vue'),
    meta: { tab: 'calculator' }
  },
  {
    path: '/calculator/explorer',
    name: 'Explorer',
    component: () => import('@/views/CalculatorView.vue'),
    meta: { tab: 'explorer' }
  },
  {
    path: '/calculator/table',
    name: 'Table',
    component: () => import('@/views/CalculatorView.vue'),
    meta: { tab: 'table' }
  },
  {
    path: '/calculator/charts',
    name: 'Charts',
    component: () => import('@/views/CalculatorView.vue'),
    meta: { tab: 'charts' }
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('@/views/LibraryView.vue')
  },
  {
    path: '/iso-2533',
    name: 'ISO2533',
    component: () => import('@/views/Iso2533View.vue')
  },
  {
    path: '/iso-5878',
    name: 'ISO5878',
    component: () => import('@/views/Iso5878View.vue')
  },
  {
    path: '/references',
    name: 'References',
    component: () => import('@/views/ReferencesView.vue')
  },
  {
    path: '/symbols',
    name: 'Symbols',
    component: () => import('@/views/SymbolsView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

export { routes }

export function createMyRouter() {
  const history = typeof window !== 'undefined'
    ? createWebHistory('/')
    : createMemoryHistory()

  return createRouter({ history, routes })
}
