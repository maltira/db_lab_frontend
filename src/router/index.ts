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
import OwnerInputForm from '@/views/forms/input/OwnerInputForm.vue'
import ShipDataForm from '@/views/forms/data/ShipDataForm.vue'
import InspectorDataForm from '@/views/forms/data/InspectorDataForm.vue'
import InspectorInputForm from '@/views/forms/input/InspectorInputForm.vue'
import InspectionDataForm from '@/views/forms/data/InspectionDataForm.vue'
import ViolationDataForm from '@/views/forms/data/ViolationDataForm.vue'

const routes: RouteRecordRaw[] = [
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

  // ФВВ
  {
    path: '/form/input/owner/:id?',
    name: 'OwnerInputForm',
    component: OwnerInputForm,
    props: true,
  },
  {
    path: '/form/input/inspector/:id?',
    name: 'InspectorInputForm',
    component: InspectorInputForm,
    props: true,
  },
  // ФАД
  {
    path: '/',
    name: 'OwnerDataForm',
    component: OwnerDataForm
  },
  {
    path: '/form/data/ships/:id?',
    name: 'ShipDataForm',
    component: ShipDataForm,
    props: true
  },
  {
    path: '/form/data/inspectors',
    name: 'InspectorDataForm',
    component: InspectorDataForm,
  },
  {
    path: '/form/data/inspections/inspector/:inspector_id?',
    name: 'InspectionInspectorDataForm',
    component: InspectionDataForm,
    props: true
  },
  {
    path: '/form/data/inspections/ship/:ship_id?',
    name: 'InspectionShipDataForm',
    component: InspectionDataForm,
    props: true
  },
  {
    path: '/form/data/violation/inspector/:inspector_id?',
    name: 'ViolationInspectorDataForm',
    component: ViolationDataForm,
    props: true
  },
  {
    path: '/form/data/violation/ship/:ship_id?',
    name: 'ViolationShipDataForm',
    component: ViolationDataForm,
    props: true
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router
