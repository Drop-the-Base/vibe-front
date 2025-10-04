import React from 'react';
import { announcements } from '../lib/mock-data';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Megaphone, Plus, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '../lib/utils';

export function Announcements() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Tablica ogłoszeń</h2>
          <p className="text-muted-foreground">
            Komunikaty systemowe dla podmiotów nadzorowanych
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nowy komunikat
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => {
          const isRead = announcement.readBy.includes(user?.id || '');
          const readPercentage = (announcement.readBy.length / announcement.totalRecipients) * 100;

          return (
            <Card key={announcement.id} className={!isRead ? 'border-blue-500' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Megaphone className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle>{announcement.title}</CardTitle>
                        {!isRead && (
                          <Badge variant="destructive" className="text-xs">
                            Nowe
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Opublikowano: {formatDateTime(announcement.publishedDate)}</span>
                        {announcement.expiryDate && (
                          <span>Wygasa: {formatDateTime(announcement.expiryDate)}</span>
                        )}
                        <Badge variant="outline">
                          {announcement.target === 'all' ? 'Dla wszystkich' : 'Dla wybranych grup'}
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
                      {announcement.readBy.length} / {announcement.totalRecipients} ({Math.round(readPercentage)}%)
                    </span>
                  </div>
                  <Progress value={readPercentage} />
                </div>

                {!isRead && (
                  <div className="flex gap-2">
                    <Button size="sm">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Potwierdź odczytanie
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
