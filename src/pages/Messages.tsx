import React from 'react';
import { messages } from '../lib/mock-data';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Mail, Paperclip, Eye, Reply, Trash } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export function Messages() {
  const columns: Column<typeof messages[0]>[] = [
    {
      key: 'read',
      label: '',
      sortable: false,
      render: (value) => (
        <div className="w-2">
          {!value && <div className="w-2 h-2 rounded-full bg-blue-600" />}
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Temat',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <span className={!item.read ? 'font-medium' : ''}>{value}</span>
          {item.hasAttachments && <Paperclip className="h-3 w-3 text-muted-foreground" />}
        </div>
      ),
    },
    {
      key: 'from',
      label: 'Od',
    },
    {
      key: 'to',
      label: 'Do',
    },
    {
      key: 'entityName',
      label: 'Podmiot',
    },
    {
      key: 'date',
      label: 'Data',
      render: (value) => formatDateTime(value),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Wiadomości</h2>
          <p className="text-muted-foreground">
            Dwukierunkowa komunikacja z podmiotami nadzorowanymi
          </p>
        </div>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Nowa wiadomość
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Wszystkie ({messages.length})
        </Button>
        <Button variant="outline" size="sm">
          Nieprzeczytane ({messages.filter(m => !m.read).length})
        </Button>
        <Button variant="outline" size="sm">
          Z załącznikami ({messages.filter(m => m.hasAttachments).length})
        </Button>
      </div>

      <DataTable
        data={messages}
        columns={columns}
        searchPlaceholder="Szukaj wiadomości..."
        exportFilename="wiadomosci"
        actions={(message) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Akcje
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Otwórz
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Reply className="mr-2 h-4 w-4" />
                Odpowiedz
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
