import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Edit, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import { DataTable, type Column } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { formatDateTime } from '../lib/utils';
import { ApiError } from '../shared/api/api-client';
import { entityClient } from '../features/entities/services/entity-client';
import { mapEntityDtoToEntity, mapEntityToPayload } from '../features/entities/services/entity-mapper';
import type { Entity, EntityPayload, EntityStatus } from '../features/entities/types/entity';

const STATUS_OPTIONS: { value: EntityStatus; label: string }[] = [
  { value: 'active', label: 'Aktywny' },
  { value: 'inactive', label: 'Nieaktywny' },
  { value: 'suspended', label: 'Zawieszony' },
];

const ALL_TYPES_FILTER = '__all__';
const UNKNOWN_TYPE_LABEL = 'Nieokreślony';

type EntityFormState = {
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
};

const INITIAL_FORM_STATE: EntityFormState = {
  uknfCode: '',
  name: '',
  nip: '',
  krs: '',
  lei: '',
  street: '',
  buildingNumber: '',
  apartmentNumber: '',
  postalCode: '',
  city: '',
  phone: '',
  email: '',
  registryNumber: '',
  status: 'active',
  category: '',
  crossBorder: false,
  type: '',
};

const mapEntityToFormState = (entity: Entity): EntityFormState => ({
  uknfCode: entity.uknfCode,
  name: entity.name,
  nip: entity.nip,
  krs: entity.krs,
  lei: entity.lei,
  street: entity.street,
  buildingNumber: entity.buildingNumber,
  apartmentNumber: entity.apartmentNumber,
  postalCode: entity.postalCode,
  city: entity.city,
  phone: entity.phone,
  email: entity.email,
  registryNumber: entity.registryNumber,
  status: (entity.status as EntityStatus) || 'active',
  category: entity.category,
  crossBorder: entity.crossBorder,
  type: entity.type,
});

const mapFormStateToPayload = (form: EntityFormState): EntityPayload =>
  mapEntityToPayload(form);

