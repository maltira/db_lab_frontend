import { defineStore } from 'pinia'

interface SidebarElement {
  id: number,
  name: string,
  route: string
}
interface SelectedRoute {
  id: number,
  block: 'forms' | 'tables' | 'queries' | 'reports',
}
export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    allTables: [
      { id: 1, route: "/table/owner", name: "Владельцы" },
      { id: 2, route: "/table/ownership", name: 'История владения' },
      { id: 3, route: "/table/skipper", name: "Судоводители" },
      { id: 4, route: "/table/ship", name: "Судна" },
      { id: 5, route: "/table/type", name: "Типы судов" },
      { id: 6, route: "/table/inspector", name: "Инспектора" },
      { id: 7, route: "/table/violation", name: "Нарушения" },
      { id: 8, route: "/table/inspection", name: "ТО" },
    ] as SidebarElement[],
    allQueries: [
      { id: 1, route: "/query/get_inactive_ships", name: "Истёкшая регистрация судов" },
      { id: 2, route: "/query/get_statistic_ships", name: "Статистика по суднам" },
      { id: 3, route: "/query/get_statistic_violations", name: "Статистика по штрафам" },
      { id: 4, route: "/query/get_unpaid_violations", name: "Неоплаченные штрафы" },
      { id: 5, route: "/query/get_statistic_inspectors", name: "Статистика по инспекторам" },
      { id: 6, route: "/query/get_statistic_inspections", name: "Статистика по техосмотрам" },
      { id: 7, route: "/query/get_soon_inspections", name: "Предстоящие техосмотры" },
      { id: 8, route: "/query/get_overdue_inspections", name: "Просроченные техосмотры" },

    ] as SidebarElement[],
    allForms: [
      { id: 0, route: "/", name: "Главная форма" },
      { id: 1, route: '/form/input/owner', name: "ФВВ_Владелец"},
      { id: 2, route: '/form/input/inspector', name: "ФВВ_Инспектор"},
      { id: 3, route: '/form/input/ship', name: "ФВВ_Судно"},
      { id: 4, route: '/form/input/violation', name: "ФВВ_Нарушение"},
      { id: 5, route: '/form/input/inspection', name: "ФВВ_ТехОсмотр"},
      { id: 6, route: '/form/input/ownership', name: "ФВВ_ИсторияВладения"},
      { id: 7, route: '/form/input/skipper', name: "ФВВ_Судоводитель"},
      { id: 8, route: '/form/data/ships', name: "ФАД_Судна"},
      { id: 9, route: '/form/data/inspectors', name: "ФАД_Инспекторы"},
      { id: 10, route: '/form/data/inspections/ship', name: "ФАД_ТехОсмотры"},
      { id: 11, route: '/form/data/violation/ship', name: "ФАД_Нарушения"},
      { id: 12, route: '/form/data/ownership', name: "ФАД_ИсторияВладения"},
      { id: 13, route: '/form/data/skipper', name: "ФАД_Судоводители"},
    ] as SidebarElement[],
    allReports: [
      { id: 1, route: "/report/reestr_ships", name: "Реестр судов" },
    ] as SidebarElement[],
    selectedRoute: { block: 'forms', id: 0 } as SelectedRoute,
  }),
})