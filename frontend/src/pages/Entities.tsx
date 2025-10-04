import React from 'react';
import { entities } from '../lib/mock-data';
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

export function Entities() {
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

  const columns: Column<typeof entities[0]>[] = [
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
      key: 'nip',
      label: 'NIP',
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
      key: 'contactPerson',
      label: 'Osoba kontaktowa',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phone',
      label: 'Telefon',
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
        <Button>
          <Building2 className="mr-2 h-4 w-4" />
          Nowy podmiot
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Wszystkie ({entities.length})
        </Button>
        <Button variant="outline" size="sm">
          Banki ({entities.filter(e => e.type === 'Bank').length})
        </Button>
        <Button variant="outline" size="sm">
          Zakłady Ubezpieczeń ({entities.filter(e => e.type === 'Zakład Ubezpieczeń').length})
        </Button>
        <Button variant="outline" size="sm">
          Fundusze ({entities.filter(e => e.type === 'Fundusz Inwestycyjny').length})
        </Button>
      </div>

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
    </div>
  );
}
