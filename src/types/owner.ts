
export interface Owner {
  id: string;
  name: string;
  surname: string;
  patronymic?: string | null;
  address: string;
  birth_date: Date;
  phone: string;
  type_of_person: 'legal' | 'private';
}