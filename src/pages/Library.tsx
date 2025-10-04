import React from 'react';
import { libraryFiles } from '../lib/mock-data';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Upload, Download, Eye, Edit, Trash, FileText } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export function Library() {
  const getAccessLevelVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case 'public':
        return 'default';
      case 'internal':
        return 'secondary';
      case 'restricted':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getAccessLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      public: 'Publiczny',
      internal: 'Wewnętrzny',
      restricted: 'Ograniczony',
    };
    return labels[level] || level;
  };

  const columns: Column<typeof libraryFiles[0]>[] = [
    {
      key: 'name',
      label: 'Nazwa pliku',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Typ',
      render: (value) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'category',
      label: 'Kategoria',
    },
    {
      key: 'version',
      label: 'Wersja',
    },
    {
      key: 'size',
      label: 'Rozmiar',
    },
    {
      key: 'uploadedBy',
      label: 'Dodane przez',
    },
    {
      key: 'uploadedDate',
      label: 'Data dodania',
      render: (value) => formatDateTime(value),
    },
    {
      key: 'accessLevel',
      label: 'Poziom dostępu',
      render: (value) => (
        <Badge variant={getAccessLevelVariant(value)}>
          {getAccessLevelLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'tags',
      label: 'Tagi',
      render: (value: string[]) => (
        <div className="flex gap-1 flex-wrap">
          {value.slice(0, 2).map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Biblioteka plików</h2>
          <p className="text-muted-foreground">
            Repozytorium plików, instrukcji i formularzy
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Dodaj plik
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm">
          Wszystkie ({libraryFiles.length})
        </Button>
        <Button variant="outline" size="sm">
          Instrukcje ({libraryFiles.filter(f => f.category === 'Instrukcje').length})
        </Button>
        <Button variant="outline" size="sm">
          Formularze ({libraryFiles.filter(f => f.category === 'Formularze').length})
        </Button>
        <Button variant="outline" size="sm">
          Regulacje ({libraryFiles.filter(f => f.category === 'Regulacje').length})
        </Button>
      </div>

      <DataTable
        data={libraryFiles}
        columns={columns}
        searchPlaceholder="Szukaj plików po nazwie, kategorii lub tagach..."
        exportFilename="biblioteka"
        actions={(file) => (
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
                <Download className="mr-2 h-4 w-4" />
                Pobierz
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edytuj metadane
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
