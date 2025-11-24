import type { Ship } from '@/types/ship.ts'
import type { Inspector } from '@/types/inspector.ts'

export interface Inspection {
  id: string;
  inspector_id: string;
  ship_id: string;
  inspection_date: Date;
  result: 'Годно к эксплутации' | 'Годно с замечаниями' | 'Ограниченно годно' | 'Не годно к эксплутации';
  next_inspection_date: Date;

  Inspector?: Inspector;
  Ship?: Ship;
}