import React, { useMemo } from 'react';
import { accessRequests } from '../../lib/mock-data';
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

export function AccessRequests() {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Oczekujący',
      approved: 'Zaakceptowany',
      rejected: 'Odrzucony',
    };
    return labels[status] || status;
  };

  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set(
          accessRequests
            .map((request) => request.status)
            .filter((status): status is string => Boolean(status)),
        ),
      ).map((status) => ({
        label: getStatusLabel(status),
        value: status,
      })),
    [],
  );

  const roleOptions = useMemo(
    () =>
      Array.from(
        new Set(
          accessRequests
            .map((request) => request.requestedRole)
            .filter((role): role is string => Boolean(role)),
        ),
      ).map((role) => ({
        label: role,
        value: role,
      })),
    [],
  );

  const reviewerOptions = useMemo(
    () =>
      Array.from(
        new Set(
          accessRequests
            .map((request) => request.reviewedBy)
            .filter((value): value is string => Boolean(value)),
        ),
      ).map((value) => ({
        label: value,
        value,
      })),
    [],
  );

  const columns: Column<typeof accessRequests[0]>[] = [
    {
      key: 'id',
      label: 'ID',
      filter: { type: 'text', placeholder: 'Filtruj ID' },
    },
    {
      key: 'userName',
      label: 'Użytkownik',
      filter: { type: 'text', placeholder: 'Filtruj użytkownika' },
    },
    {
      key: 'email',
      label: 'Email',
      filter: { type: 'text', placeholder: 'Filtruj email' },
    },
    {
      key: 'entityName',
      label: 'Podmiot',
      filter: { type: 'text', placeholder: 'Filtruj podmiot' },
    },
    {
      key: 'requestedRole',
      label: 'Żądana rola',
      filter: { type: 'select', placeholder: 'Wybierz rolę', options: roleOptions },
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
      render: (value) => formatDateTime(value),
    },
    {
      key: 'reviewedBy',
      label: 'Rozpatrzony przez',
      filter: { type: 'select', placeholder: 'Wybierz osobę', options: reviewerOptions },
      render: (value) => value || '-',
    },
    {
      key: 'reviewDate',
      label: 'Data rozpatrzenia',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => (value ? formatDateTime(value) : '-'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Wnioski o dostęp</h2>
          <p className="text-muted-foreground">
            Zarządzanie wnioskami o dostęp do systemu
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Wszystkie ({accessRequests.length})
        </Button>
        <Button variant="outline" size="sm">
          Oczekujące ({accessRequests.filter(r => r.status === 'pending').length})
        </Button>
        <Button variant="outline" size="sm">
          Zaakceptowane ({accessRequests.filter(r => r.status === 'approved').length})
        </Button>
        <Button variant="outline" size="sm">
          Odrzucone ({accessRequests.filter(r => r.status === 'rejected').length})
        </Button>
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
              {request.status === 'pending' && (
                <>
                  <DropdownMenuItem>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Akceptuj
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Odrzuć
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
