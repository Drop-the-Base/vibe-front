import React, { useMemo } from 'react';
import { DataTable, Column } from '../../components/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { useApiData } from '../../shared/hooks/use-api-data';
import { apiClient } from '../../shared/api/api-client';

interface AccessRequestDto {
  id: number;
  userName: string;
  email: string;
  entityName: string;
  requestedPermissions: string[];
  status: string;
  requestDate?: string | null;
  reviewedBy?: string | null;
  reviewDate?: string | null;
}

export function AccessRequests() {
  const { data, reload } = useApiData<AccessRequestDto[]>(() => apiClient.get('/access-requests'), []);
  const accessRequests = data ?? [];

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'new':
        return 'secondary';
      case 'blocked':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Roboczy',
      new: 'Nowy',
      accepted: 'Zaakceptowany',
      blocked: 'Zablokowany',
      updated: 'Zaktualizowany',
    };
    return labels[status] || status;
  };

  const statusOptions = useMemo(
    () =>
      Array.from(new Set(accessRequests.map((request) => request.status))).map((status) => ({
        label: getStatusLabel(status),
        value: status,
      })),
    [accessRequests],
  );

  const columns: Column<AccessRequestDto>[] = [
    { key: 'id', label: 'ID', filter: { type: 'text', placeholder: 'Filtruj ID' } },
    { key: 'userName', label: 'Użytkownik', filter: { type: 'text', placeholder: 'Filtruj użytkownika' } },
    { key: 'email', label: 'Email', filter: { type: 'text', placeholder: 'Filtruj email' } },
    { key: 'entityName', label: 'Podmiot', filter: { type: 'text', placeholder: 'Filtruj podmiot' } },
    {
      key: 'requestedPermissions',
      label: 'Żądane uprawnienia',
      filter: { type: 'text', placeholder: 'Filtruj uprawnienia' },
      render: (value) => value.join(', '),
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
      key: 'requestDate',
      label: 'Data wniosku',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => (value ? formatDateTime(value) : '-'),
    },
    {
      key: 'reviewedBy',
      label: 'Rozpatrzony przez',
      filter: { type: 'text', placeholder: 'Filtruj osobę' },
      render: (value) => value || '-',
    },
    {
      key: 'reviewDate',
      label: 'Data rozpatrzenia',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => (value ? formatDateTime(value) : '-'),
    },
  ];

  const updateStatus = async (id: number, status: 'accepted' | 'blocked') => {
    await apiClient.patch(`/access-requests/${id}`, { status });
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Wnioski o dostęp</h2>
          <p className="text-muted-foreground">Zarządzanie wnioskami o dostęp do systemu</p>
        </div>
      </div>

      <DataTable
        data={accessRequests}
        columns={columns}
        searchPlaceholder="Szukaj wniosków..."
        exportFilename="wnioski_o_dostep"
        exportLimit={2000}
        actions={(request) => (
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
              {request.status === 'new' && (
                <>
                  <DropdownMenuItem onSelect={() => updateStatus(request.id, 'accepted')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Akceptuj
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onSelect={() => updateStatus(request.id, 'blocked')}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Zablokuj
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </div>
  );
}
