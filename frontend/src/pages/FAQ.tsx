import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { HelpCircle, ThumbsUp, Plus, Search } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import { fetchFaqCategories, fetchFaqItems, createFaqQuestion } from '../features/faq/services/faq-client';
import type { FaqCategory, FaqItem } from '../features/faq/types/faq';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner@2.0.3';

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<FaqCategory[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    question: '',
    details: '',
    categoryId: '',
    anonymous: true,
  });

  useEffect(() => {
    const loadFaq = async () => {
      setLoading(true);
      setError(null);

      try {
        const loadedItems = await fetchFaqItems();
        setItems(loadedItems);
      } catch (err) {
        setError('Nie udało się pobrać pytań FAQ. Spróbuj ponownie później.');
      }

      try {
        const loadedCategories = await fetchFaqCategories();
        setCategories(loadedCategories);
        if (loadedCategories.length > 0) {
          setCreateForm((prev) => ({
            ...prev,
            categoryId: prev.categoryId || loadedCategories[0].id,
          }));
        }
      } catch (err) {
        // Kategorie są opcjonalne – wystarczy powiadomienie zamiast blokować cały ekran
        console.error('Nie udało się pobrać kategorii FAQ.', err);
      } finally {
        setLoading(false);
      }
    };

    loadFaq();
  }, []);

  useEffect(() => {
    if (createOpen && categories.length > 0 && !createForm.categoryId) {
      setCreateForm((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [createOpen, categories, createForm.categoryId]);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) {
      return items;
    }
    const query = searchQuery.trim().toLowerCase();
    return items.filter((faq) =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query),
    );
  }, [items, searchQuery]);

  const filteredCategories = useMemo(() => {
    const set = new Set(filteredFaqs.map((faq) => faq.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pl'));
  }, [filteredFaqs]);

  const faqsByCategory = filteredCategories.map((category) => ({
    category,
    items: filteredFaqs.filter((faq) => faq.category === category),
  }));

  const handleCreateFieldChange = (
    field: 'question' | 'details' | 'categoryId' | 'anonymous',
  ) => (value: string | boolean) => {
    setCreateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (createError) {
      setCreateError(null);
    }
  };

  const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!createForm.question.trim()) {
      setCreateError('Pytanie jest wymagane.');
      return;
    }

    const category = categories.find((item) => item.id === createForm.categoryId);
    if (!category) {
      setCreateError('Wybierz kategorię.');
      return;
    }

    const content = createForm.details.trim() || createForm.question.trim();

    setCreateLoading(true);
    try {
      await createFaqQuestion({
        title: createForm.question.trim(),
        content,
        categoryLink: category.link,
        anonymous: createForm.anonymous,
      });
      toast.success('Pytanie zostało przesłane do weryfikacji.');
      setCreateOpen(false);
      setCreateForm({
        question: '',
        details: '',
        categoryId: category.id,
        anonymous: createForm.anonymous,
      });
      await Promise.all([fetchFaqItems(), fetchFaqCategories()])
        .then(([loadedItems, loadedCategories]) => {
          setItems(loadedItems);
          setCategories(loadedCategories);
        })
        .catch(() => {
          setError('Nie udało się odświeżyć listy pytań po dodaniu.');
        });
    } catch (err) {
      setCreateError('Nie udało się dodać pytania. Spróbuj ponownie później.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>FAQ - Najczęściej zadawane pytania</h2>
          <p className="text-muted-foreground">
            Baza pytań i odpowiedzi dotyczących platformy i procedur
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Zadaj pytanie
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj w pytaniach i odpowiedziach..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Ładowanie pytań...
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6">
        {faqsByCategory.map(({ category, items }) => (
          items.length > 0 && (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {category}
                  <Badge variant="secondary">{items.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {items.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p className="text-muted-foreground">{faq.answer}</p>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Odpowiedział: {faq.answeredBy ?? 'Pracownik UKNF'}</span>
                              <span>
                                Data: {faq.date ? formatDateTime(faq.date) : 'brak danych'}
                              </span>
                              {faq.askedBy && <span>Pytanie od: {faq.askedBy}</span>}
                            </div>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <ThumbsUp className="h-4 w-4" />
                              Pomocne ({faq.helpful})
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )
        ))}

        {!loading && filteredFaqs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3>Nie znaleziono pytań</h3>
              <p className="text-muted-foreground mt-2">
                Spróbuj użyć innych słów kluczowych lub zadaj nowe pytanie
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <form className="space-y-6" onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle>Nowe pytanie FAQ</DialogTitle>
              <DialogDescription>
                Zadaj pytanie. Po weryfikacji przez pracownika zostanie opublikowane na liście FAQ.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faq-question">Pytanie</Label>
                <Input
                  id="faq-question"
                  value={createForm.question}
                  onChange={(event) => handleCreateFieldChange('question')(event.target.value)}
                  required
                  placeholder="Opisz swoje pytanie"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faq-details">Dodatkowe szczegóły</Label>
                <Textarea
                  id="faq-details"
                  value={createForm.details}
                  onChange={(event) => handleCreateFieldChange('details')(event.target.value)}
                  placeholder="Opcjonalnie opisz dokładniej kontekst pytania"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faq-category">Kategoria</Label>
                <Select
                  value={createForm.categoryId}
                  onValueChange={(value) => handleCreateFieldChange('categoryId')(value)}
                >
                  <SelectTrigger id="faq-category">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Brak dostępnych kategorii
                      </div>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="faq-anonymous"
                  checked={createForm.anonymous}
                  onCheckedChange={(checked) =>
                    handleCreateFieldChange('anonymous')(checked === true)
                  }
                />
                <Label htmlFor="faq-anonymous" className="text-sm text-muted-foreground">
                  Zadaj pytanie anonimowo
                </Label>
              </div>

              {createError && (
                <p className="text-sm text-destructive">{createError}</p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={createLoading}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                disabled={createLoading || categories.length === 0}
              >
                {createLoading ? 'Wysyłanie...' : 'Wyślij pytanie'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
