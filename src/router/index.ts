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
import ShipInputForm from '@/views/forms/input/ShipInputForm.vue'
import ViolationInputForm from '@/views/forms/input/ViolationInputForm.vue'
import InspectionInputForm from '@/views/forms/input/InspectionInputForm.vue'
import OwnershipDataForm from '@/views/forms/data/OwnershipDataForm.vue'
import SkipperDataForm from '@/views/forms/data/SkipperDataForm.vue'
import SkipperInputForm from '@/views/forms/input/SkipperInputForm.vue'
import OwnershipInputForm from '@/views/forms/input/OwnershipInputForm.vue'
import ReestrShips from '@/views/reports/ReestrShips.vue'
import GetInactiveShips from '@/views/queries/GetInactiveShips.vue'
import UnpaidViolations from '@/views/queries/UnpaidViolations.vue'
import OverdueInspections from '@/views/queries/OverdueInspections.vue'
import SoonInspections from '@/views/queries/SoonInspections.vue'
import StatsViolations from '@/views/queries/StatsViolations.vue'
import StatsInspectors from '@/views/queries/StatsInspectors.vue'
import StatsInspections from '@/views/queries/StatsInspections.vue'
import StatsShips from '@/views/queries/StatsShips.vue'
import AllQueriesForm from '@/views/forms/data/AllQueriesForm.vue'

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
  // Запросы
  {
    path: '/query/get_inactive_ships',
    name: 'ShipInactiveQuery',
    component: GetInactiveShips,
    meta: {
      page_id: 1
    }
  },
  {
    path: '/query/get_statistic_ships',
    name: 'StatsShipsQuery',
    component: StatsShips,
    meta: {
      page_id: 2
    }
  },
  {
    path: '/query/get_statistic_violations',
    name: 'StatsViolationsQuery',
    component: StatsViolations,
    meta: {
      page_id: 3
    }
  },
  {
    path: '/query/get_unpaid_violations',
    name: 'UnpaidViolationQuery',
    component: UnpaidViolations,
    meta: {
      page_id: 4
    }
  },
  {
    path: '/query/get_statistic_inspectors',
    name: 'StatsInspectorsQuery',
    component: StatsInspectors,
    meta: {
      page_id: 5
    }
  },
  {
    path: '/query/get_statistic_inspections',
    name: 'StatsInspectionsQuery',
    component: StatsInspections,
    meta: {
      page_id: 6
    }
  },
  {
    path: '/query/get_soon_inspections',
    name: 'SoonInspectionQuery',
    component: SoonInspections,
    meta: {
      page_id: 7
    }
  },
  {
    path: '/query/get_overdue_inspections',
    name: 'OverdueInspectionQuery',
    component: OverdueInspections,
    meta: {
      page_id: 8
    }
  },
  // Отчёты
  {
    path: '/report/reestr_ships',
    name: 'ShipReestrReport',
    component: ReestrShips,
    meta: {
      page_id: 1
    }
  },
  // ФВВ
  {
    path: '/form/input/owner/:id?',
    name: 'OwnerInputForm',
    component: OwnerInputForm,
    props: true,
    meta: {
      page_id: 1
    }
  },
  {
    path: '/form/input/inspector/:id?',
    name: 'InspectorInputForm',
    component: InspectorInputForm,
    props: true,
    meta: {
      page_id: 2
    }
  },
  {
    path: '/form/input/ship/:id?',
    name: 'ShipInputForm',
    component: ShipInputForm,
    props: true,
    meta: {
      page_id: 3
    }
  },
  {
    path: '/form/input/violation/:id?',
    name: 'ViolationInputForm',
    component: ViolationInputForm,
    props: true,
    meta: {
      page_id: 4
    }
  },
  {
    path: '/form/input/inspection/:id?',
    name: 'InspectionInputForm',
    component: InspectionInputForm,
    props: true,
    meta: {
      page_id: 5
    }
  },
  {
    path: '/form/input/ownership/:id?',
    name: 'OwnershipInputForm',
    component: OwnershipInputForm,
    props: true,
    meta: {
      page_id: 6
    }
  },
  {
    path: '/form/input/skipper/:id?',
    name: 'SkipperInputForm',
    component: SkipperInputForm,
    props: true,
    meta: {
      page_id: 7
    }
  },
  // ФАД
  {
    path: '/',
    name: 'OwnerDataForm',
    component: OwnerDataForm,
    meta: {
      page_id: 0
    }
  },
  {
    path: '/form/data/ships/:id?',
    name: 'ShipDataForm',
    component: ShipDataForm,
    props: true,
    meta: {
      page_id: 8
    }
  },
  {
    path: '/form/data/inspectors',
    name: 'InspectorDataForm',
    component: InspectorDataForm,
    meta: {
      page_id: 9
    }
  },
  {
    path: '/form/data/inspections/inspector/:inspector_id?',
    name: 'InspectionInspectorDataForm',
    component: InspectionDataForm,
    props: true,
    meta: {
      page_id: 10
    }
  },
  {
    path: '/form/data/inspections/ship/:ship_id?',
    name: 'InspectionShipDataForm',
    component: InspectionDataForm,
    props: true,
    meta: {
      page_id: 10
    }
  },
  {
    path: '/form/data/violation/inspector/:inspector_id?',
    name: 'ViolationInspectorDataForm',
    component: ViolationDataForm,
    props: true,
    meta: {
      page_id: 11
    }
  },
  {
    path: '/form/data/violation/ship/:ship_id?',
    name: 'ViolationShipDataForm',
    component: ViolationDataForm,
    props: true,
    meta: {
      page_id: 11
    }
  },
  {
    path: '/form/data/ownership/:ship_id?',
    name: 'OwnershipDataForm',
    component: OwnershipDataForm,
    props: true,
    meta: {
      page_id: 12
    }
  },
  {
    path: '/form/data/skipper',
    name: 'SkipperDataForm',
    component: SkipperDataForm,
    props: true,
    meta: {
      page_id: 13
    }
  },
  {
    path: '/form/data/queries',
    name: 'QueriesDataForm',
    component: AllQueriesForm,
    meta: {
      page_id: 14
    }
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router
