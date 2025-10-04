import React, { useState, useEffect, useMemo } from 'react';
// data now loaded from backend /entities
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Building2, Eye, Edit, FileText } from 'lucide-react';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export function Entities() {
  // localEntities will be populated from backend /entities
  const [localEntities, setLocalEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewEntity, setViewEntity] = useState<any | null>(null);
  const [editEntity, setEditEntity] = useState<any | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const SELECT_EMPTY_VALUE = '__none__';
  const [editFormValues, setEditFormValues] = useState({
    name: '',
    type: '',
    status: 'active',
    category: '',
    contactPerson: '',
    email: '',
    phone: '',
    street: '',
    building_number: '',
    apartment_number: '',
    postal_code: '',
    city: '',
    registry_number: '',
    nip: '',
    krs: '',
    lei: '',
  });

  useEffect(() => {
    // fetch entities from backend and normalize
    const fetchEntities = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8080/entities');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const normalized = (data || []).map((s: any) => ({
          entity_id: s.id,
          id: String(s.id),
          uknf_code: s.uknfCode ?? s.uknf_code ?? '',
          name: s.name ?? '',
          nip: s.nip ?? '',
          krs: s.krs ?? '',
          lei: s.lei ?? '',
          street: s.street ?? '',
          building_number: s.buildingNumber ?? s.building_number ?? '',
          apartment_number: s.apartmentNumber ?? s.apartment_number ?? '',
          postal_code: s.postalCode ?? s.postal_code ?? '',
          city: s.city ?? '',
          phone: s.phone ?? '',
          email: s.email ?? '',
          registry_number: s.registryNumber ?? s.registry_number ?? '',
          status: s.status ?? '',
          category: s.category ?? '',
          cross_border: s.crossBorder ?? s.cross_border ?? false,
          type: s.type ?? '',
          created_at: s.createdAt ?? s.created_at ?? null,
          contactPerson: s.contactPerson ?? s.contact_person ?? '',
        }));
        setLocalEntities(normalized);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, []);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState<'active'|'inactive'|'suspended'>('active');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Aktywny',
      inactive: 'Nieaktywny',
      suspended: 'Zawieszony',
    };
    return labels[status] || status;
  };

  const formatEntityAddress = (entity: any) => {
    const streetLine = [
      entity.street,
      entity.building_number,
      entity.apartment_number,
    ]
      .filter(Boolean)
      .join(' ');
    const cityLine = [entity.postal_code, entity.city]
      .filter(Boolean)
      .join(' ');

    return [streetLine, cityLine].filter(Boolean).join(', ') || '—';
  };

  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set(
          localEntities
            .map((entity) => entity.status)
            .filter((status): status is string => Boolean(status)),
        ),
      ).map((status) => ({
        label: getStatusLabel(status),
        value: status,
      })),
    [localEntities],
  );

  const combinedStatusOptions = statusOptions.length
    ? statusOptions
    : [
        { label: getStatusLabel('active'), value: 'active' },
        { label: getStatusLabel('inactive'), value: 'inactive' },
        { label: getStatusLabel('suspended'), value: 'suspended' },
      ];

  const typeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          localEntities
            .map((entity) => entity.type)
            .filter((type): type is string => Boolean(type)),
        ),
      ).map((type) => ({
        label: type,
        value: type,
      })),
    [localEntities],
  );

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          localEntities
            .map((entity) => entity.category)
            .filter((category): category is string => Boolean(category)),
        ),
      ).map((category) => ({
        label: category,
        value: category,
      })),
    [localEntities],
  );

  useEffect(() => {
    if (editEntity) {
      setEditFormValues({
        name: editEntity.name ?? '',
        type: editEntity.type ?? '',
        status: editEntity.status ?? 'active',
        category: editEntity.category ?? '',
        contactPerson: editEntity.contactPerson ?? '',
        email: editEntity.email ?? '',
        phone: editEntity.phone ?? '',
        street: editEntity.street ?? '',
        building_number: editEntity.building_number ?? '',
        apartment_number: editEntity.apartment_number ?? '',
        postal_code: editEntity.postal_code ?? '',
        city: editEntity.city ?? '',
        registry_number: editEntity.registry_number ?? '',
        nip: editEntity.nip ?? '',
        krs: editEntity.krs ?? '',
        lei: editEntity.lei ?? '',
      });
      setEditNotes('');
    }
  }, [editEntity]);

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editEntity) {
      return;
    }

    setLocalEntities((prev) =>
      prev.map((entity) =>
        entity.id === editEntity.id
          ? {
              ...entity,
              ...editFormValues,
            }
          : entity,
      ),
    );
    toast.success('Dane podmiotu zostały zaktualizowane lokalnie.');
    setEditEntity(null);
    setEditNotes('');
  };

  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'Nazwa podmiotu',
      filter: { type: 'text', placeholder: 'Filtruj nazwę' },
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
      filter: { type: 'text', placeholder: 'Filtruj entity ID' },
    },
    {
      key: 'uknf_code',
      label: 'Kod UKNF',
      filter: { type: 'text', placeholder: 'Filtruj kod UKNF' },
    },
    {
      key: 'id',
      label: 'ID',
      filter: { type: 'text', placeholder: 'Filtruj ID' },
    },
    {
      key: 'nip',
      label: 'NIP',
      filter: { type: 'text', placeholder: 'Filtruj NIP' },
    },
    {
      key: 'krs',
      label: 'KRS',
      filter: { type: 'text', placeholder: 'Filtruj KRS' },
    },
    {
      key: 'lei',
      label: 'LEI',
      filter: { type: 'text', placeholder: 'Filtruj LEI' },
    },
    {
      key: 'type',
      label: 'Typ podmiotu',
      filter: { type: 'select', placeholder: 'Wybierz typ', options: typeOptions },
    },
    {
      key: 'status',
      label: 'Status',
      filter: { type: 'select', placeholder: 'Wybierz status', options: statusOptions },
      render: (value) => (
        <Badge variant={getStatusVariant(value)}>
          {getStatusLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'category',
      label: 'Kategoria',
      filter: { type: 'select', placeholder: 'Wybierz kategorię', options: categoryOptions },
    },
    {
      key: 'cross_border',
      label: 'Transgraniczny',
      filter: {
        type: 'select',
        placeholder: 'Wybierz opcję',
        options: [
          { label: 'Tak', value: 'true' },
          { label: 'Nie', value: 'false' },
        ],
      },
      render: (value) => (value ? 'Tak' : 'Nie'),
    },
    {
      key: 'contactPerson',
      label: 'Osoba kontaktowa',
      filter: { type: 'text', placeholder: 'Filtruj osobę' },
    },
    {
      key: 'street',
      label: 'Ulica',
      filter: { type: 'text', placeholder: 'Filtruj ulicę' },
    },
    {
      key: 'building_number',
      label: 'Nr budynku',
      filter: { type: 'text', placeholder: 'Filtruj nr budynku' },
    },
    {
      key: 'apartment_number',
      label: 'Nr lokalu',
      filter: { type: 'text', placeholder: 'Filtruj nr lokalu' },
    },
    {
      key: 'postal_code',
      label: 'Kod pocztowy',
      filter: { type: 'text', placeholder: 'Filtruj kod' },
    },
    {
      key: 'city',
      label: 'Miasto',
      filter: { type: 'text', placeholder: 'Filtruj miasto' },
    },
    {
      key: 'email',
      label: 'Email',
      filter: { type: 'text', placeholder: 'Filtruj email' },
    },
    {
      key: 'phone',
      label: 'Telefon',
      filter: { type: 'text', placeholder: 'Filtruj telefon' },
    },
    {
      key: 'registry_number',
      label: 'Nr rejestru UKNF',
      filter: { type: 'text', placeholder: 'Filtruj nr rejestru' },
    },
    {
      key: 'created_at',
      label: 'Utworzono',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => value ? new Date(value).toLocaleString() : '',
    },
    {
      key: 'statusRaw',
      label: 'Surowy status',
      filter: { type: 'text', placeholder: 'Filtruj status' },
      render: (_v, item) => item.status,
    }
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
        <Button onClick={() => setIsCreateOpen(true)}>
          <Building2 className="mr-2 h-4 w-4" />
          Nowy podmiot
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Wszystkie ({localEntities.length})
        </Button>
        <Button variant="outline" size="sm">
          Banki ({localEntities.filter((e: any) => e.type === 'Bank').length})
        </Button>
        <Button variant="outline" size="sm">
          Zakłady Ubezpieczeń ({localEntities.filter((e: any) => e.type === 'Zakład Ubezpieczeń').length})
        </Button>
        <Button variant="outline" size="sm">
          Fundusze ({localEntities.filter((e: any) => e.type === 'Fundusz Inwestycyjny').length})
        </Button>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Ładowanie danych...</div>}
      {error && <div className="text-sm text-destructive">Błąd: {error}</div>}

      <DataTable
        data={localEntities}
        columns={columns}
        searchPlaceholder="Szukaj podmiotów..."
        exportFilename="podmioty"
        exportLimit={5000}
        bodyHeight="70vh"
        actions={(entity) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Akcje
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setViewEntity(entity);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Podgląd
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditEntity(entity);
                }}
              >
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
      <Dialog open={Boolean(viewEntity)} onOpenChange={(open) => !open && setViewEntity(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Podgląd podmiotu</DialogTitle>
            <DialogDescription>
              Szczegółowe informacje o wybranym podmiocie. Dane pochodzą z
              ostatniego odczytu i nie są jeszcze synchronizowane z API.
            </DialogDescription>
          </DialogHeader>
          {viewEntity && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Nazwa podmiotu
                </span>
                <span className="text-lg font-semibold">{viewEntity.name}</span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    Status
                  </span>
                  <Badge variant={getStatusVariant(viewEntity.status)}>
                    {getStatusLabel(viewEntity.status)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    Typ
                  </span>
                  <span className="font-medium">
                    {viewEntity.type || 'Nie określono'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    Kod UKNF
                  </span>
                  <span className="font-medium">
                    {viewEntity.uknf_code || '—'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    Entity ID
                  </span>
                  <span className="font-medium">{viewEntity.entity_id}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    Kategorie
                  </span>
                  <span className="font-medium">
                    {viewEntity.category || '—'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    Data utworzenia
                  </span>
                  <span className="font-medium">
                    {viewEntity.created_at
                      ? new Date(viewEntity.created_at).toLocaleString()
                      : '—'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    NIP
                  </span>
                  <span className="font-medium">{viewEntity.nip || '—'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    KRS
                  </span>
                  <span className="font-medium">{viewEntity.krs || '—'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    LEI
                  </span>
                  <span className="font-medium">{viewEntity.lei || '—'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase text-muted-foreground">
                  Adres siedziby
                </span>
                <span className="font-medium">
                  {formatEntityAddress(viewEntity)}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    Kontakt
                  </span>
                  <div className="space-y-1 text-sm">
                    <div>{viewEntity.contactPerson || 'Brak osoby kontaktowej'}</div>
                    <div>{viewEntity.email || 'Brak adresu e-mail'}</div>
                    <div>{viewEntity.phone || 'Brak numeru telefonu'}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase text-muted-foreground">
                    Numer rejestrowy
                  </span>
                  <span className="font-medium">
                    {viewEntity.registry_number || '—'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(editEntity)} onOpenChange={(open) => !open && setEditEntity(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edytuj dane podmiotu</DialogTitle>
            <DialogDescription>
              Modyfikacje są zapisywane lokalnie. Integracja z API zostanie
              dodana w kolejnych iteracjach.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="entity-name">Nazwa podmiotu</Label>
                <Input
                  id="entity-name"
                  value={editFormValues.name}
                  onChange={(event) =>
                    handleEditInputChange('name', event.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity-type">Typ podmiotu</Label>
                <Select
                  value={
                    editFormValues.type
                      ? editFormValues.type
                      : SELECT_EMPTY_VALUE
                  }
                  onValueChange={(value) =>
                    handleEditInputChange(
                      'type',
                      value === SELECT_EMPTY_VALUE ? '' : value,
                    )
                  }
                >
                  <SelectTrigger id="entity-type">
                    <SelectValue placeholder="Wybierz typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SELECT_EMPTY_VALUE}>Brak</SelectItem>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editFormValues.status}
                  onValueChange={(value) =>
                    handleEditInputChange('status', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz status" />
                  </SelectTrigger>
                  <SelectContent>
                    {combinedStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kategoria</Label>
                <Select
                  value={
                    editFormValues.category
                      ? editFormValues.category
                      : SELECT_EMPTY_VALUE
                  }
                  onValueChange={(value) =>
                    handleEditInputChange(
                      'category',
                      value === SELECT_EMPTY_VALUE ? '' : value,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SELECT_EMPTY_VALUE}>Brak</SelectItem>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Osoba kontaktowa</Label>
                <Input
                  value={editFormValues.contactPerson}
                  onChange={(event) =>
                    handleEditInputChange('contactPerson', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editFormValues.email}
                  onChange={(event) =>
                    handleEditInputChange('email', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input
                  value={editFormValues.phone}
                  onChange={(event) =>
                    handleEditInputChange('phone', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Ulica</Label>
                <Input
                  value={editFormValues.street}
                  onChange={(event) =>
                    handleEditInputChange('street', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Numer budynku</Label>
                <Input
                  value={editFormValues.building_number}
                  onChange={(event) =>
                    handleEditInputChange('building_number', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Numer lokalu</Label>
                <Input
                  value={editFormValues.apartment_number}
                  onChange={(event) =>
                    handleEditInputChange('apartment_number', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Kod pocztowy</Label>
                <Input
                  value={editFormValues.postal_code}
                  onChange={(event) =>
                    handleEditInputChange('postal_code', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Miasto</Label>
                <Input
                  value={editFormValues.city}
                  onChange={(event) =>
                    handleEditInputChange('city', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Numer rejestrowy</Label>
                <Input
                  value={editFormValues.registry_number}
                  onChange={(event) =>
                    handleEditInputChange('registry_number', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>NIP</Label>
                <Input
                  value={editFormValues.nip}
                  onChange={(event) =>
                    handleEditInputChange('nip', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>KRS</Label>
                <Input
                  value={editFormValues.krs}
                  onChange={(event) =>
                    handleEditInputChange('krs', event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>LEI</Label>
                <Input
                  value={editFormValues.lei}
                  onChange={(event) =>
                    handleEditInputChange('lei', event.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity-notes">Notatki (lokalne)</Label>
              <Textarea
                id="entity-notes"
                placeholder="Dodaj krótką notatkę do zmian..."
                value={editNotes}
                onChange={(event) => setEditNotes(event.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditEntity(null)}>
                Anuluj
              </Button>
              <Button type="submit">Zapisz zmiany</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Create entity dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Nowy podmiot</h3>
              <p className="text-sm text-muted-foreground">Uzupełnij dane podmiotu</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm">Nazwa</label>
              <input className="input w-full" value={name} onChange={e => setName(e.target.value)} />

              <label className="text-sm">Kod UKNF</label>
              <input className="input w-full" value={(window as any).uknf_code || ''} onChange={() => {}} placeholder="(opcjonalnie)" />

              <label className="text-sm">NIP</label>
              <input className="input w-full" value={nip} onChange={e => setNip(e.target.value)} />

              <label className="text-sm">KRS</label>
              <input className="input w-full" value={(window as any).krs || ''} onChange={() => {}} placeholder="(opcjonalnie)" />

              <label className="text-sm">LEI</label>
              <input className="input w-full" value={(window as any).lei || ''} onChange={() => {}} placeholder="(opcjonalnie)" />

              <label className="text-sm">Typ</label>
              <input className="input w-full" value={type} onChange={e => setType(e.target.value)} />

              <label className="text-sm">Status</label>
              <select className="input w-full" value={status} onChange={e => setStatus(e.target.value as any)}>
                <option value="active">Aktywny</option>
                <option value="inactive">Nieaktywny</option>
                <option value="suspended">Zawieszony</option>
              </select>

              <label className="text-sm">Kategoria</label>
              <input className="input w-full" value={(window as any).category || ''} onChange={() => {}} placeholder="(opcjonalnie)" />

              <label className="text-sm">Transgraniczny</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={(window as any).cross_border || false} onChange={() => {}} />
                <span className="text-sm text-muted-foreground">Czy podmiot jest transgraniczny?</span>
              </div>

              <label className="text-sm">Osoba kontaktowa</label>
              <input className="input w-full" value={contactPerson} onChange={e => setContactPerson(e.target.value)} />

              <label className="text-sm">Ulica</label>
              <input className="input w-full" value={(window as any).street || ''} onChange={() => {}} />

              <label className="text-sm">Nr budynku</label>
              <input className="input w-full" value={(window as any).building_number || ''} onChange={() => {}} />

              <label className="text-sm">Nr lokalu</label>
              <input className="input w-full" value={(window as any).apartment_number || ''} onChange={() => {}} />

              <label className="text-sm">Kod pocztowy</label>
              <input className="input w-full" value={(window as any).postal_code || ''} onChange={() => {}} />

              <label className="text-sm">Miasto</label>
              <input className="input w-full" value={(window as any).city || ''} onChange={() => {}} />

              <label className="text-sm">Email</label>
              <input className="input w-full" value={email} onChange={e => setEmail(e.target.value)} />

              <label className="text-sm">Telefon</label>
              <input className="input w-full" value={phone} onChange={e => setPhone(e.target.value)} />

              <label className="text-sm">Nr rejestru UKNF</label>
              <input className="input w-full" value={(window as any).registry_number || ''} onChange={() => {}} />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Anuluj</Button>
              <Button onClick={() => {
                if (!name.trim()) { alert('Nazwa jest wymagana'); return; }
                const newId = localEntities.length + 1;
                const newEntity = {
                  entity_id: newId,
                  id: String(newId),
                  uknf_code: '',
                  name,
                  nip,
                  krs: '',
                  lei: '',
                  street: '',
                  building_number: '',
                  apartment_number: '',
                  postal_code: '',
                  city: '',
                  phone,
                  email,
                  registry_number: '',
                  status,
                  category: '',
                  cross_border: false,
                  type,
                  created_at: new Date().toISOString(),
                  contactPerson,
                };
                setLocalEntities(prev => [newEntity as any, ...prev]);
                // clear
                setName(''); setNip(''); setType(''); setStatus('active'); setContactPerson(''); setEmail(''); setPhone('');
                setIsCreateOpen(false);
              }}>Utwórz</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
