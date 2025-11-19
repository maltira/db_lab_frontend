import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import OwnerView from '@/views/tables/OwnerView.vue'
import ShipView from '@/views/tables/ShipView.vue'
import OwnershipView from '@/views/tables/OwnershipView.vue'
import InspectorView from '@/views/tables/InspectorView.vue'
import InspectionView from '@/views/tables/InspectionView.vue'
import SkipperView from '@/views/tables/SkipperView.vue'
import ViolationView from '@/views/tables/ViolationView.vue'
import ShipTypesView from '@/views/tables/ShipTypesView.vue'
import OwnerDataForm from '@/views/forms/data/OwnerDataForm.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'OwnerDataForm',
    component: OwnerDataForm
  },
  {
    path: '/table/owner',
    name: 'OwnerView',
    component: OwnerView
  },
  {
    path: '/table/ship',
    name: 'ShipView',
    component: ShipView
  },
  {
    path: '/table/ownership',
    name: 'OwnershipView',
    component: OwnershipView
  },
  {
    path: '/table/inspector',
    name: 'InspectorView',
    component: InspectorView
  },
  {
    path: '/table/inspection',
    name: 'InspectionView',
    component: InspectionView
  },
  {
    path: '/table/skipper',
    name: 'SkipperView',
    component: SkipperView
  },
  {
    path: '/table/violation',
    name: 'ViolationView',
    component: ViolationView
  },
  {
    path: '/table/type',
    name: 'TypeView',
    component: ShipTypesView
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router
