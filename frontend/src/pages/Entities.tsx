import React, { useEffect, useState } from 'react';
import { Building2, Eye, Edit, FileText } from 'lucide-react';

import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ApiError, apiClient } from '../shared/api/api-client';

const STATUS_LABELS = {
  active: 'Aktywny',
  inactive: 'Nieaktywny',
  suspended: 'Zawieszony',
} as const;

type EntityStatus = keyof typeof STATUS_LABELS;

type EntityDto = {
  id?: number | string;
  entity_id?: number | string;
  uknfCode?: string | null;
  uknf_code?: string | null;
  name?: string | null;
  nip?: string | null;
  krs?: string | null;
  lei?: string | null;
  street?: string | null;
  buildingNumber?: string | null;
  building_number?: string | null;
  apartmentNumber?: string | null;
  apartment_number?: string | null;
  postalCode?: string | null;
  postal_code?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  registryNumber?: string | null;
  registry_number?: string | null;
  status?: EntityStatus | string | null;
  category?: string | null;
  crossBorder?: boolean | string | number | null;
  cross_border?: boolean | string | number | null;
  type?: string | null;
  createdAt?: string | null;
  created_at?: string | null;
  contactPerson?: string | null;
  contact_person?: string | null;
};

type EntityRow = {
  entity_id: number | string | null;
  id: string;
  uknf_code: string;
  name: string;
  nip: string;
  krs: string;
  lei: string;
  type: string;
  status: string;
  statusRaw: string;
  category: string;
  cross_border: boolean;
  contactPerson: string;
  street: string;
  building_number: string;
  apartment_number: string;
  postal_code: string;
  city: string;
  email: string;
  phone: string;
  registry_number: string;
  created_at: string | null;
};

type EntityFormState = {
  name: string;
  uknfCode: string;
  nip: string;
  krs: string;
  lei: string;
  type: string;
  status: EntityStatus;
  category: string;
  crossBorder: boolean;
  contactPerson: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  registryNumber: string;
};

type EntityCreatePayload = {
  name: string;
  uknfCode?: string | null;
  nip?: string | null;
  krs?: string | null;
  lei?: string | null;
  type?: string | null;
  status: EntityStatus;
  category?: string | null;
  crossBorder: boolean;
  contactPerson?: string | null;
  street?: string | null;
  buildingNumber?: string | null;
  apartmentNumber?: string | null;
  postalCode?: string | null;
  city?: string | null;
  email?: string | null;
  phone?: string | null;
  registryNumber?: string | null;
};

const INITIAL_FORM_STATE: EntityFormState = {
  name: '',
  uknfCode: '',
  nip: '',
  krs: '',
  lei: '',
  type: '',
  status: 'active',
  category: '',
  crossBorder: false,
  contactPerson: '',
  street: '',
  buildingNumber: '',
  apartmentNumber: '',
  postalCode: '',
  city: '',
  email: '',
  phone: '',
  registryNumber: '',
};

const stringValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const booleanValue = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (['true', '1', 'yes', 'tak'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'no', 'nie'].includes(normalized)) {
      return false;
    }
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  return false;
};

const normalizeEntity = (entity: EntityDto): EntityRow => {
  const identifier = entity.entity_id ?? entity.id ?? null;
  const status = stringValue(entity.status);

  return {
    entity_id: identifier,
    id: identifier !== null ? String(identifier) : '',
    uknf_code: stringValue(entity.uknfCode ?? entity.uknf_code),
    name: stringValue(entity.name),
    nip: stringValue(entity.nip),
    krs: stringValue(entity.krs),
    lei: stringValue(entity.lei),
    type: stringValue(entity.type),
    status,
    statusRaw: status,
    category: stringValue(entity.category),
    cross_border: booleanValue(entity.crossBorder ?? entity.cross_border),
    contactPerson: stringValue(entity.contactPerson ?? entity.contact_person),
    street: stringValue(entity.street),
    building_number: stringValue(entity.buildingNumber ?? entity.building_number),
    apartment_number: stringValue(entity.apartmentNumber ?? entity.apartment_number),
    postal_code: stringValue(entity.postalCode ?? entity.postal_code),
    city: stringValue(entity.city),
    email: stringValue(entity.email),
    phone: stringValue(entity.phone),
    registry_number: stringValue(entity.registryNumber ?? entity.registry_number),
    created_at: entity.createdAt ?? entity.created_at ?? null,
  };
};

const emptyToNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const mapFormToPayload = (values: EntityFormState): EntityCreatePayload => ({
  name: values.name.trim(),
  uknfCode: emptyToNull(values.uknfCode),
  nip: emptyToNull(values.nip),
  krs: emptyToNull(values.krs),
  lei: emptyToNull(values.lei),
  type: emptyToNull(values.type),
  status: values.status,
  category: emptyToNull(values.category),
  crossBorder: values.crossBorder,
  contactPerson: emptyToNull(values.contactPerson),
  street: emptyToNull(values.street),
  buildingNumber: emptyToNull(values.buildingNumber),
  apartmentNumber: emptyToNull(values.apartmentNumber),
  postalCode: emptyToNull(values.postalCode),
  city: emptyToNull(values.city),
  email: emptyToNull(values.email),
  phone: emptyToNull(values.phone),
  registryNumber: emptyToNull(values.registryNumber),
});

