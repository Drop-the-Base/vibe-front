import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth';
import {
  reports,
  messages,
  accessRequests,
  announcements,
  activities,
  entities,
  cases,
} from '../lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import {
  FileText,
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

export function Dashboard() {
  const { user } = useAuth();

  const unreadMessages = messages.filter(m => !m.read).length;
  const pendingRequests = accessRequests.filter(r => r.status === 'pending').length;
  const unreadAnnouncements = announcements.filter(
    a => !a.readBy.includes(user?.id || '')
  ).length;

  const recentReports = reports.slice(0, 5);
  const recentCases = cases.slice(0, 3);
  const recentActivities = activities.slice(0, 6);

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
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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
      {/* Welcome Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Witaj, {user?.name}!</CardTitle>
          <CardDescription>
            Rola: {user?.role === 'internal' ? 'Pracownik UKNF' : 'Administrator podmiotu'} | 
            Ostatnie logowanie: {user?.lastLogin ? formatDateTime(user.lastLogin) : 'N/A'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Dashboard Tiles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Dostępne podmioty</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{entities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              aktywnych podmiotów nadzorowanych
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Nowe wiadomości</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              nieprzeczytanych wiadomości
            </p>
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
            <div className="text-2xl">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              oczekujących wniosków
            </p>
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
            <div className="text-2xl">{unreadAnnouncements}</div>
            <p className="text-xs text-muted-foreground mt-1">
              nieprzeczytanych ogłoszeń
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/announcements">Zobacz tablicę →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reports */}
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
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-start justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(report.status)}
                      <p className="truncate">{report.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{report.entityName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Termin: {formatDateTime(report.dueDate)}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(report.status)}>
                    {getStatusLabel(report.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie zdarzenia</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex gap-3">
                      <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatDateTime(activity.timestamp)}</span>
                          <span>•</span>
                          <span>{activity.user}</span>
                        </div>
                      </div>
                    </div>
                    {index < recentActivities.length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Cases */}
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
              {recentCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{caseItem.id}</span>
                    </div>
                    <Badge variant={getStatusVariant(caseItem.status)}>
                      {getStatusLabel(caseItem.status)}
                    </Badge>
                  </div>
                  <p className="mb-1">{caseItem.title}</p>
                  <p className="text-xs text-muted-foreground">{caseItem.entityName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Przypisane: {caseItem.assignedTo}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
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
            <div className="space-y-3">
              {announcements.slice(0, 3).map((announcement) => {
                const isRead = announcement.readBy.includes(user?.id || '');
                return (
                  <div
                    key={announcement.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      !isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                        {!isRead && (
                          <Badge variant="destructive" className="text-xs">
                            Nowe
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(announcement.publishedDate)}
                      </span>
                    </div>
                    <p className="mb-1">{announcement.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {announcement.content}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Przeczytało: {announcement.readBy.length} / {announcement.totalRecipients}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Indicators */}
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
