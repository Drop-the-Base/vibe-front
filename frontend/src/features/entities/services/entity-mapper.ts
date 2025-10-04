import type { EntityDto, Entity, EntityPayload } from '../types/entity';

const stringValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

const booleanValue = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'tak'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'no', 'nie'].includes(normalized)) {
      return false;
    }
  }
  return false;
};

export const mapEntityDtoToEntity = (dto: EntityDto): Entity => {
  const identifier = dto.id ?? '';

  return {
    id: identifier !== undefined && identifier !== null ? String(identifier) : '',
    entityId: identifier !== undefined && identifier !== null ? String(identifier) : '',
    uknfCode: stringValue(dto.uknfCode),
    name: stringValue(dto.name),
    nip: stringValue(dto.nip),
    krs: stringValue(dto.krs),
    lei: stringValue(dto.lei),
    street: stringValue(dto.street),
    buildingNumber: stringValue(dto.buildingNumber),
    apartmentNumber: stringValue(dto.apartmentNumber),
    postalCode: stringValue(dto.postalCode),
    city: stringValue(dto.city),
    phone: stringValue(dto.phone),
    email: stringValue(dto.email),
    registryNumber: stringValue(dto.registryNumber),
    status: stringValue(dto.status || 'active'),
    category: stringValue(dto.category),
    crossBorder: booleanValue(dto.crossBorder),
    type: stringValue(dto.type),
    createdAt: dto.createdAt ?? null,
  };
};

export const mapEntityToPayload = (entity: EntityPayload): EntityPayload => ({
  uknfCode: entity.uknfCode?.trim() || null,
  name: entity.name.trim(),
  nip: entity.nip?.trim() || null,
  krs: entity.krs?.trim() || null,
  lei: entity.lei?.trim() || null,
  street: entity.street?.trim() || null,
  buildingNumber: entity.buildingNumber?.trim() || null,
  apartmentNumber: entity.apartmentNumber?.trim() || null,
  postalCode: entity.postalCode?.trim() || null,
  city: entity.city?.trim() || null,
  phone: entity.phone?.trim() || null,
  email: entity.email?.trim() || null,
  registryNumber: entity.registryNumber?.trim() || null,
  status: entity.status?.trim?.() || 'active',
  category: entity.category?.trim() || null,
  crossBorder: entity.crossBorder ?? false,
  type: entity.type?.trim() || null,
});
