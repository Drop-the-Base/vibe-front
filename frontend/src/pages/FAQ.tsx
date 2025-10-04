import React, { useState } from 'react';
import { faqs } from '../lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { HelpCircle, ThumbsUp, Plus, Search } from 'lucide-react';
import { formatDateTime } from '../lib/utils';

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqsByCategory = categories.map(category => ({
    category,
    items: filteredFaqs.filter(faq => faq.category === category),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>FAQ - Najczęściej zadawane pytania</h2>
          <p className="text-muted-foreground">
            Baza pytań i odpowiedzi dotyczących platformy i procedur
          </p>
        </div>
        <Button>
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
                              <span>Odpowiedział: {faq.answeredBy}</span>
                              <span>Data: {formatDateTime(faq.date)}</span>
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

        {filteredFaqs.length === 0 && (
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
    </div>
  );
}
