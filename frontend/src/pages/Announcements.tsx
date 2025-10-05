import React, { useEffect, useState } from 'react';
import { announcements as mockAnnouncements } from '../lib/mock-data';
import { useAuth } from '../features/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Megaphone, Plus, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import { announcementsApi, type AnnouncementDto } from '../shared/api/announcements';
import { toast } from 'sonner';

type AnnouncementRow = {
  id: number | string;
  title: string;
  content: string;
  targetType: string;
  publishedDate: string;
  expiryDate: string | null | undefined;
  requiresAcknowledgement: boolean;
  totalRecipients: number | null;
  priority: string;
  targetGroups: string[];
  readers: AnnouncementDto['readers'];
};

const mapDtoToRow = (item: AnnouncementDto): AnnouncementRow => ({
  id: item.id,
  title: item.title,
  content: item.content,
  targetType: item.targetType,
  publishedDate: item.publishedAt,
  expiryDate: item.expiresAt,
  requiresAcknowledgement: item.requiresAcknowledgement,
  totalRecipients: item.totalRecipients ?? null,
  priority: item.priority ?? 'medium',
  targetGroups: item.targetGroups ?? [],
  readers: item.readers ?? [],
});

const mapMockToRow = (item: (typeof mockAnnouncements)[number]): AnnouncementRow => ({
  id: item.id,
  title: item.title,
  content: item.content,
  targetType: item.target,
  publishedDate: item.publishedDate,
  expiryDate: item.expiryDate,
  requiresAcknowledgement: true,
  totalRecipients: item.totalRecipients ?? null,
  priority: 'medium',
  targetGroups: item.targetGroups ?? [],
  readers: (item.readBy ?? []).map((readerId) => ({
    readerId,
    readerName: readerId,
    readerEntity: null,
    readAt: null,
  })),
});

export function Announcements() {
  const { user, currentEntity } = useAuth();
  const [announcementItems, setAnnouncementItems] = useState<AnnouncementRow[]>(() =>
    mockAnnouncements.map(mapMockToRow),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acknowledgingId, setAcknowledgingId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await announcementsApi.list();
        if (!mounted) return;
        setAnnouncementItems(data.map(mapDtoToRow));
        setError(null);
      } catch (err) {
        if (!mounted) return;
        console.warn('Nie udało się pobrać komunikatów', err);
        setError('Nie udało się pobrać komunikatów. Wyświetlamy dane demonstracyjne.');
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

  const userId = user?.id;
  const userEntityName = currentEntity?.name ?? user?.entity ?? null;

  const handleAcknowledge = async (announcement: AnnouncementRow) => {
    if (typeof announcement.id !== 'number' || !userId || !user?.name) {
      toast.info('Potwierdzanie dostępne wyłącznie dla komunikatów pobranych z serwera.');
      return;
    }

    setAcknowledgingId(announcement.id);
    try {
      const updated = await announcementsApi.acknowledge(announcement.id, {
        readerId: userId,
        readerName: user.name,
        readerEntity: userEntityName ?? undefined,
      });
      setAnnouncementItems((prev) =>
        prev.map((item) => (item.id === announcement.id ? mapDtoToRow(updated) : item)),
      );
      toast.success('Potwierdzono odczytanie komunikatu.');
    } catch (err) {
      console.error('Nie udało się potwierdzić komunikatu', err);
      toast.error('Nie udało się zapisać potwierdzenia odczytu. Spróbuj ponownie.');
    } finally {
      setAcknowledgingId(null);
    }
  };

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

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {announcementItems.map((announcement) => {
          const readCount = announcement.readers.length;
          const totalRecipients = announcement.totalRecipients ?? 0;
          const readPercentage = totalRecipients > 0 ? (readCount / totalRecipients) * 100 : 0;
          const isRead = Boolean(userId && announcement.readers.some((reader) => reader.readerId === userId));
          const isProcessing = acknowledgingId === announcement.id;

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
                          {announcement.targetType === 'all'
                            ? 'Dla wszystkich'
                            : announcement.targetType === 'group'
                              ? 'Dla wybranych grup'
                              : 'Dla wybranych odbiorców'}
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
                      {readCount} / {totalRecipients} ({Math.round(readPercentage)}%)
                    </span>
                  </div>
                  <Progress value={readPercentage} />
                </div>

                {!isRead && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={isProcessing || typeof announcement.id !== 'number' || loading}
                      onClick={() => handleAcknowledge(announcement)}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {isProcessing ? 'Zapisywanie...' : 'Potwierdź odczytanie'}
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
