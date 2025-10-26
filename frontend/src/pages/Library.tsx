import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { apiClient } from '../shared/api/api-client';
import { API_BASE_URL } from '../shared/config/environment';
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
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';

export function Library() {
  type LibraryFileRow = {
    id: number;
    name: string;
    type: string;
    category: string;
    version: string;
    sizeLabel: string;
    uploadedBy: string;
    uploadedDate: string | null;
    accessLevel: string;
    tags: string[];
    archived: boolean;
    raw: any;
  };

  const [files, setFiles] = useState<LibraryFileRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadVersion, setUploadVersion] = useState('');
  const [uploadTags, setUploadTags] = useState('');

  const mapFiles = useCallback((data: any[]): LibraryFileRow[] => {
    const formatSize = (size?: number) => {
      if (!size || Number.isNaN(size)) {
        return '—';
      }
      if (size < 1024) {
        return `${size} B`;
      }
      if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
      }
      if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
      }
      return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    };

    return (data || []).map((f) => {
      const tags = (f?.tags || '')
        .split(',')
        .map((tag: string) => tag.trim())
        .filter(Boolean);

      return {
        id: f.id,
        name: f.name ?? 'Nieznany plik',
        type: f.type?.split('/')?.pop() || 'plik',
        category: f.category ?? '',
        version: f.version ?? '',
        sizeLabel: formatSize(f.size),
        uploadedBy: f.uploadedBy ?? '-',
        uploadedDate: f.uploadedDate ?? null,
        accessLevel: f.accessLevel ?? 'public',
        tags,
        archived: Boolean(f.archived),
        raw: f,
      } satisfies LibraryFileRow;
    });
  }, []);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<any[]>('/files');
      setFiles(mapFiles(data));
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [mapFiles]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);
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

  const typeOptions = useMemo(
    () =>
      Array.from(new Set(files.map((file) => file.type).filter(Boolean)))
        .map((value: any) => ({ label: String(value), value: String(value) })),
    [files],
  );

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(files.map((file) => file.category).filter(Boolean)))
        .map((value: any) => ({ label: String(value), value: String(value) })),
    [files],
  );

  const authorOptions = useMemo(
    () =>
      Array.from(new Set(files.map((file) => file.uploadedBy).filter(Boolean)))
        .map((value: any) => ({ label: String(value), value: String(value) })),
    [files],
  );

  const accessOptions = useMemo(
    () =>
      Array.from(new Set(files.map((file) => file.accessLevel).filter(Boolean))).map((value: any) => ({
        label: getAccessLevelLabel(String(value)),
        value: String(value),
      })),
    [files],
  );

  const columns: Column<LibraryFileRow>[] = [
    {
      key: 'name',
      label: 'Nazwa pliku',
      filter: { type: 'text', placeholder: 'Filtruj nazwę' },
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
      filter: { type: 'select', placeholder: 'Wybierz typ', options: typeOptions },
      render: (value) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'category',
      label: 'Kategoria',
      filter: { type: 'select', placeholder: 'Wybierz kategorię', options: categoryOptions },
    },
    {
      key: 'version',
      label: 'Wersja',
      filter: { type: 'text', placeholder: 'Filtruj wersję' },
    },
    {
      key: 'sizeLabel',
      label: 'Rozmiar',
      filter: { type: 'text', placeholder: 'Filtruj rozmiar' },
    },
    {
      key: 'uploadedBy',
      label: 'Dodane przez',
      filter: { type: 'select', placeholder: 'Wybierz autora', options: authorOptions },
    },
    {
      key: 'uploadedDate',
      label: 'Data dodania',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => formatDateTime(value),
    },
    {
      key: 'accessLevel',
      label: 'Poziom dostępu',
      filter: { type: 'select', placeholder: 'Poziom dostępu', options: accessOptions },
      render: (value) => (
        <Badge variant={getAccessLevelVariant(value)}>
          {getAccessLevelLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'tags',
      label: 'Tagi',
      filter: { type: 'text', placeholder: 'Filtruj tagi' },
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
        <div>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Dodaj plik
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm">
          Wszystkie ({files.length})
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Nie udało się załadować plików</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && !files.length && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      )}

      <DataTable
        data={files}
        columns={columns}
        searchPlaceholder="Szukaj plików po nazwie, kategorii lub tagach..."
        exportFilename="biblioteka"
        exportLimit={2000}
        bodyHeight="65vh"
        actions={(file: LibraryFileRow) => (
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
              <DropdownMenuItem asChild>
                <a
                  href={`${API_BASE_URL}/files/${file.id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Pobierz
                </a>
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

      {/* Simple upload modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-popover p-6 rounded shadow max-w-md w-full">
            <h3 className="mb-4">Prześlij plik</h3>
            <div className="space-y-3">
              <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
              <input type="text" placeholder="Kategoria" value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} className="w-full input" />
              <input type="text" placeholder="Wersja" value={uploadVersion} onChange={(e) => setUploadVersion(e.target.value)} className="w-full input" />
              <input type="text" placeholder="Tagi (oddzielone przecinkami)" value={uploadTags} onChange={(e) => setUploadTags(e.target.value)} className="w-full input" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Anuluj</Button>
              <Button
                onClick={async () => {
                  if (!uploadFile) return;
                  const fd = new FormData();
                  fd.append('file', uploadFile);
                  fd.append('name', uploadFile.name);
                  if (uploadCategory) fd.append('category', uploadCategory);
                  if (uploadVersion) fd.append('version', uploadVersion);
                  if (uploadTags) fd.append('tags', uploadTags);
                  try {
                    setLoading(true);
                    await fetch(`${API_BASE_URL}/files`, { method: 'POST', body: fd });
                    await loadFiles();
                    setIsUploadOpen(false);
                    setUploadFile(null);
                    setUploadCategory('');
                    setUploadVersion('');
                    setUploadTags('');
                  } catch (err: any) {
                    setError(err.message || String(err));
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Prześlij
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
