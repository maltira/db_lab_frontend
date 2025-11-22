
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