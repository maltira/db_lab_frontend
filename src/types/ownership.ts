import type { Owner } from '@/types/owner.ts'
import type { Ship } from '@/types/ship.ts'

export interface Ownership {
  id: string;
  old_owner: string;
  new_owner: string;
  transfer_date: Date;
  ship_id: string;

  ShipOldOwner: Owner;
  ShipNewOwner: Owner;
  Ship: Ship;
}