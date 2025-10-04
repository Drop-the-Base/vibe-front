import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Search, Download, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { exportToCSV, exportToJSON, exportToXLSX } from '../shared/export/exporters';
import { toast } from 'sonner';

type ColumnFilterOption = {
  label: string;
  value: string;
};

type ColumnFilterConfig =
  | {
      type: 'text';
      placeholder?: string;
    }
  | {
      type: 'select';
      placeholder?: string;
      options: ColumnFilterOption[];
    }
  | {
      type: 'date';
      placeholder?: string;
    }
  | {
      type: 'daterange';
      fromLabel?: string;
      toLabel?: string;
    };

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  filter?: ColumnFilterConfig;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  exportable?: boolean;
  exportFilename?: string;
  exportLimit?: number;
  actions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  bodyHeight?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Szukaj...',
  exportable = true,
  exportFilename = 'export',
  exportLimit,
  actions,
  onRowClick,
  bodyHeight = '60vh',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageInput, setPageInput] = useState('1');
  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});

  const hasActiveFilters = useMemo(
    () => Object.keys(columnFilters).length > 0,
    [columnFilters],
  );

  const filteredData = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    return data.filter((item) => {
      const matchesSearch =
        !search ||
        Object.values(item).some((value) =>
          String(value ?? '')
            .toLowerCase()
            .includes(search),
        );

      if (!matchesSearch) {
        return false;
      }

      return columns.every((column) => {
        const filterConfig = column.filter;
        if (!filterConfig) return true;

        const filterValue = columnFilters[column.key];
        const rawValue = item[column.key];

        if (filterConfig.type === 'text') {
          if (!filterValue) return true;
          return String(rawValue ?? '')
            .toLowerCase()
            .includes(String(filterValue).toLowerCase());
        }

        if (filterConfig.type === 'select') {
          if (!filterValue) return true;
          return String(rawValue ?? '') === String(filterValue);
        }

        if (filterConfig.type === 'date') {
          if (!filterValue) return true;
          if (!rawValue) return false;
          const rawDate = new Date(rawValue);
          const filterDate = new Date(filterValue);
          if (Number.isNaN(rawDate.getTime()) || Number.isNaN(filterDate.getTime())) {
            return false;
          }
          return (
            rawDate.getFullYear() === filterDate.getFullYear() &&
            rawDate.getMonth() === filterDate.getMonth() &&
            rawDate.getDate() === filterDate.getDate()
          );
        }

        if (filterConfig.type === 'daterange') {
          if (!filterValue?.from && !filterValue?.to) return true;
          if (!rawValue) return false;
          const rawDate = new Date(rawValue);
          if (Number.isNaN(rawDate.getTime())) {
            return false;
          }

          if (filterValue?.from) {
            const fromDate = new Date(filterValue.from);
            if (!Number.isNaN(fromDate.getTime()) && rawDate < fromDate) {
              return false;
            }
          }

          if (filterValue?.to) {
            const toDate = new Date(filterValue.to);
            if (!Number.isNaN(toDate.getTime()) && rawDate > toDate) {
              return false;
            }
          }

          return true;
        }

        return true;
      });
    });
  }, [columnFilters, columns, data, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage((prev) => {
      if (prev > totalPages) {
        return totalPages;
      }
      if (prev < 1) {
        return 1;
      }
      return prev;
    });
  }, [totalPages]);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setColumnFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleExport = async (format: 'xlsx' | 'csv' | 'json') => {
    try {
      if (exportLimit && sortedData.length > exportLimit) {
        toast.warning(
          `Nie można wyeksportować ${sortedData.length} rekordów. Limit wynosi ${exportLimit}. Zawęź wyniki filtrem.`,
        );
        return;
      }

      const headers = columns.map((column) => column.label);
      const matrix = sortedData.map((item) =>
        columns.map((column) => item[column.key]),
      );
      const records = sortedData.map((item) => {
        const row: Record<string, unknown> = {};
        columns.forEach((column) => {
          row[column.label] = item[column.key];
        });
        return row;
      });

      switch (format) {
        case 'xlsx':
          await exportToXLSX(headers, matrix, exportFilename);
          break;
        case 'csv':
          exportToCSV(headers, matrix, exportFilename);
          break;
        case 'json':
          exportToJSON(records, exportFilename);
          break;
        default:
          break;
      }

      toast.success(`Eksport zakończony powodzeniem (${sortedData.length} rekordów).`);
    } catch (error) {
      console.error(error);
      toast.error('Nie udało się wyeksportować danych. Spróbuj ponownie później.');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortColumn !== columnKey) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const handleColumnFilterChange = (columnKey: string, value: any) => {
    const filterConfig = columns.find((column) => column.key === columnKey)?.filter;

    setColumnFilters((prev) => {
      const next = { ...prev };

      if (filterConfig?.type === 'daterange') {
        const previousRange = (prev[columnKey] as { from?: string; to?: string }) ?? {};
        const mergedRange = {
          ...previousRange,
          ...value,
        };

        const normalisedRange = {
          from: mergedRange.from ?? '',
          to: mergedRange.to ?? '',
        };

        if (!normalisedRange.from && !normalisedRange.to) {
          delete next[columnKey];
        } else {
          next[columnKey] = normalisedRange;
        }

        return next;
      }

      if (value === '' || value === null || value === undefined) {
        delete next[columnKey];
      } else {
        next[columnKey] = value;
      }

      return next;
    });
    setCurrentPage(1);
  };

  const handlePageJump = () => {
    const parsed = Number(pageInput);
    if (Number.isNaN(parsed)) {
      setPageInput(String(currentPage));
      return;
    }
    const safePage = Math.min(Math.max(parsed, 1), totalPages);
    setCurrentPage(safePage);
    setPageInput(String(safePage));
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
        )}

        {exportable && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Eksportuj
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Eksportuj dane</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                Eksportuj do XLSX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Eksportuj do CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Eksportuj do JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                {exportLimit
                  ? `Limit eksportu: ${exportLimit} rekordów`
                  : `Rekordy do eksportu: ${sortedData.length}`}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {(hasActiveFilters || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Aktywne filtry zawężają wyniki.</span>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Wyczyść filtry
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <div
          className="max-h-[60vh] overflow-auto"
          style={{ maxHeight: bodyHeight }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`${
                      column.sortable !== false ? 'cursor-pointer select-none' : ''
                    } sticky top-0 z-10 bg-background`}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                    onDoubleClick={() => {
                      if (sortColumn === column.key) {
                        setSortColumn(null);
                        setSortDirection('asc');
                      }
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        {column.label}
                        {column.sortable !== false && <SortIcon columnKey={column.key} />}
                      </div>
                      {column.filter && (
                        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                          {column.filter.type === 'text' && (
                            <Input
                              value={columnFilters[column.key] ?? ''}
                              placeholder={column.filter.placeholder ?? 'Filtruj...'}
                              onClick={(event) => event.stopPropagation()}
                              onChange={(event) =>
                                handleColumnFilterChange(column.key, event.target.value)
                              }
                              className="h-8 text-xs"
                            />
                          )}
                          {column.filter.type === 'select' && (
                            <Select
                              value={columnFilters[column.key] ?? ''}
                              onValueChange={(value) =>
                                handleColumnFilterChange(column.key, value)
                              }
                            >
                              <SelectTrigger
                                className="h-8 text-xs"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <SelectValue
                                  placeholder={
                                    column.filter.placeholder ?? 'Wybierz wartość'
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Wszystkie</SelectItem>
                                {column.filter.options.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {column.filter.type === 'date' && (
                            <Input
                              type="date"
                              value={columnFilters[column.key] ?? ''}
                              onClick={(event) => event.stopPropagation()}
                              onChange={(event) =>
                                handleColumnFilterChange(column.key, event.target.value)
                              }
                              className="h-8 text-xs"
                            />
                          )}
                          {column.filter.type === 'daterange' && (
                            <div className="flex flex-col gap-1">
                              <Input
                                type="date"
                                value={columnFilters[column.key]?.from ?? ''}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) =>
                                  handleColumnFilterChange(column.key, {
                                    from: event.target.value,
                                  })
                                }
                                className="h-8 text-xs"
                                placeholder={column.filter.fromLabel ?? 'Od'}
                              />
                              <Input
                                type="date"
                                value={columnFilters[column.key]?.to ?? ''}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) =>
                                  handleColumnFilterChange(column.key, {
                                    to: event.target.value,
                                  })
                                }
                                className="h-8 text-xs"
                                placeholder={column.filter.toLabel ?? 'Do'}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions && (
                  <TableHead className="sticky top-0 z-10 w-[100px] bg-background">
                    Akcje
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    Brak danych do wyświetlenia
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow
                    key={index}
                    className={onRowClick ? 'cursor-pointer' : ''}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render
                          ? column.render(item[column.key], item)
                          : item[column.key]}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {actions(item)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Wierszy na stronie:
          </span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Strona {currentPage} z {totalPages} ({sortedData.length} rekordów)
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(event) => setPageInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handlePageJump();
                  }
                }}
                className="h-9 w-20"
              />
              <Button variant="outline" size="sm" onClick={handlePageJump}>
                Idź
              </Button>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                Pierwsza
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Poprzednia
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Następna
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Ostatnia
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
