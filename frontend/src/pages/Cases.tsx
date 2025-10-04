import React, { useMemo } from 'react';
import { cases } from '../lib/mock-data';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Briefcase, Eye, Edit, FileText } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export function Cases() {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'closed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Nowa',
      in_progress: 'W trakcie',
      pending: 'Oczekująca',
      closed: 'Zamknięta',
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: 'Niski',
      medium: 'Średni',
      high: 'Wysoki',
    };
    return labels[priority] || priority;
  };

  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set(
          cases
            .map((item) => item.status)
            .filter((status): status is string => Boolean(status)),
        ),
      ).map((status) => ({
        label: getStatusLabel(status),
        value: status,
      })),
    [],
  );

  const priorityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          cases
            .map((item) => item.priority)
            .filter((priority): priority is string => Boolean(priority)),
        ),
      ).map((priority) => ({
        label: getPriorityLabel(priority),
        value: priority,
      })),
    [],
  );

  const assigneeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          cases
            .map((item) => item.assignedTo)
            .filter((assignee): assignee is string => Boolean(assignee)),
        ),
      ).map((assignee) => ({
        label: assignee,
        value: assignee,
      })),
    [],
  );

  const columns: Column<typeof cases[0]>[] = [
    {
      key: 'id',
      label: 'ID',
      filter: { type: 'text', placeholder: 'Filtruj ID' },
    },
    {
      key: 'title',
      label: 'Tytuł sprawy',
      filter: { type: 'text', placeholder: 'Filtruj tytuł' },
    },
    {
      key: 'entityName',
      label: 'Podmiot',
      filter: { type: 'text', placeholder: 'Filtruj podmiot' },
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
      key: 'priority',
      label: 'Priorytet',
      filter: { type: 'select', placeholder: 'Wybierz priorytet', options: priorityOptions },
      render: (value) => (
        <Badge variant={getPriorityVariant(value)}>
          {getPriorityLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'assignedTo',
      label: 'Przypisane do',
      filter: { type: 'select', placeholder: 'Wybierz osobę', options: assigneeOptions },
    },
    {
      key: 'createdDate',
      label: 'Data utworzenia',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => formatDateTime(value),
    },
    {
      key: 'updatedDate',
      label: 'Ostatnia aktualizacja',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => formatDateTime(value),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Sprawy administracyjne</h2>
          <p className="text-muted-foreground">
            Prowadzenie i zarządzanie sprawami dotyczącymi podmiotów nadzorowanych
          </p>
        </div>
        <Button>
          <Briefcase className="mr-2 h-4 w-4" />
          Nowa sprawa
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Wszystkie ({cases.length})
        </Button>
        <Button variant="outline" size="sm">
          W trakcie ({cases.filter(c => c.status === 'in_progress').length})
        </Button>
        <Button variant="outline" size="sm">
          Wysoki priorytet ({cases.filter(c => c.priority === 'high').length})
        </Button>
      </div>

      <DataTable
        data={cases}
        columns={columns}
        searchPlaceholder="Szukaj spraw..."
        exportFilename="sprawy"
        exportLimit={2000}
        actions={(caseItem) => (
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
                <FileText className="mr-2 h-4 w-4" />
                Dokumenty
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </div>
  );
}
