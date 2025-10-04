import React from 'react';
import { users } from '../../lib/mock-data';
import { DataTable, Column } from '../../components/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { UserPlus, Edit, Lock, Unlock, Trash } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

export function Users() {
  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrator systemu',
      internal: 'Pracownik UKNF',
      external_admin: 'Administrator podmiotu',
      external_user: 'Przedstawiciel podmiotu',
    };
    return labels[role] || role;
  };

  const getRoleVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'internal':
        return 'default';
      case 'external_admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const columns: Column<typeof users[0]>[] = [
    {
      key: 'name',
      label: 'Imię i nazwisko',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'role',
      label: 'Rola',
      render: (value) => (
        <Badge variant={getRoleVariant(value)}>
          {getRoleLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'entity',
      label: 'Podmiot',
      render: (value) => value || '-',
    },
    {
      key: 'active',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Aktywny' : 'Nieaktywny'}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Ostatnie logowanie',
      render: (value) => (value ? formatDateTime(value) : 'Nigdy'),
    },
    {
      key: 'createdAt',
      label: 'Data utworzenia',
      render: (value) => formatDateTime(value),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Zarządzanie użytkownikami</h2>
          <p className="text-muted-foreground">
            Administracja kontami użytkowników systemu
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Dodaj użytkownika
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Wszyscy ({users.length})
        </Button>
        <Button variant="outline" size="sm">
          Pracownicy UKNF ({users.filter(u => u.role === 'internal' || u.role === 'admin').length})
        </Button>
        <Button variant="outline" size="sm">
          Użytkownicy zewnętrzni ({users.filter(u => u.role === 'external_admin' || u.role === 'external_user').length})
        </Button>
        <Button variant="outline" size="sm">
          Aktywni ({users.filter(u => u.active).length})
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Szukaj użytkowników..."
        exportFilename="uzytkownicy"
        actions={(user) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Akcje
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edytuj
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Lock className="mr-2 h-4 w-4" />
                Zresetuj hasło
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {user.active ? (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Dezaktywuj
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Aktywuj
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </div>
  );
}
