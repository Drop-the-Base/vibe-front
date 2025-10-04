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
import { createMessage, fetchMessages, MessageDto, updateMessageReadStatus } from '../shared/api/messages';
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

  // lokalny stan wiadomosci synchronizowany z API
  const [localMessages, setLocalMessages] = useState<MessageRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // compose (nowa wiadomosc)
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeTo, setComposeTo] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [composeAttachments, setComposeAttachments] = useState<AttachmentInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const userIdentity = useMemo(() => {
    if (!user) return null;
    const email = user.email?.trim().toLowerCase();
    const name = user.name?.trim().toLowerCase();
    if (email) return email;
    if (name) return name;
    return null;
  }, [user]);

  const isVisibleMessage = useCallback(
    (row: MessageRow) => {
      if (!userIdentity) {
        return false;
      }
      const from = row.from?.toLowerCase();
      const to = row.to?.toLowerCase();
      return from === userIdentity || to === userIdentity;
    },
    [userIdentity],
  );

  const mapToRow = useCallback((dto: MessageDto): MessageRow => {
    const sender = dto.sender?.trim() ?? '';
    const recipient = dto.recipient?.trim() ?? '';
    const normalizedSender = sender.toLowerCase();
    const read = Boolean(dto.readAt) || (userIdentity != null && normalizedSender === userIdentity);
    return {
      id: dto.id != null ? dto.id.toString() : dto.threadId ?? ('tmp-' + Date.now().toString()),
      threadId: dto.threadId,
      subject: dto.subject,
      from: sender,
      to: recipient,
      entityName: dto.entityRef ?? recipient,
      date: dto.createdAt ?? new Date().toISOString(),
      read,
      hasAttachments: dto.hasAttachments,
      content: dto.content,
      status: dto.status,
      direction: dto.direction,
    };
  }, [userIdentity]);

  const loadMessages = useCallback(async () => {
    if (!userIdentity) {
      setLocalMessages([]);
      setLoadError(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await fetchMessages();
      const mapped = data.map(mapToRow).filter(isVisibleMessage);
      setLocalMessages(mapped);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Nie udalo sie pobrac wiadomosci.';
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [mapToRow, isVisibleMessage, userIdentity]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!userIdentity) {
      setLocalMessages([]);
      return;
    }
    setLocalMessages((prev) => prev.filter(isVisibleMessage));
  }, [isVisibleMessage, userIdentity]);

  const applyUpdatedMessage = useCallback((updated: MessageRow) => {
    setLocalMessages((prev) => {
      if (!isVisibleMessage(updated)) {
        return prev.filter((item) => item.id !== updated.id);
      }
      let found = false;
      const mapped = prev.map((item) => {
        if (item.id === updated.id) {
          found = true;
          return { ...item, ...updated, attachments: updated.attachments ?? item.attachments };
        }
        return item;
      });
      if (!found) {
        return [updated, ...mapped];
      }
      return mapped;
    });
    setSelectedMessage((prev) => {
      if (!prev || prev.id !== updated.id) {
        return prev;
      }
      if (!isVisibleMessage(updated)) {
        setIsDialogOpen(false);
        return null;
      }
      return { ...prev, ...updated, attachments: updated.attachments ?? prev.attachments };
    });
  }, [isVisibleMessage]);

  const handleToggleRead = useCallback(
    async (row: MessageRow, shouldBeRead: boolean) => {
      if (!userIdentity) {
        return;
      }
      const numericId = Number(row.id);
      const optimistic: MessageRow = { ...row, read: shouldBeRead };
      applyUpdatedMessage(optimistic);

      if (!Number.isFinite(numericId)) {
        return;
      }

      try {
        const dto = await updateMessageReadStatus(numericId, { read: shouldBeRead });
        const mapped = mapToRow(dto);
        const merged: MessageRow = {
          ...mapped,
          attachments: row.attachments,
          hasAttachments: row.hasAttachments,
        };
        applyUpdatedMessage(merged);
      } catch (error) {
        applyUpdatedMessage(row);
        const message =
          error instanceof ApiError
            ? error.message
            : 'Nie udalo sie zaktualizowac statusu wiadomosci.';
        toast.error(message);
      }
    },
    [applyUpdatedMessage, mapToRow, userIdentity],
  );

  const openMessage = (message: MessageRow) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    if (!message.read) {
      void handleToggleRead(message, true);
    }
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
      filter: { type: 'select', placeholder: 'Wybierz nadawce', options: senderOptions },
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
    const subjectValue = composeSubject.trim();
    const recipientValue = composeTo.trim();
    const contentValue = composeContent.trim();

    if (!subjectValue || !recipientValue || !contentValue) {
      toast.error('Wypelnij temat, adresata i tresc wiadomosci.');
      return;
    }

    if (!user) {
      toast.error('Brak uwierzytelnionego uzytkownika.');
      return;
    }

    const senderIdentity = user.email?.trim() || user.name?.trim() || 'UKNF';
    const senderType = user.role === 'internal' || user.role === 'admin' ? 'internal' : 'external';
    const recipientType = senderType === 'internal' ? 'external' : 'internal';
    const attachments = composeAttachments.map((att) => ({ ...att }));

    try {
      setIsSending(true);
      const created = await createMessage({
        subject: subjectValue,
        content: contentValue,
        sender: senderIdentity,
        recipient: recipientValue,
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

      if (isVisibleMessage(newMessage)) {
        applyUpdatedMessage(newMessage);
      }
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
          searchPlaceholder="Szukaj wiadomosci..."
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
                  Otworz
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleRead(message, !message.read)}>
                  {message.read ? 'Oznacz jako nieprzeczytana' : 'Oznacz jako przeczytana'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  if (!message) return;
                  const subject = message.subject?.trim() ?? '';
                  const prefix = subject.toLowerCase().startsWith('re:') ? '' : 'Re: ';
                  setComposeSubject(prefix + subject);
                  setComposeTo(message.from ?? '');
                  setComposeContent('');
                  setComposeAttachments([]);
                  setIsComposeOpen(true);
                }}>
                  <Reply className="mr-2 h-4 w-4" />
                  Odpowiedz
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Usun
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
                        <h4 className="mb-3">Zalaczniki ({selectedMessage.attachments.length})</h4>
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
                <Button
                  onClick={() => {
                  if (!selectedMessage) return;
                  setIsDialogOpen(false);
                  setIsComposeOpen(true);
                  setComposeTo(selectedMessage.from);
                  setComposeSubject(
                    selectedMessage.subject.startsWith('Re:') ? selectedMessage.subject : `Re: ${selectedMessage.subject}`
                  );
                  setComposeContent(
                    `\n\n--- Oryginalna wiadomosc ---\nOd: ${selectedMessage.from}\nDo: ${selectedMessage.to}\nData: ${formatDateTime(selectedMessage.date)}\n\n${selectedMessage.content}`
                  );
                  }}
                >
                  <Reply className="mr-2 h-4 w-4" />
                  Odpowiedz
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose dialog - tworzenie nowej wiadomosci */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Nowa wiadomosc</h3>
              <p className="text-sm text-muted-foreground">Uzupelnij pola i wyslij wiadomosc</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm">Temat</label>
              <input
                className="input w-full"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Temat wiadomosci"
              />

              <label className="text-sm">Do</label>
              <input
                className="input w-full"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                placeholder="Adresat (np. Jan Kowalski)"
              />

              <label className="text-sm">Tresc</label>
              <textarea
                className="textarea w-full h-40"
                value={composeContent}
                onChange={(e) => setComposeContent(e.target.value)}
                placeholder="Tresc wiadomosci"
              />

              <div>
                <label className="text-sm">Zalaczniki</label>
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
                  <div className="text-sm text-muted-foreground">{composeAttachments.length} plikow</div>
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
                          Usun
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



