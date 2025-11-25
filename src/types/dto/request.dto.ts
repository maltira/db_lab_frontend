
export interface OwnerCreateRequest {
  name: string;
  surname: string;
  patronymic: string;
  address: string;
  birth_date: Date;
  phone: string;
  type_of_person: string;
}

export interface InspectorCreateRequest {
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  post: string;
}

export interface ShipCreateRequest {
  type_id: string;
  owner_id: string;
  skipper_id: string;
  ship_number: string;
  registration_date: Date;
  registration_status: 'Активный' | 'Истёкший';
}
export interface InspectionCreateRequest {
  inspector_id: string;
  ship_id: string;
  inspection_date: Date;
  result: 'Годно к эксплутации' | 'Годно с замечаниями' | 'Ограниченно годно' | 'Не годно к эксплутации';
  next_inspection_date: Date;
}
export interface ViolationCreateRequest {
  inspector_id: string;
  ship_id: string;
  amount: string;
  violation_date: Date;
  status: 'Исполнено' | 'Не исполнено';
  description: string;
}