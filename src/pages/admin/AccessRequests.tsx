import React from 'react';
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

  const columns: Column<typeof accessRequests[0]>[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'userName',
      label: 'Użytkownik',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'entityName',
      label: 'Podmiot',
    },
    {
      key: 'requestedRole',
      label: 'Żądana rola',
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
      key: 'requestDate',
      label: 'Data wniosku',
      render: (value) => formatDateTime(value),
    },
    {
      key: 'reviewedBy',
      label: 'Rozpatrzony przez',
      render: (value) => value || '-',
    },
    {
      key: 'reviewDate',
      label: 'Data rozpatrzenia',
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
