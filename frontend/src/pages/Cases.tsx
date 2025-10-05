import React, { useEffect, useMemo, useState } from 'react';
import { cases as mockCases } from '../lib/mock-data';
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
import { casesApi, type CaseDto } from '../shared/api/cases';
import { cn } from '../lib/utils';

type CaseRow = {
  id: string;
  title: string;
  entityName: string;
  status: string;
  priority: string;
  assignedTo: string | null;
  createdDate: string;
  updatedDate: string;
  dueDate: string | null;
};

const mapDtoToRow = (item: CaseDto): CaseRow => ({
  id: item.caseNumber || `CASE-${item.id}`,
  title: item.title,
  entityName: item.entityName || 'Nieznany podmiot',
  status: item.status ?? 'new',
  priority: item.priority ?? 'medium',
  assignedTo: item.assignedTo,
  createdDate: item.createdAt,
  updatedDate: item.updatedAt,
  dueDate: item.dueAt,
});

const mapMockToRow = (item: (typeof mockCases)[number]): CaseRow => ({
  id: item.id,
  title: item.title,
  entityName: item.entityName,
  status: item.status,
  priority: item.priority,
  assignedTo: item.assignedTo,
  createdDate: item.createdDate,
  updatedDate: item.updatedDate,
  dueDate: null,
});

export function Cases() {
  const [caseItems, setCaseItems] = useState<CaseRow[]>(() => mockCases.map(mapMockToRow));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await casesApi.list();
        if (!mounted) return;
        setCaseItems(data.map(mapDtoToRow));
        setError(null);
      } catch (err) {
        if (!mounted) return;
        console.warn('Nie udało się pobrać listy spraw', err);
        setError('Nie udało się pobrać listy spraw z serwera. Wyświetlamy dane demonstracyjne.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

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
          caseItems
            .map((item) => item.status)
            .filter((status): status is string => Boolean(status)),
        ),
      ).map((status) => ({
        label: getStatusLabel(status),
        value: status,
      })),
    [caseItems],
  );

  const priorityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          caseItems
            .map((item) => item.priority)
            .filter((priority): priority is string => Boolean(priority)),
        ),
      ).map((priority) => ({
        label: getPriorityLabel(priority),
        value: priority,
      })),
    [caseItems],
  );

  const assigneeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          caseItems
            .map((item) => item.assignedTo)
            .filter((assignee): assignee is string => Boolean(assignee)),
        ),
      ).map((assignee) => ({
        label: assignee,
        value: assignee,
      })),
    [caseItems],
  );

  const columns: Column<CaseRow>[] = [
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

  const totalCases = caseItems.length;
  const inProgressCount = caseItems.filter((item) => item.status === 'in_progress').length;
  const highPriorityCount = caseItems.filter((item) => item.priority === 'high').length;

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

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className={cn(loading && 'opacity-75')}>
          Wszystkie ({totalCases})
        </Button>
        <Button variant="outline" size="sm">
          W trakcie ({inProgressCount})
        </Button>
        <Button variant="outline" size="sm">
          Wysoki priorytet ({highPriorityCount})
        </Button>
      </div>

      <DataTable
        data={caseItems}
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
