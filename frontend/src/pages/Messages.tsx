import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/ui/button';
import { Mail, Paperclip, Eye, Reply, Trash, Download, X, RefreshCcw } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../features/auth';
import { createMessage, fetchMessages, MessageDto } from '../shared/api/messages';
import { ApiError } from '../shared/api/api-client';
import { toast } from 'sonner@2.0.3';

type AttachmentInfo = { name: string; size: string };

type MessageRow = {
  id: string;
  threadId?: string;
  subject: string;
  from: string;
  to: string;
  entityName: string;
  date: string;
  read: boolean;
  hasAttachments: boolean;
  content: string;
  attachments?: AttachmentInfo[];
  status?: string;
  direction?: string;
};

export function Messages() {
  const { user, currentEntity } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState<MessageRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // lokalny stan wiadomości synchronizowany z API
  const [localMessages, setLocalMessages] = useState<MessageRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // compose (nowa wiadomość)
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeTo, setComposeTo] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [composeAttachments, setComposeAttachments] = useState<AttachmentInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const mapToRow = useCallback(
    (dto: MessageDto): MessageRow => ({
      id: dto.id != null ? dto.id.toString() : dto.threadId ?? ('tmp-' + Date.now().toString()),
      threadId: dto.threadId,
      subject: dto.subject,
      from: dto.sender,
      to: dto.recipient,
      entityName: dto.entityRef ?? dto.recipient,
      date: dto.createdAt ?? new Date().toISOString(),
      read: Boolean(dto.readAt),
      hasAttachments: dto.hasAttachments,
      content: dto.content,
      status: dto.status,
      direction: dto.direction,
    }),
    [],
  );

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await fetchMessages();
      setLocalMessages(data.map(mapToRow));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Nie udalo sie pobrac wiadomosci.';
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [mapToRow]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const openMessage = (message: MessageRow) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };

  const closeMessage = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedMessage(null), 200);
  };

  const senderOptions = useMemo(
    () =>
      Array.from(
        new Set(
          localMessages
            .map((message) => message.from)
            .filter((value): value is string => Boolean(value)),
        ),
      ).map((value) => ({
        label: value,
        value,
      })),
    [localMessages],
  );

  const recipientOptions = useMemo(
    () =>
      Array.from(
        new Set(
          localMessages
            .map((message) => message.to)
            .filter((value): value is string => Boolean(value)),
        ),
      ).map((value) => ({
        label: value,
        value,
      })),
    [localMessages],
  );

  const entityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          localMessages
            .map((message) => message.entityName)
            .filter((value): value is string => Boolean(value)),
        ),
      ).map((value) => ({
        label: value,
        value,
      })),
    [localMessages],
  );

  const columns: Column<MessageRow>[] = [
    {
      key: 'read',
      label: '',
      sortable: false,
      render: (value) => (
        <div className="w-2">
          {!value && <div className="w-2 h-2 rounded-full bg-blue-600" />}
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Temat',
      filter: { type: 'text', placeholder: 'Filtruj temat' },
      render: (value, item) => (
        <button
          onClick={() => openMessage(item)}
          className="flex items-center gap-2 text-left hover:underline"
        >
          <span className={!item.read ? 'font-medium' : ''}>{value}</span>
          {item.hasAttachments && <Paperclip className="h-3 w-3 text-muted-foreground" />}
        </button>
      ),
    },
    {
      key: 'from',
      label: 'Od',
      filter: { type: 'select', placeholder: 'Wybierz nadawcę', options: senderOptions },
    },
    {
      key: 'to',
      label: 'Do',
      filter: { type: 'select', placeholder: 'Wybierz adresata', options: recipientOptions },
    },
    {
      key: 'entityName',
      label: 'Podmiot',
      filter: { type: 'select', placeholder: 'Wybierz podmiot', options: entityOptions },
    },
    {
      key: 'date',
      label: 'Data',
      filter: { type: 'daterange', fromLabel: 'Od', toLabel: 'Do' },
      render: (value) => formatDateTime(value),
    },
  ];

  const handleSend = async () => {
    if (!composeSubject.trim() || !composeTo.trim() || !composeContent.trim()) {
      toast.error('Wypelnij temat, adresata i tresc wiadomosci.');
      return;
    }

    if (!user) {
      toast.error('Brak uwierzytelnionego uzytkownika.');
      return;
    }

    const senderType = user.role === 'internal' || user.role === 'admin' ? 'internal' : 'external';
    const recipientType = senderType === 'internal' ? 'external' : 'internal';
    const attachments = composeAttachments.map((att) => ({ ...att }));

    try {
      setIsSending(true);
      const created = await createMessage({
        subject: composeSubject.trim(),
        content: composeContent.trim(),
        sender: user.name || user.email || 'UKNF',
        recipient: composeTo.trim(),
        senderRole: user.role,
        senderType,
        recipientType,
        entityRef: currentEntity?.id,
        status: 'sent',
        direction: senderType === 'internal' ? 'outbound' : 'inbound',
        hasAttachments: attachments.length > 0,
      });

      const baseMessage = mapToRow(created);
      const newMessage: MessageRow = {
        ...baseMessage,
        hasAttachments: baseMessage.hasAttachments || attachments.length > 0,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      setLocalMessages((prev) => [newMessage, ...prev]);
      toast.success('Wiadomosc zostala wyslana.');
      setIsComposeOpen(false);
      setComposeSubject('');
      setComposeTo('');
      setComposeContent('');
      setComposeAttachments([]);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Nie udalo sie wyslac wiadomosci.';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2>Wiadomosci</h2>
            <p className="text-muted-foreground">
              Dwukierunkowa komunikacja z podmiotami nadzorowanymi
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadMessages}
              disabled={isLoading}
            >
              <RefreshCcw className={isLoading ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
              Odswiez
            </Button>
            <Button onClick={() => setIsComposeOpen(true)}>
              <Mail className="mr-2 h-4 w-4" />
              Nowa wiadomosc
            </Button>
          </div>
        </div>
        {loadError && (
          <p className="text-sm text-destructive">
            {loadError}
          </p>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Wszystkie ({localMessages.length})
          </Button>
          <Button variant="outline" size="sm">
            Nieprzeczytane ({localMessages.filter(m => !m.read).length})
          </Button>
          <Button variant="outline" size="sm">
            Z zalacznikami ({localMessages.filter(m => m.hasAttachments).length})
          </Button>
        </div>

        <DataTable
          data={localMessages}
          columns={columns}
          searchPlaceholder="Szukaj wiadomości..."
          exportFilename="wiadomosci"
          exportLimit={2000}
          bodyHeight="65vh"
          actions={(message) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Akcje
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openMessage(message)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Otwórz
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Reply className="mr-2 h-4 w-4" />
                  Odpowiedz
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-muted-foreground">Od:</span> {selectedMessage.from}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Do:</span> {selectedMessage.to}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Podmiot:</span> {selectedMessage.entityName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Data:</span> {formatDateTime(selectedMessage.date)}
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <Separator />

              <ScrollArea className="max-h-[400px]">
                <div className="space-y-4 pr-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>

                  {selectedMessage.hasAttachments && selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="space-y-2">
                      <Separator />
                      <div>
                        <h4 className="mb-3">Załączniki ({selectedMessage.attachments.length})</h4>
                        <div className="space-y-2">
                          {selectedMessage.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm">{attachment.name}</p>
                                  <p className="text-xs text-muted-foreground">{attachment.size}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <Separator />

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={closeMessage}>
                  <X className="mr-2 h-4 w-4" />
                  Zamknij
                </Button>
                <Button>
                  <Reply className="mr-2 h-4 w-4" />
                  Odpowiedz
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose dialog - tworzenie nowej wiadomości */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Nowa wiadomość</h3>
              <p className="text-sm text-muted-foreground">Uzupełnij pola i wyślij wiadomość</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm">Temat</label>
              <input
                className="input w-full"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Temat wiadomości"
              />

              <label className="text-sm">Do</label>
              <input
                className="input w-full"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                placeholder="Adresat (np. Jan Kowalski)"
              />

              <label className="text-sm">Treść</label>
              <textarea
                className="textarea w-full h-40"
                value={composeContent}
                onChange={(e) => setComposeContent(e.target.value)}
                placeholder="Treść wiadomości"
              />

              <div>
                <label className="text-sm">Załączniki</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;
                      const arr: AttachmentInfo[] = [];
                      for (let i = 0; i < files.length; i++) {
                        const f = files[i];
                        arr.push({ name: f.name, size: formatBytes(f.size) });
                      }
                      setComposeAttachments((prev) => [...prev, ...arr]);
                      // reset input so same file can be picked again if needed
                      e.currentTarget.value = '';
                    }}
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Dodaj pliki
                  </Button>
                  <div className="text-sm text-muted-foreground">{composeAttachments.length} plików</div>
                </div>

                {composeAttachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {composeAttachments.map((att, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 border rounded">
                        <div className="text-sm">
                          <div>{att.name}</div>
                          <div className="text-xs text-muted-foreground">{att.size}</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setComposeAttachments(prev => prev.filter((_, i) => i !== idx))}>
                          Usuń
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setIsComposeOpen(false);
                // clear form
                setComposeSubject(''); setComposeTo(''); setComposeContent(''); setComposeAttachments([]);
              }}>
                Anuluj
              </Button>
              <Button onClick={handleSend} disabled={isSending}>
                {isSending ? 'Wysylanie...' : 'Wyslij'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
