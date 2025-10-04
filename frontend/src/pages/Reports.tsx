import React from 'react';
import { reports } from '../lib/mock-data';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Eye, Download, Edit } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export function Reports() {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'in_validation':
      case 'submitted':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Do przesłania',
      submitted: 'Przesłane',
      in_validation: 'W trakcie walidacji',
      accepted: 'Zaakceptowane',
      rejected: 'Odrzucone',
    };
    return labels[status] || status;
  };

  const columns: Column<typeof reports[0]>[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'title',
      label: 'Tytuł sprawozdania',
    },
    {
      key: 'entityName',
      label: 'Podmiot',
    },
    {
      key: 'type',
      label: 'Typ',
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
      key: 'submittedDate',
      label: 'Data przesłania',
      render: (value) => (value ? formatDateTime(value) : '-'),
    },
    {
      key: 'dueDate',
      label: 'Termin',
      render: (value) => formatDateTime(value),
    },
    {
      key: 'assignedTo',
      label: 'Przypisane do',
      render: (value) => value || '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Sprawozdania</h2>
          <p className="text-muted-foreground">
            Zarządzaj sprawozdaniami przekazywanymi przez podmioty nadzorowane
          </p>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Nowe sprawozdanie
        </Button>
      </div>

      <DataTable
        data={reports}
        columns={columns}
        searchPlaceholder="Szukaj sprawozdań..."
        exportFilename="sprawozdania"
        actions={(report) => (
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
                Edytuj
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Pobierz
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </div>
  );
}
