import React, { useState } from 'react';
import { messages } from '../lib/mock-data';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Mail, Paperclip, Eye, Reply, Trash, Download, X } from 'lucide-react';
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

type MessageType = typeof messages[0];

export function Messages() {
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openMessage = (message: MessageType) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };

  const closeMessage = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedMessage(null), 200);
  };

  const columns: Column<typeof messages[0]>[] = [
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
    },
    {
      key: 'to',
      label: 'Do',
    },
    {
      key: 'entityName',
      label: 'Podmiot',
    },
    {
      key: 'date',
      label: 'Data',
      render: (value) => formatDateTime(value),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2>Wiadomości</h2>
            <p className="text-muted-foreground">
              Dwukierunkowa komunikacja z podmiotami nadzorowanymi
            </p>
          </div>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Nowa wiadomość
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Wszystkie ({messages.length})
          </Button>
          <Button variant="outline" size="sm">
            Nieprzeczytane ({messages.filter(m => !m.read).length})
          </Button>
          <Button variant="outline" size="sm">
            Z załącznikami ({messages.filter(m => m.hasAttachments).length})
          </Button>
        </div>

        <DataTable
          data={messages}
          columns={columns}
          searchPlaceholder="Szukaj wiadomości..."
          exportFilename="wiadomosci"
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
    </>
  );
}
