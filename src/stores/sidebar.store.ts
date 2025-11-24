import { defineStore } from 'pinia'

interface SidebarElement {
  id: number,
  name: string,
  route: string
}
interface SelectedRoute {
  id: number,
  block: 'forms' | 'tables' | 'queries',
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
    allQueries: [] as SidebarElement[],
    allForms: [
      { id: 0, route: "/", name: "Главная форма" },
      { id: 1, route: '/form/input/owner', name: "ФВВ_Владелец"},
      { id: 2, route: '/form/input/inspector', name: "ФВВ_Инспектор"},
      { id: 3, route: '/form/input/ship', name: "ФВВ_Судно"},
      { id: 4, route: '/form/input/violation', name: "ФВВ_Нарушение"},
      { id: 5, route: '/form/input/inspection', name: "ФВВ_ТехОсмотр"},
      { id: 6, route: '/form/data/ships', name: "ФАД_Судна"},
      { id: 7, route: '/form/data/inspectors', name: "ФАД_Инспекторы"},
      { id: 8, route: '/form/data/inspections/ship', name: "ФАД_ТехОсмотры"},
      { id: 9, route: '/form/data/violation/ship', name: "ФАД_Нарушения"},
    ] as SidebarElement[],
    selectedRoute: { block: 'forms', id: 0 } as SelectedRoute,
  }),
})