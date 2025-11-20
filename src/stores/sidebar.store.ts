import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    allTables: [
      { route: "/table/owner", name: "Владельцы" },
      { route: "/table/ownership", name: 'История владения' },
      { route: "/table/skipper", name: "Судоводители" },
      { route: "/table/ship", name: "Судна" },
      { route: "/table/type", name: "Типы судов" },
      { route: "/table/inspector", name: "Инспектора" },
      { route: "/table/violation", name: "Нарушения" },
      { route: "/table/inspection", name: "ТО" },
    ],
    allQueries: [],
    allForms: [
      { route: "/", name: "Главная форма" },
      { route: '/form/input/owner', name: "ФВВ_Владелец"},
      { route: '/form/data/ships', name: "ФАД_Судна"},
      { route: '/form/data/inspectors', name: "ФАД_Инспекторы"}
    ],
    selectedRoute: { block: 'forms', id: 0 }
  }),
})