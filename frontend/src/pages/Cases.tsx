import React, { useMemo } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Eye, Edit, MessageCircle } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useApiData } from '../shared/hooks/use-api-data';
import { apiClient } from '../shared/api/api-client';

interface CaseDto {
  id: number;
  caseNumber: string;
  title: string;
  entityName: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdDate?: string | null;
  updatedDate?: string | null;
}

export function Cases() {
  const { data } = useApiData<CaseDto[]>(() => apiClient.get('/cases'), []);
  const cases = data ?? [];

  const statusOptions = useMemo(
    () =>
      Array.from(new Set(cases.map((item) => item.status))).map((status) => ({
        label: mapStatus(status),
        value: status,
      })),
    [cases],
  );

  const priorityOptions = useMemo(
    () =>
      Array.from(new Set(cases.map((item) => item.priority))).map((priority) => ({
        label: mapPriority(priority),
        value: priority,
      })),
    [cases],
  );

  const columns: Column<CaseDto>[] = [
    { key: 'caseNumber', label: 'ID sprawy', filter: { type: 'text', placeholder: 'Filtruj ID' } },
    { key: 'title', label: 'Tytuł', filter: { type: 'text', placeholder: 'Filtruj tytuł' } },
    { key: 'entityName', label: 'Podmiot', filter: { type: 'text', placeholder: 'Filtruj podmiot' } },
    {
      key: 'status',
      label: 'Status',
      filter: { type: 'select', placeholder: 'Wybierz status', options: statusOptions },
      render: (value) => <Badge variant={getStatusVariant(value)}>{mapStatus(value)}</Badge>,
    },
    {
      key: 'priority',
      label: 'Priorytet',
      filter: { type: 'select', placeholder: 'Wybierz priorytet', options: priorityOptions },
      render: (value) => <Badge variant={value === 'high' ? 'destructive' : value === 'medium' ? 'secondary' : 'outline'}>{mapPriority(value)}</Badge>,
    },
    { key: 'assignedTo', label: 'Przypisane do', filter: { type: 'text', placeholder: 'Filtruj osobę' } },
    {
      key: 'createdDate',
      label: 'Data utworzenia',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => (value ? formatDateTime(value) : '-'),
    },
    {
      key: 'updatedDate',
      label: 'Ostatnia aktualizacja',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => (value ? formatDateTime(value) : '-'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Sprawy</h2>
          <p className="text-muted-foreground">Monitoruj i obsługuj sprawy administracyjne podmiotów</p>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Nowa sprawa
        </Button>
      </div>

      <DataTable
        data={cases}
        columns={columns}
        searchPlaceholder="Szukaj spraw..."
        exportFilename="sprawy"
        exportLimit={2000}
        actions={(item) => (
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
                <MessageCircle className="mr-2 h-4 w-4" />
                Komunikacja
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </div>
  );
}

const mapStatus = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Wersja robocza',
    new: 'Nowa',
    in_progress: 'W toku',
    pending: 'Do uzupełnienia',
    closed: 'Zakończona',
    cancelled: 'Anulowana',
  };
  return labels[status] || status;
};

const mapPriority = (priority: string) => {
  const labels: Record<string, string> = {
    low: 'Niski',
    medium: 'Średni',
    high: 'Wysoki',
  };
  return labels[priority] || priority;
};

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'closed':
      return 'default';
    case 'in_progress':
    case 'pending':
      return 'secondary';
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
};
