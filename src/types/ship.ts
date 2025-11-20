import type { Owner } from '@/types/owner.ts'
import type { Skipper } from '@/types/skipper.ts'

export interface ShipType {
  id: string;
  name: string;
}
export interface Ship {
  id: string;
  name: string;
  type_id: string;
  owner_id: string;
  skipper_id: string;
  ship_number: string;
  registration_date: Date;
  registration_status: "Активный" | "Истёкший";

  Type: ShipType;
  Owner: Owner;
  Skipper: Skipper;
}