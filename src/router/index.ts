import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import PointsPage from '../pages/PointsPage.vue'
import RewardsPage from '../pages/RewardsPage.vue'
import ApprovalPage from '../pages/ApprovalPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardPage
    },
    {
      path: '/points',
      name: 'points',
      component: PointsPage
    },
    {
      path: '/rewards',
      name: 'rewards',
      component: RewardsPage
    },
    {
      path: '/approval',
      name: 'approval',
      component: ApprovalPage
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage
    }
  ]
})

export default router
