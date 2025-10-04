export type EntityStatus = 'active' | 'inactive' | 'suspended' | string;

export interface EntityDto {
  id?: number | string;
  uknfCode?: string | null;
  name?: string | null;
  nip?: string | null;
  krs?: string | null;
  lei?: string | null;
  street?: string | null;
  buildingNumber?: string | null;
  apartmentNumber?: string | null;
  postalCode?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  registryNumber?: string | null;
  status?: EntityStatus | null;
  category?: string | null;
  crossBorder?: boolean | null;
  type?: string | null;
  createdAt?: string | null;
}

export interface Entity {
  id: string;
  entityId: string;
  uknfCode: string;
  name: string;
  nip: string;
  krs: string;
  lei: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  registryNumber: string;
  status: EntityStatus;
  category: string;
  crossBorder: boolean;
  type: string;
  createdAt: string | null;
}

export interface EntityPayload {
  uknfCode?: string | null;
  name: string;
  nip?: string | null;
  krs?: string | null;
  lei?: string | null;
  street?: string | null;
  buildingNumber?: string | null;
  apartmentNumber?: string | null;
  postalCode?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  registryNumber?: string | null;
  status: EntityStatus;
  category?: string | null;
  crossBorder?: boolean;
  type?: string | null;
}
