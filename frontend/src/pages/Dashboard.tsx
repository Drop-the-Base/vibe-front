import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import {
  Mail,
  UserPlus,
  Megaphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Building2,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import { apiClient } from '../shared/api/api-client';
import { useApiData } from '../shared/hooks/use-api-data';

interface DashboardOverviewDto {
  entities: number;
  unreadMessages: number;
  pendingRequests: number;
  unreadAnnouncements: number;
  recentReports: Array<{ id: string; title: string; entity: string; status: string; dueDate?: string | null }>;
  recentCases: Array<{ id: string; title: string; entity: string; status: string; priority: string }>;
  recentActivities: Array<{ type: string; description: string; actor: string; timestamp?: string | null }>;
}

const emptyOverview: DashboardOverviewDto = {
  entities: 0,
  unreadMessages: 0,
  pendingRequests: 0,
  unreadAnnouncements: 0,
  recentReports: [],
  recentCases: [],
  recentActivities: [],
};

export function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useApiData<DashboardOverviewDto>(() => apiClient.get('/dashboard'), []);
  const overview = data ?? emptyOverview;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_validation':
      case 'submitted':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Do przesłania',
      submitted: 'Przesłane',
      in_validation: 'W trakcie walidacji',
      accepted: 'Zaakceptowane',
      rejected: 'Odrzucone',
      new: 'Nowa',
      in_progress: 'W trakcie',
      pending: 'Oczekująca',
      closed: 'Zamknięta',
      low: 'Niski',
      medium: 'Średni',
      high: 'Wysoki',
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'accepted':
      case 'closed':
        return 'default';
      case 'in_validation':
      case 'submitted':
      case 'in_progress':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Witaj, {user?.name}!</CardTitle>
          <CardDescription>
            Rola: {user?.role === 'internal' ? 'Pracownik UKNF' : 'Administrator podmiotu'} |
            Ostatnie logowanie: {user?.lastLogin ? formatDateTime(user.lastLogin) : 'N/A'}
            {loading && ' (ładowanie danych...)'}
            {error && <span className="text-destructive"> | {error}</span>}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Dostępne podmioty</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overview.entities}</div>
            <p className="text-xs text-muted-foreground mt-1">aktywne podmioty nadzorowane</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Nowe wiadomości</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overview.unreadMessages}</div>
            <p className="text-xs text-muted-foreground mt-1">nieprzeczytane wiadomości</p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/messages">Zobacz wszystkie →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Wnioski o dostęp</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overview.pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">wnioski oczekujące na decyzję</p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/admin/requests">Przejdź do wniosków →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Nowe komunikaty</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overview.unreadAnnouncements}</div>
            <p className="text-xs text-muted-foreground mt-1">komunikaty wymagające uwagi</p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/announcements">Zobacz tablicę →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Statusy sprawozdań</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/reports">
                  Zobacz wszystkie <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview.recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-start justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(report.status)}
                      <p className="truncate">{report.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{report.entity}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Termin: {report.dueDate ? formatDateTime(report.dueDate) : 'Brak terminu'}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(report.status)}>{getStatusLabel(report.status)}</Badge>
                </div>
              ))}
              {overview.recentReports.length === 0 && (
                <p className="text-sm text-muted-foreground">Brak najnowszych sprawozdań.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ostatnie aktywności</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/messages">
                  Szczegóły <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {overview.recentActivities.map((activity, index) => (
                  <React.Fragment key={`${activity.description}-${index}`}>
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp ? formatDateTime(activity.timestamp) : 'Brak daty'} · {activity.actor}
                        </p>
                      </div>
                    </div>
                    {index < overview.recentActivities.length - 1 && <Separator className="my-3" />}
                  </React.Fragment>
                ))}
                {overview.recentActivities.length === 0 && (
                  <p className="text-sm text-muted-foreground">Brak ostatnich aktywności.</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ostatnie sprawy</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/cases">
                  Zobacz wszystkie <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview.recentCases.map((caseItem) => (
                <div key={caseItem.id} className="p-3 rounded-lg border hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{caseItem.id}</span>
                    </div>
                    <Badge variant={getStatusVariant(caseItem.status)}>{getStatusLabel(caseItem.status)}</Badge>
                  </div>
                  <p className="mb-1">{caseItem.title}</p>
                  <p className="text-xs text-muted-foreground">{caseItem.entity}</p>
                  <p className="text-xs text-muted-foreground mt-1">Priorytet: {getStatusLabel(caseItem.priority)}</p>
                </div>
              ))}
              {overview.recentCases.length === 0 && (
                <p className="text-sm text-muted-foreground">Brak spraw w toku.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tablica ogłoszeń</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/announcements">
                  Zobacz wszystkie <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sprawdź moduł komunikatów, aby potwierdzić zapoznanie z ogłoszeniami priorytetowymi.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wskaźniki bezpieczeństwa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Ostatnie logowanie</p>
              <p className="mt-1">{user?.lastLogin ? formatDateTime(user.lastLogin) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ostatnia zmiana hasła</p>
              <p className="mt-1">2025-08-15, 14:30</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aktywność konta</p>
              <p className="mt-1 text-green-600">Aktywne</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
