import type { Ship } from '@/types/ship.ts'
import type { Inspector } from '@/types/inspector.ts'

export interface Violation {
  id: string;
  ship_id: string;
  inspector_id: string;
  violation_date: Date;
  amount: string;
  description: string;
  status: 'Исполнено' | 'Не исполнено';

  Ship?: Ship;
  Inspector?: Inspector;
}