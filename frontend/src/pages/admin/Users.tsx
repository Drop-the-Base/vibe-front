import React, { useMemo, useState, useEffect } from 'react';
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
import { userClient } from '../../features/users/services/user-client';
import { mapUserDtoToUser } from '../../features/users/services/user-mapper';
import type { User } from '../../features/users/types/user';

export function Users() {
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // request using client so API_BASE_URL and proxy are honored
        const data = await userClient.list('page=0&size=20');
        // support HAL style (_embedded.users) or array
        const items: any[] = data && (data as any)._embedded && (data as any)._embedded.users ? (data as any)._embedded.users : (Array.isArray(data) ? data : [data]);
        const normalized: User[] = (items || []).map((dto: any) => mapUserDtoToUser(dto));
        setLocalUsers(normalized as any[]);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
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

  const roleOptions = useMemo(
    () =>
      Array.from(
        new Set(
          localUsers
            .map((user: any) => user.role)
            .filter((role: any): role is string => Boolean(role)),
        ),
      ).map((role: string) => ({
        label: getRoleLabel(role),
        value: role,
      })),
    [localUsers],
  );

  const entityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          localUsers
            .map((user: any) => user.entity)
            .filter((entity: any): entity is string => Boolean(entity)),
        ),
      ).map((entity: string) => ({
        label: entity,
        value: entity,
      })),
    [localUsers],
  );

  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'Imię i nazwisko',
      filter: { type: 'text', placeholder: 'Filtruj nazwisko' },
    },
    {
      key: 'email',
      label: 'Email',
      filter: { type: 'text', placeholder: 'Filtruj email' },
    },
    {
      key: 'role',
      label: 'Rola',
      filter: { type: 'select', placeholder: 'Wybierz rolę', options: roleOptions },
      render: (value) => (
        <Badge variant={getRoleVariant(value)}>
          {getRoleLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'entity',
      label: 'Podmiot',
      filter: { type: 'select', placeholder: 'Wybierz podmiot', options: entityOptions },
      render: (value) => value || '-',
    },
    {
      key: 'active',
      label: 'Status',
      filter: {
        type: 'select',
        placeholder: 'Wybierz status',
        options: [
          { label: 'Aktywny', value: 'true' },
          { label: 'Nieaktywny', value: 'false' },
        ],
      },
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Aktywny' : 'Nieaktywny'}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Ostatnie logowanie',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => (value ? formatDateTime(value) : 'Nigdy'),
    },
    {
      key: 'createdAt',
      label: 'Data utworzenia',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => (value ? formatDateTime(value) : '—'),
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
          Wszyscy ({localUsers.length})
        </Button>
        <Button variant="outline" size="sm">
          Pracownicy UKNF ({localUsers.filter((u: any) => u.role === 'internal' || u.role === 'admin').length})
        </Button>
        <Button variant="outline" size="sm">
          Użytkownicy zewnętrzni ({localUsers.filter((u: any) => u.role === 'external_admin' || u.role === 'external_user').length})
        </Button>
        <Button variant="outline" size="sm">
          Aktywni ({localUsers.filter((u: any) => u.active).length})
        </Button>
      </div>

      <DataTable
        data={localUsers}
        columns={columns}
        searchPlaceholder="Szukaj użytkowników..."
        exportFilename="uzytkownicy"
        exportLimit={2000}
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
