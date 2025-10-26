import React from 'react';
import { useAuth } from '../features/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Megaphone, Plus, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import { useApiData } from '../shared/hooks/use-api-data';
import { apiClient } from '../shared/api/api-client';

interface AnnouncementDto {
  id: number;
  title: string;
  content: string;
  priority: string;
  target: string;
  publishedDate?: string | null;
  expiryDate?: string | null;
  requiresAcknowledgement: boolean;
  recipients: string[];
  readBy: string[];
}

export function Announcements() {
  const { user } = useAuth();
  const { data, reload } = useApiData<AnnouncementDto[]>(() => apiClient.get('/announcements'), []);
  const announcements = data ?? [];

  const confirmRead = async (id: number) => {
    if (!user?.email) return;
    await apiClient.post(`/announcements/${id}/acknowledge`, { userEmail: user.email });
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Tablica ogłoszeń</h2>
          <p className="text-muted-foreground">Komunikaty systemowe dla podmiotów nadzorowanych</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nowy komunikat
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => {
          const currentUserId = user?.email?.toLowerCase() ?? user?.id ?? '';
          const isRead = announcement.readBy.map((entry) => entry.toLowerCase()).includes(String(currentUserId));
          const totalRecipients = announcement.recipients.length || 1;
          const readPercentage = Math.min(
            100,
            Math.round(((announcement.readBy.length || 0) / totalRecipients) * 100),
          );

          return (
            <Card key={announcement.id} className={!isRead && announcement.requiresAcknowledgement ? 'border-blue-500' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Megaphone className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle>{announcement.title}</CardTitle>
                        {announcement.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            Wysoki priorytet
                          </Badge>
                        )}
                        {!isRead && announcement.requiresAcknowledgement && (
                          <Badge variant="destructive" className="text-xs">
                            Wymaga potwierdzenia
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {announcement.publishedDate && <span>Opublikowano: {formatDateTime(announcement.publishedDate)}</span>}
                        {announcement.expiryDate && <span>Wygasa: {formatDateTime(announcement.expiryDate)}</span>}
                        <Badge variant="outline">
                          {announcement.target === 'all' ? 'Dla wszystkich' : 'Dla wybranych odbiorców'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {isRead && (
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Przeczytane
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{announcement.content}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status odczytu:</span>
                    <span>
                      {announcement.readBy.length} / {totalRecipients} ({readPercentage}%)
                    </span>
                  </div>
                  <Progress value={readPercentage} />
                </div>

                {!isRead && announcement.requiresAcknowledgement && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => confirmRead(announcement.id)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Potwierdź odczytanie
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {announcements.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Brak komunikatów do wyświetlenia.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
