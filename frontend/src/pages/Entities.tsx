import React, { useState, useEffect } from 'react';
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
} from '../components/ui/dialog';

export function Entities() {
  // localEntities will be populated from backend /entities
  const [localEntities, setLocalEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const columns: Column<any>[] = [
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
      render: (value) => value ? new Date(value).toLocaleString() : '',
    },
    {
      key: 'statusRaw',
      label: 'Surowy status',
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
