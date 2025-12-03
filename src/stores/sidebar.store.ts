import { defineStore } from 'pinia'

interface SidebarElement {
  id: number,
  name: string,
  route: string,
  access: boolean
}
interface SelectedRoute {
  id: number,
  block: 'forms' | 'tables' | 'queries' | 'reports',
  access?: boolean
}
export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    allTables: [
      { id: 1, route: "/table/owner", name: "Владельцы", access: true },
      { id: 2, route: "/table/ownership", name: 'История владения', access: true },
      { id: 3, route: "/table/skipper", name: "Судоводители", access: true },
      { id: 4, route: "/table/ship", name: "Судна", access: true },
      { id: 5, route: "/table/type", name: "Типы судов", access: true },
      { id: 6, route: "/table/inspector", name: "Инспектора", access: true },
      { id: 7, route: "/table/violation", name: "Нарушения", access: true },
      { id: 8, route: "/table/inspection", name: "ТО", access: true },
    ] as SidebarElement[],
    allQueries: [
      { id: 1, route: "/query/get_inactive_ships", name: "Истёкшая регистрация судов", access: true  },
      { id: 2, route: "/query/get_statistic_ships", name: "Статистика по суднам", access: true  },
      { id: 3, route: "/query/get_statistic_violations", name: "Статистика по штрафам", access: false  },
      { id: 4, route: "/query/get_unpaid_violations", name: "Неоплаченные штрафы", access: true  },
      { id: 5, route: "/query/get_statistic_inspectors", name: "Статистика по инспекторам", access: true  },
      { id: 6, route: "/query/get_statistic_inspections", name: "Статистика по техосмотрам", access: true  },
      { id: 7, route: "/query/get_soon_inspections", name: "Предстоящие техосмотры", access: true  },
      { id: 8, route: "/query/get_overdue_inspections", name: "Просроченные техосмотры", access: true },
    ] as SidebarElement[],
    allForms: [
      { id: 0, route: "/", name: "Главная форма", access: true },
      { id: 1, route: '/form/input/owner', name: "ФВВ_Владелец", access: true},
      { id: 2, route: '/form/input/inspector', name: "ФВВ_Инспектор", access: true},
      { id: 3, route: '/form/input/ship', name: "ФВВ_Судно", access: true},
      { id: 4, route: '/form/input/violation', name: "ФВВ_Нарушение", access: true},
      { id: 5, route: '/form/input/inspection', name: "ФВВ_ТехОсмотр", access: true},
      { id: 6, route: '/form/input/ownership', name: "ФВВ_ИсторияВладения", access: true},
      { id: 7, route: '/form/input/skipper', name: "ФВВ_Судоводитель", access: true},
      { id: 8, route: '/form/data/ships', name: "ФАД_Судна", access: true},
      { id: 9, route: '/form/data/inspectors', name: "ФАД_Инспекторы", access: true},
      { id: 10, route: '/form/data/inspections/ship', name: "ФАД_ТехОсмотры", access: true},
      { id: 11, route: '/form/data/violation/ship', name: "ФАД_Нарушения", access: true},
      { id: 12, route: '/form/data/ownership', name: "ФАД_ИсторияВладения", access: true},
      { id: 13, route: '/form/data/skipper', name: "ФАД_Судоводители", access: true},
      { id: 14, route: '/form/data/queries', name: "Список запросов", access: false },
    ] as SidebarElement[],
    allReports: [
      { id: 1, route: "/report/reestr_ships", name: "Реестр судов", access: true },
    ] as SidebarElement[],
    selectedRoute: { block: 'forms', id: 0 } as SelectedRoute,
  }),
})