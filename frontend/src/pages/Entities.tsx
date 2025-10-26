import React, { useMemo } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Eye, Edit } from 'lucide-react';
import { useApiData } from '../shared/hooks/use-api-data';
import { apiClient } from '../shared/api/api-client';

interface EntityDto {
  id: number;
  name: string;
  nip: string;
  type: string;
  status: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  uknfCode?: string | null;
  city?: string | null;
  postalCode?: string | null;
}

export function Entities() {
  const { data } = useApiData<EntityDto[]>(() => apiClient.get('/entities'), []);
  const entities = data ?? [];

  const typeOptions = useMemo(
    () =>
      Array.from(new Set(entities.map((entity) => entity.type))).map((type) => ({
        label: type,
        value: type,
      })),
    [entities],
  );

  const statusOptions = useMemo(
    () =>
      Array.from(new Set(entities.map((entity) => entity.status))).map((status) => ({
        label: status,
        value: status,
      })),
    [entities],
  );

  const columns: Column<EntityDto>[] = [
    { key: 'uknfCode', label: 'Kod UKNF', filter: { type: 'text', placeholder: 'Filtruj kod' } },
    { key: 'name', label: 'Nazwa podmiotu', filter: { type: 'text', placeholder: 'Filtruj nazwę' } },
    { key: 'type', label: 'Typ', filter: { type: 'select', placeholder: 'Wybierz typ', options: typeOptions } },
    {
      key: 'status',
      label: 'Status',
      filter: { type: 'select', placeholder: 'Wybierz status', options: statusOptions },
      render: (value) => <Badge variant={value === 'Wpisany' ? 'default' : 'secondary'}>{value}</Badge>,
    },
    { key: 'contactPerson', label: 'Osoba kontaktowa', filter: { type: 'text', placeholder: 'Filtruj osobę' } },
    { key: 'email', label: 'Email', filter: { type: 'text', placeholder: 'Filtruj email' } },
    { key: 'phone', label: 'Telefon', filter: { type: 'text', placeholder: 'Filtruj telefon' } },
    { key: 'city', label: 'Miasto', filter: { type: 'text', placeholder: 'Filtruj miasto' } },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Kartoteka podmiotów</h2>
          <p className="text-muted-foreground">Przeglądaj i aktualizuj dane nadzorowanych podmiotów</p>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Dodaj podmiot
        </Button>
      </div>

      <DataTable
        data={entities}
        columns={columns}
        searchPlaceholder="Szukaj podmiotów..."
        exportFilename="podmioty"
        exportLimit={2000}
        actions={(entity) => (
          <Button variant="ghost" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            Szczegóły
          </Button>
        )}
      />
    </div>
  );
}