const buildFallbackEntity = (values: EntityFormState, identifier: string | number): EntityRow => ({
  entity_id: identifier,
  id: String(identifier),
  uknf_code: values.uknfCode,
  name: values.name,
  nip: values.nip,
  krs: values.krs,
  lei: values.lei,
  type: values.type,
  status: values.status,
  statusRaw: values.status,
  category: values.category,
  cross_border: values.crossBorder,
  contactPerson: values.contactPerson,
  street: values.street,
  building_number: values.buildingNumber,
  apartment_number: values.apartmentNumber,
  postal_code: values.postalCode,
  city: values.city,
  email: values.email,
  phone: values.phone,
  registry_number: values.registryNumber,
  created_at: new Date().toISOString(),
});

const STATUS_OPTIONS: { value: EntityStatus; label: string }[] = [
  { value: 'active', label: STATUS_LABELS.active },
  { value: 'inactive', label: STATUS_LABELS.inactive },
  { value: 'suspended', label: STATUS_LABELS.suspended },
];

const getStatusVariant = (
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'active':
      return 'default';
    case 'suspended':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: string) => STATUS_LABELS[status as EntityStatus] ?? status;

type EntityFormStringField = Exclude<keyof EntityFormState, 'crossBorder' | 'status'>;

export function Entities() {
  const [entities, setEntities] = useState<EntityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<EntityFormState>(INITIAL_FORM_STATE);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<EntityDto[]>('/entities');
        const normalized = Array.isArray(response)
          ? response.map((entity) => normalizeEntity(entity))
          : [];
        setEntities(normalized);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Nie udało się pobrać listy podmiotów.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  const handleDialogChange = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) {
      setCreateForm(INITIAL_FORM_STATE);
      setCreateError(null);
      setCreateLoading(false);
    }
  };

  const handleStringChange = (field: EntityFormStringField) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setCreateForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);

    if (!createForm.name.trim()) {
      setCreateError('Nazwa podmiotu jest wymagana.');
      return;
    }

    setCreateLoading(true);
    try {
      const payload = mapFormToPayload(createForm);
      const created = await apiClient.post<EntityDto | null>('/entities', payload);
      const fallbackId = `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const newEntity = created ? normalizeEntity(created) : buildFallbackEntity(createForm, fallbackId);

      setEntities((prev) => [newEntity, ...prev]);
      handleDialogChange(false);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Nie udało się utworzyć podmiotu.';
      setCreateError(message);
    } finally {
      setCreateLoading(false);
    }
  };

  const columns: Column<EntityRow>[] = [
    {
      key: 'name',
      label: 'Nazwa podmiotu',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'entity_id',
      label: 'Entity ID',
    },
    {
      key: 'uknf_code',
      label: 'Kod UKNF',
    },
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'nip',
      label: 'NIP',
    },
    {
      key: 'krs',
      label: 'KRS',
    },
    {
      key: 'lei',
      label: 'LEI',
    },
    {
      key: 'type',
      label: 'Typ podmiotu',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={getStatusVariant(value)}>
          {getStatusLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'category',
      label: 'Kategoria',
    },
    {
      key: 'cross_border',
      label: 'Transgraniczny',
      render: (value) => (value ? 'Tak' : 'Nie'),
    },
    {
      key: 'contactPerson',
      label: 'Osoba kontaktowa',
    },
    {
      key: 'street',
      label: 'Ulica',
    },
    {
      key: 'building_number',
      label: 'Nr budynku',
    },
    {
      key: 'apartment_number',
      label: 'Nr lokalu',
    },
    {
      key: 'postal_code',
      label: 'Kod pocztowy',
    },
    {
      key: 'city',
      label: 'Miasto',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phone',
      label: 'Telefon',
    },
    {
      key: 'registry_number',
      label: 'Nr rejestru UKNF',
    },
    {
      key: 'created_at',
      label: 'Utworzono',
      render: (value) => (value ? new Date(value).toLocaleString() : ''),
    },
    {
      key: 'statusRaw',
      label: 'Surowy status',
      render: (_value, item) => item.status,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Kartoteka podmiotów</h2>
          <p className="text-muted-foreground">
            Zarządzanie danymi podmiotów nadzorowanych
          </p>
        </div>
        <Button onClick={() => handleDialogChange(true)}>
          <Building2 className="mr-2 h-4 w-4" />
          Nowy podmiot
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Wszystkie ({entities.length})
        </Button>
        <Button variant="outline" size="sm">
          Banki ({entities.filter((entity) => entity.type === 'Bank').length})
        </Button>
        <Button variant="outline" size="sm">
          Zakłady Ubezpieczeń ({entities.filter((entity) => entity.type === 'Zakład Ubezpieczeń').length})
        </Button>
        <Button variant="outline" size="sm">
          Fundusze ({entities.filter((entity) => entity.type === 'Fundusz Inwestycyjny').length})
        </Button>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Ładowanie danych...</div>}
      {error && <div className="text-sm text-destructive">Błąd: {error}</div>}

      <DataTable
        data={entities}
        columns={columns}
        searchPlaceholder="Szukaj podmiotów..."
        exportFilename="podmioty"
        actions={(entity) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Akcje
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Podgląd
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edytuj dane
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Historia zmian
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <Dialog open={isCreateOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nowy podmiot</DialogTitle>
            <DialogDescription>
              Uzupełnij dane podmiotu, aby dodać go do rejestru.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-6" onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="entity-name">Nazwa</Label>
                <Input
                  id="entity-name"
                  value={createForm.name}
                  onChange={handleStringChange('name')}
                  required
                  placeholder="Nazwa podmiotu"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-uknf">Kod UKNF</Label>
                <Input
                  id="entity-uknf"
                  value={createForm.uknfCode}
                  onChange={handleStringChange('uknfCode')}
                  placeholder="np. UKNF/123"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-nip">NIP</Label>
                <Input
                  id="entity-nip"
                  value={createForm.nip}
                  onChange={handleStringChange('nip')}
                  placeholder="Numer NIP"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-krs">KRS</Label>
                <Input
                  id="entity-krs"
                  value={createForm.krs}
                  onChange={handleStringChange('krs')}
                  placeholder="Numer KRS"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-lei">LEI</Label>
                <Input
                  id="entity-lei"
                  value={createForm.lei}
                  onChange={handleStringChange('lei')}
                  placeholder="Numer LEI"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-type">Typ</Label>
                <Input
                  id="entity-type"
                  value={createForm.type}
                  onChange={handleStringChange('type')}
                  placeholder="np. Bank"
                />
              </div>

              <div className="grid gap-1.5">
                <Label>Status</Label>
                <Select
                  value={createForm.status}
                  onValueChange={(value) =>
                    setCreateForm((prev) => ({ ...prev, status: value as EntityStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-category">Kategoria</Label>
                <Input
                  id="entity-category"
                  value={createForm.category}
                  onChange={handleStringChange('category')}
                  placeholder="np. Instytucja finansowa"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-contact">Osoba kontaktowa</Label>
                <Input
                  id="entity-contact"
                  value={createForm.contactPerson}
                  onChange={handleStringChange('contactPerson')}
                  placeholder="Imię i nazwisko"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-email">Email</Label>
                <Input
                  id="entity-email"
                  type="email"
                  value={createForm.email}
                  onChange={handleStringChange('email')}
                  placeholder="kontakt@firma.pl"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-phone">Telefon</Label>
                <Input
                  id="entity-phone"
                  type="tel"
                  value={createForm.phone}
                  onChange={handleStringChange('phone')}
                  placeholder="np. +48 123 456 789"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-registry">Nr rejestru UKNF</Label>
                <Input
                  id="entity-registry"
                  value={createForm.registryNumber}
                  onChange={handleStringChange('registryNumber')}
                  placeholder="Numer rejestrowy"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-street">Ulica</Label>
                <Input
                  id="entity-street"
                  value={createForm.street}
                  onChange={handleStringChange('street')}
                  placeholder="np. Ulica Główna"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-building">Nr budynku</Label>
                <Input
                  id="entity-building"
                  value={createForm.buildingNumber}
                  onChange={handleStringChange('buildingNumber')}
                  placeholder="np. 12A"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-apartment">Nr lokalu</Label>
                <Input
                  id="entity-apartment"
                  value={createForm.apartmentNumber}
                  onChange={handleStringChange('apartmentNumber')}
                  placeholder="np. 4"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-postal">Kod pocztowy</Label>
                <Input
                  id="entity-postal"
                  value={createForm.postalCode}
                  onChange={handleStringChange('postalCode')}
                  placeholder="np. 00-000"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="entity-city">Miasto</Label>
                <Input
                  id="entity-city"
                  value={createForm.city}
                  onChange={handleStringChange('city')}
                  placeholder="np. Warszawa"
                />
              </div>
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="entity-cross-border"
                  checked={createForm.crossBorder}
                  onCheckedChange={(checked) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      crossBorder: checked === true,
                    }))
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="entity-cross-border" className="leading-tight">
                    Transgraniczny
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Zaznacz, jeśli podmiot prowadzi działalność transgraniczną.
                  </p>
                </div>
              </div>
            </div>

            {createError && <p className="text-sm text-destructive">{createError}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={createLoading}
              >
                Anuluj
              </Button>
              <Button type="submit" disabled={createLoading}>
                {createLoading ? 'Tworzenie...' : 'Utwórz'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