const getStatusVariant = (
  status: EntityStatus,
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

const getStatusLabel = (status: EntityStatus) =>
  STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;

export function Entities() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewEntity, setViewEntity] = useState<Entity | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [formState, setFormState] = useState<EntityFormState>(INITIAL_FORM_STATE);
  const [activeEntity, setActiveEntity] = useState<Entity | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Entity | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES_FILTER);

  const loadEntities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await entityClient.list();
      const normalized = Array.isArray(data)
        ? data.map((dto) => mapEntityDtoToEntity(dto))
        : [];
      setEntities(normalized);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Nie udało się pobrać listy podmiotów.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntities();
  }, []);

  const typeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    entities.forEach((entity) => {
      const key = entity.type?.trim() || UNKNOWN_TYPE_LABEL;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => a.label.localeCompare(b.label, 'pl'));
  }, [entities]);

  useEffect(() => {
    if (typeFilter === ALL_TYPES_FILTER) {
      return;
    }
    const exists = typeOptions.some((option) => option.label === typeFilter);
    if (!exists) {
      setTypeFilter(ALL_TYPES_FILTER);
    }
  }, [typeFilter, typeOptions]);

  const filteredEntities = useMemo(() => {
    if (typeFilter === ALL_TYPES_FILTER) {
      return entities;
    }
    return entities.filter((entity) => (entity.type?.trim() || UNKNOWN_TYPE_LABEL) === typeFilter);
  }, [entities, typeFilter]);

  const columns: Column<Entity>[] = useMemo(
    () => [
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
      { key: 'uknfCode', label: 'Kod UKNF' },
      { key: 'nip', label: 'NIP' },
      { key: 'krs', label: 'KRS' },
      { key: 'lei', label: 'LEI' },
      { key: 'type', label: 'Typ' },
      {
        key: 'status',
        label: 'Status',
        render: (value: EntityStatus) => (
          <Badge variant={getStatusVariant(value)}>{
            STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value
          }</Badge>
        ),
      },
      { key: 'category', label: 'Kategoria' },
      {
        key: 'crossBorder',
        label: 'Transgraniczny',
        render: (value: boolean) => (value ? 'Tak' : 'Nie'),
      },
      { key: 'city', label: 'Miasto' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Telefon' },
      { key: 'registryNumber', label: 'Nr rejestru UKNF' },
      {
        key: 'createdAt',
        label: 'Utworzono',
        render: (value: string | null) => (value ? formatDateTime(value) : '—'),
      },
    ],
    [],
  );

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormState(INITIAL_FORM_STATE);
      setActiveEntity(null);
      setSubmitLoading(false);
    }
  };

  const openCreateDialog = () => {
    setDialogMode('create');
    setFormState(INITIAL_FORM_STATE);
    setActiveEntity(null);
    setDialogOpen(true);
  };

  const openEditDialog = (entity: Entity) => {
    setDialogMode('edit');
    setActiveEntity(entity);
    setFormState(mapEntityToFormState(entity));
    setDialogOpen(true);
  };

  const handleFieldChange = (field: keyof EntityFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      toast.error('Nazwa podmiotu jest wymagana.');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = mapFormStateToPayload(formState);

      if (dialogMode === 'create') {
        await entityClient.create(payload);
        await loadEntities();
        toast.success('Podmiot został utworzony.');
      } else if (activeEntity) {
        await entityClient.update(activeEntity.entityId, payload);
        await loadEntities();
        toast.success('Zapisano zmiany podmiotu.');
      }

      handleDialogChange(false);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Operacja nie powiodła się.';
      toast.error(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);
    try {
      await entityClient.remove(deleteTarget.entityId);
      await loadEntities();
      toast.success('Podmiot został usunięty.');
      setDeleteTarget(null);
      setDeleteOpen(false);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Nie udało się usunąć podmiotu.';
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Kartoteka podmiotów</h2>
          <p className="text-muted-foreground">
            Zarządzanie danymi podmiotów nadzorowanych
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Building2 className="mr-2 h-4 w-4" />
          Nowy podmiot
        </Button>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Ładowanie danych...</div>}
      {error && <div className="text-sm text-destructive">Błąd: {error}</div>}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={typeFilter === ALL_TYPES_FILTER ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter(ALL_TYPES_FILTER)}
        >
          Wszystkie ({entities.length})
        </Button>
        {typeOptions.map((option) => (
          <Button
            key={option.label}
            variant={typeFilter === option.label ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter(option.label)}
          >
            {option.label} ({option.count})
          </Button>
        ))}
      </div>

      <DataTable
        data={filteredEntities}
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
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setViewEntity(entity);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Podgląd
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  openEditDialog(entity);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edytuj
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setDeleteTarget(entity);
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <Dialog
        open={Boolean(viewEntity)}
        onOpenChange={(open) => {
          if (!open) {
            setViewEntity(null);
          }
        }}
      >
        {viewEntity ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Szczegóły podmiotu</DialogTitle>
              <DialogDescription>
                Podgląd danych podmiotu {viewEntity.name}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Identyfikator', value: viewEntity.entityId || '—' },
                  { label: 'Kod UKNF', value: viewEntity.uknfCode || '—' },
                  { label: 'NIP', value: viewEntity.nip || '—' },
                  { label: 'KRS', value: viewEntity.krs || '—' },
                  { label: 'LEI', value: viewEntity.lei || '—' },
                  { label: 'Typ', value: viewEntity.type || '—' },
                  { label: 'Status', value: getStatusLabel(viewEntity.status as EntityStatus) },
                  { label: 'Kategoria', value: viewEntity.category || '—' },
                  { label: 'Transgraniczny', value: viewEntity.crossBorder ? 'Tak' : 'Nie' },
                  { label: 'Miasto', value: viewEntity.city || '—' },
                  {
                    label: 'Adres',
                    value: [
                      viewEntity.street,
                      viewEntity.buildingNumber,
                      viewEntity.apartmentNumber,
                      viewEntity.postalCode,
                    ]
                      .filter(Boolean)
                      .join(' ') || '—',
                  },
                  { label: 'Email', value: viewEntity.email || '—' },
                  { label: 'Telefon', value: viewEntity.phone || '—' },
                  { label: 'Nr rejestru UKNF', value: viewEntity.registryNumber || '—' },
                  {
                    label: 'Utworzono',
                    value: viewEntity.createdAt ? formatDateTime(viewEntity.createdAt) : '—',
                  },
                ].map((row) => (
                  <div key={row.label} className="space-y-1">
                    <dt className="text-xs font-medium uppercase text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-sm">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewEntity(null)}>
                Zamknij
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col overflow-hidden p-0 sm:max-w-3xl">
          <form className="flex h-full flex-col" onSubmit={handleSubmit}>
            <DialogHeader className="flex-shrink-0 space-y-2 px-6 pt-6">
              <DialogTitle>
                {dialogMode === 'create' ? 'Nowy podmiot' : 'Edycja podmiotu'}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === 'create'
                  ? 'Uzupełnij dane podmiotu, aby dodać go do rejestru.'
                  : 'Zaktualizuj informacje dotyczące wybranego podmiotu.'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 min-h-0 overflow-y-auto px-6">
              <div className="space-y-6 pb-6 pr-2 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-name">Nazwa</Label>
                    <Input
                      id="entity-name"
                      value={formState.name}
                      onChange={handleFieldChange('name')}
                      required
                      placeholder="Nazwa podmiotu"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-uknf">Kod UKNF</Label>
                    <Input
                      id="entity-uknf"
                      value={formState.uknfCode}
                      onChange={handleFieldChange('uknfCode')}
                      placeholder="np. UKNF/123"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-nip">NIP</Label>
                    <Input
                      id="entity-nip"
                      value={formState.nip}
                      onChange={handleFieldChange('nip')}
                      placeholder="Numer NIP"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-krs">KRS</Label>
                    <Input
                      id="entity-krs"
                      value={formState.krs}
                      onChange={handleFieldChange('krs')}
                      placeholder="Numer KRS"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-lei">LEI</Label>
                    <Input
                      id="entity-lei"
                      value={formState.lei}
                      onChange={handleFieldChange('lei')}
                      placeholder="Numer LEI"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-type">Typ</Label>
                    <Input
                      id="entity-type"
                      value={formState.type}
                      onChange={handleFieldChange('type')}
                      placeholder="np. Bank"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label>Status</Label>
                    <Select
                      value={formState.status}
                      onValueChange={(value) =>
                        setFormState((prev) => ({ ...prev, status: value as EntityStatus }))
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
                      value={formState.category}
                      onChange={handleFieldChange('category')}
                      placeholder="np. Instytucja finansowa"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-email">Email</Label>
                    <Input
                      id="entity-email"
                      type="email"
                      value={formState.email}
                      onChange={handleFieldChange('email')}
                      placeholder="kontakt@firma.pl"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-phone">Telefon</Label>
                    <Input
                      id="entity-phone"
                      value={formState.phone}
                      onChange={handleFieldChange('phone')}
                      placeholder="np. +48 123 456 789"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-registry">Nr rejestru UKNF</Label>
                    <Input
                      id="entity-registry"
                      value={formState.registryNumber}
                      onChange={handleFieldChange('registryNumber')}
                      placeholder="Numer rejestrowy"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-street">Ulica</Label>
                    <Input
                      id="entity-street"
                      value={formState.street}
                      onChange={handleFieldChange('street')}
                      placeholder="np. Ulica Główna"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-building">Nr budynku</Label>
                    <Input
                      id="entity-building"
                      value={formState.buildingNumber}
                      onChange={handleFieldChange('buildingNumber')}
                      placeholder="np. 12A"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-apartment">Nr lokalu</Label>
                    <Input
                      id="entity-apartment"
                      value={formState.apartmentNumber}
                      onChange={handleFieldChange('apartmentNumber')}
                      placeholder="np. 4"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-postal">Kod pocztowy</Label>
                    <Input
                      id="entity-postal"
                      value={formState.postalCode}
                      onChange={handleFieldChange('postalCode')}
                      placeholder="np. 00-000"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="entity-city">Miasto</Label>
                    <Input
                      id="entity-city"
                      value={formState.city}
                      onChange={handleFieldChange('city')}
                      placeholder="np. Warszawa"
                    />
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="entity-cross-border"
                      checked={formState.crossBorder}
                      onCheckedChange={(checked) =>
                        setFormState((prev) => ({
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
              </div>
            </div>

            <DialogFooter className="flex-shrink-0 gap-2 border-t px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={submitLoading}
              >
                Anuluj
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading ? 'Zapisywanie...' : dialogMode === 'create' ? 'Utwórz' : 'Zapisz zmiany'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń podmiot</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć podmiot {deleteTarget?.name}? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Anuluj
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Usuwanie...' : 'Usuń'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
