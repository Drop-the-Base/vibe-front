// Mock data dla demo platformy komunikacyjnej UKNF

import type { User, UserRole } from '../features/auth/types/user';

export type { User, UserRole };

export interface Entity {
  id: string;
  name: string;
  nip: string;
  type: string;
  status: 'active' | 'inactive' | 'suspended';
  contactPerson: string;
  email: string;
  phone: string;
}

export interface Report {
  id: string;
  title: string;
  entityId: string;
  entityName: string;
  type: string;
  status: 'draft' | 'submitted' | 'in_validation' | 'accepted' | 'rejected';
  submittedDate?: string;
  dueDate: string;
  assignedTo?: string;
}

export interface Message {
  id: string;
  subject: string;
  from: string;
  to: string;
  entityName: string;
  date: string;
  read: boolean;
  hasAttachments: boolean;
  content: string;
  attachments?: Array<{ name: string; size: string }>;
}

export interface Case {
  id: string;
  title: string;
  entityId: string;
  entityName: string;
  status: 'new' | 'in_progress' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdDate: string;
  updatedDate: string;
  description: string;
}

export interface LibraryFile {
  id: string;
  name: string;
  type: string;
  category: string;
  version: string;
  uploadedBy: string;
  uploadedDate: string;
  size: string;
  tags: string[];
  accessLevel: 'public' | 'internal' | 'restricted';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: 'all' | 'specific';
  targetGroups?: string[];
  publishedDate: string;
  expiryDate?: string;
  readBy: string[];
  totalRecipients: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  askedBy?: string;
  answeredBy: string;
  date: string;
  helpful: number;
}

export interface AccessRequest {
  id: string;
  userName: string;
  email: string;
  entityName: string;
  requestedRole: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  reviewedBy?: string;
  reviewDate?: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
  icon: string;
}

// Mock data
export const currentUser: User = {
  id: '1',
  name: 'Jan Kowalski',
  email: 'jan.kowalski@uknf.gov.pl',
  role: 'internal',
  active: true,
  lastLogin: '2025-10-04T09:30:00',
  createdAt: '2024-01-15T10:00:00',
};

export const entities: Entity[] = [
  {
    id: '1',
    name: 'Bank Przykładowy S.A.',
    nip: '5252525252',
    type: 'Bank',
    status: 'active',
    contactPerson: 'Maria Nowak',
    email: 'kontakt@bankprzykladowy.pl',
    phone: '+48 22 123 45 67',
  },
  {
    id: '2',
    name: 'Towarzystwo Ubezpieczeniowe XYZ',
    nip: '7373737373',
    type: 'Zakład Ubezpieczeń',
    status: 'active',
    contactPerson: 'Piotr Wiśniewski',
    email: 'kontakt@tu-xyz.pl',
    phone: '+48 22 987 65 43',
  },
  {
    id: '3',
    name: 'Fundusz Inwestycyjny ABC',
    nip: '9494949494',
    type: 'Fundusz Inwestycyjny',
    status: 'active',
    contactPerson: 'Anna Kowalczyk',
    email: 'info@fi-abc.pl',
    phone: '+48 22 555 66 77',
  },
];

export const reports: Report[] = [
  {
    id: 'RPT-2025-001',
    title: 'Sprawozdanie kwartalne Q3 2025',
    entityId: '1',
    entityName: 'Bank Przykładowy S.A.',
    type: 'Sprawozdanie kwartalne',
    status: 'accepted',
    submittedDate: '2025-09-30T14:30:00',
    dueDate: '2025-10-15T23:59:59',
    assignedTo: 'Anna Lewandowska',
  },
  {
    id: 'RPT-2025-002',
    title: 'Raport adekwatności kapitałowej',
    entityId: '1',
    entityName: 'Bank Przykładowy S.A.',
    type: 'Raport regulacyjny',
    status: 'in_validation',
    submittedDate: '2025-10-02T10:15:00',
    dueDate: '2025-10-10T23:59:59',
    assignedTo: 'Tomasz Nowak',
  },
  {
    id: 'RPT-2025-003',
    title: 'Sprawozdanie roczne 2024',
    entityId: '2',
    entityName: 'Towarzystwo Ubezpieczeniowe XYZ',
    type: 'Sprawozdanie roczne',
    status: 'submitted',
    submittedDate: '2025-09-28T16:45:00',
    dueDate: '2025-10-31T23:59:59',
    assignedTo: 'Katarzyna Wojcik',
  },
  {
    id: 'RPT-2025-004',
    title: 'Raport wypłacalności Solvency II',
    entityId: '2',
    entityName: 'Towarzystwo Ubezpieczeniowe XYZ',
    type: 'Raport regulacyjny',
    status: 'rejected',
    submittedDate: '2025-09-25T11:20:00',
    dueDate: '2025-10-05T23:59:59',
    assignedTo: 'Katarzyna Wojcik',
  },
  {
    id: 'RPT-2025-005',
    title: 'Sprawozdanie miesięczne - wrzesień 2025',
    entityId: '3',
    entityName: 'Fundusz Inwestycyjny ABC',
    type: 'Sprawozdanie miesięczne',
    status: 'draft',
    dueDate: '2025-10-07T23:59:59',
  },
];

export const messages: Message[] = [
  {
    id: 'MSG-001',
    subject: 'Pytanie dotyczące sprawozdania Q3',
    from: 'Maria Nowak',
    to: 'Anna Lewandowska',
    entityName: 'Bank Przykładowy S.A.',
    date: '2025-10-03T14:20:00',
    read: false,
    hasAttachments: true,
    content: 'Dzień dobry, mam pytanie dotyczące wypełnienia pozycji 15.3 w sprawozdaniu kwartalnym...',
    attachments: [{ name: 'screenshoot_pytanie.png', size: '245 KB' }],
  },
  {
    id: 'MSG-002',
    subject: 'Uzupełnienie dokumentacji',
    from: 'UKNF - Wydział Nadzoru',
    to: 'Piotr Wiśniewski',
    entityName: 'Towarzystwo Ubezpieczeniowe XYZ',
    date: '2025-10-02T10:30:00',
    read: true,
    hasAttachments: false,
    content: 'W związku z przesłanym raportem wypłacalności prosimy o uzupełnienie następujących dokumentów...',
  },
  {
    id: 'MSG-003',
    subject: 'Nowe wytyczne raportowania',
    from: 'UKNF - Departament Metodologii',
    to: 'Wszystkie podmioty',
    entityName: 'Bank Przykładowy S.A.',
    date: '2025-10-01T09:00:00',
    read: true,
    hasAttachments: true,
    content: 'Informujemy o nowych wytycznych dotyczących raportowania obowiązujących od Q4 2025...',
    attachments: [
      { name: 'wytyczne_2025_Q4.pdf', size: '1.2 MB' },
      { name: 'formularz_aktualizacja.xlsx', size: '85 KB' },
    ],
  },
];

export const cases: Case[] = [
  {
    id: 'CASE-2025-045',
    title: 'Weryfikacja zgodności procedur AML',
    entityId: '1',
    entityName: 'Bank Przykładowy S.A.',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Tomasz Nowak',
    createdDate: '2025-09-15T10:00:00',
    updatedDate: '2025-10-03T15:30:00',
    description: 'Kontrola procedur przeciwdziałania praniu pieniędzy i finansowaniu terroryzmu.',
  },
  {
    id: 'CASE-2025-046',
    title: 'Zmiana statusu licencji',
    entityId: '2',
    entityName: 'Towarzystwo Ubezpieczeniowe XYZ',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Katarzyna Wojcik',
    createdDate: '2025-09-20T14:30:00',
    updatedDate: '2025-09-28T11:00:00',
    description: 'Wniosek o rozszerzenie zakresu licencji o dodatkowe grupy ubezpieczeń.',
  },
  {
    id: 'CASE-2025-047',
    title: 'Aktualizacja danych kontaktowych',
    entityId: '3',
    entityName: 'Fundusz Inwestycyjny ABC',
    status: 'closed',
    priority: 'low',
    assignedTo: 'Anna Lewandowska',
    createdDate: '2025-09-10T09:00:00',
    updatedDate: '2025-09-12T16:45:00',
    description: 'Zmiana adresu siedziby i aktualizacja danych zarządu.',
  },
];

export const libraryFiles: LibraryFile[] = [
  {
    id: 'FILE-001',
    name: 'Instrukcja raportowania Q4 2025',
    type: 'PDF',
    category: 'Instrukcje',
    version: '2.1',
    uploadedBy: 'System',
    uploadedDate: '2025-09-15T10:00:00',
    size: '2.4 MB',
    tags: ['raportowanie', 'instrukcja', 'Q4'],
    accessLevel: 'public',
  },
  {
    id: 'FILE-002',
    name: 'Formularz sprawozdania kwartalnego',
    type: 'XLSX',
    category: 'Formularze',
    version: '1.5',
    uploadedBy: 'System',
    uploadedDate: '2025-09-01T08:00:00',
    size: '156 KB',
    tags: ['formularz', 'kwartalne'],
    accessLevel: 'public',
  },
  {
    id: 'FILE-003',
    name: 'Wytyczne EBA 2025',
    type: 'PDF',
    category: 'Regulacje',
    version: '1.0',
    uploadedBy: 'Admin',
    uploadedDate: '2025-08-20T12:30:00',
    size: '4.8 MB',
    tags: ['EBA', 'regulacje', 'wytyczne'],
    accessLevel: 'internal',
  },
];

export const announcements: Announcement[] = [
  {
    id: 'ANN-001',
    title: 'Przerwa techniczna systemu - 15.10.2025',
    content: 'Informujemy, że w dniu 15 października 2025 r. w godzinach 22:00-02:00 planowana jest przerwa techniczna związana z aktualizacją systemu.',
    target: 'all',
    publishedDate: '2025-10-01T09:00:00',
    expiryDate: '2025-10-16T00:00:00',
    readBy: ['1', '2'],
    totalRecipients: 150,
  },
  {
    id: 'ANN-002',
    title: 'Nowe terminy raportowania - banki',
    content: 'Wprowadzamy nowe terminy składania sprawozdań kwartalnych dla banków, obowiązujące od Q1 2026.',
    target: 'specific',
    targetGroups: ['Banki'],
    publishedDate: '2025-09-28T14:00:00',
    readBy: ['1'],
    totalRecipients: 45,
  },
];

export const faqs: FAQ[] = [
  {
    id: 'FAQ-001',
    question: 'Jak mogę zmienić dane kontaktowe podmiotu?',
    answer: 'Dane kontaktowe można zmienić w sekcji "Kartoteka podmiotów" po zalogowaniu się na konto administratora podmiotu. Zmiany są weryfikowane przez UKNF w ciągu 2 dni roboczych.',
    category: 'Zarządzanie kontem',
    askedBy: 'Maria Nowak',
    answeredBy: 'UKNF Support',
    date: '2025-09-20T10:30:00',
    helpful: 15,
  },
  {
    id: 'FAQ-002',
    question: 'Jaki jest termin składania sprawozdań kwartalnych?',
    answer: 'Sprawozdania kwartalne należy składać do 15 dnia miesiąca następującego po zakończeniu kwartału. W przypadku dni wolnych termin przesuwa się na następny dzień roboczy.',
    category: 'Sprawozdawczość',
    answeredBy: 'UKNF Support',
    date: '2025-09-18T14:15:00',
    helpful: 28,
  },
  {
    id: 'FAQ-003',
    question: 'Czy mogę cofnąć przesłane sprawozdanie?',
    answer: 'Tak, sprawozdanie można cofnąć do momentu rozpoczęcia jego walidacji przez pracownika UKNF. Po rozpoczęciu walidacji konieczny jest kontakt z przypisanym pracownikiem.',
    category: 'Sprawozdawczość',
    answeredBy: 'UKNF Support',
    date: '2025-09-15T11:20:00',
    helpful: 22,
  },
];

export const accessRequests: AccessRequest[] = [
  {
    id: 'REQ-001',
    userName: 'Paweł Kowal',
    email: 'p.kowal@bankprzykladowy.pl',
    entityName: 'Bank Przykładowy S.A.',
    requestedRole: 'Przedstawiciel podmiotu',
    status: 'pending',
    requestDate: '2025-10-03T15:20:00',
  },
  {
    id: 'REQ-002',
    userName: 'Ewa Zielińska',
    email: 'e.zielinska@tu-xyz.pl',
    entityName: 'Towarzystwo Ubezpieczeniowe XYZ',
    requestedRole: 'Administrator podmiotu',
    status: 'approved',
    requestDate: '2025-10-01T09:45:00',
    reviewedBy: 'Jan Kowalski',
    reviewDate: '2025-10-02T10:30:00',
  },
];

export const activities: Activity[] = [
  {
    id: 'ACT-001',
    type: 'announcement',
    description: 'Nowy komunikat w tablicy ogłoszeń',
    user: 'System',
    timestamp: '2025-10-04T11:00:00',
    icon: 'megaphone',
  },
  {
    id: 'ACT-002',
    type: 'report',
    description: 'Złożono sprawozdanie "Raport adekwatności kapitałowej"',
    user: 'Bank Przykładowy S.A.',
    timestamp: '2025-10-02T10:15:00',
    icon: 'file-text',
  },
  {
    id: 'ACT-003',
    type: 'user',
    description: 'Zaakceptowano wniosek o dostęp dla użytkownika Ewa Zielińska',
    user: 'Jan Kowalski',
    timestamp: '2025-10-02T10:30:00',
    icon: 'user-check',
  },
  {
    id: 'ACT-004',
    type: 'case',
    description: 'Zaktualizowano sprawę CASE-2025-045',
    user: 'Tomasz Nowak',
    timestamp: '2025-10-03T15:30:00',
    icon: 'briefcase',
  },
];

export const users: User[] = [
  currentUser,
  {
    id: '2',
    name: 'Anna Lewandowska',
    email: 'anna.lewandowska@uknf.gov.pl',
    role: 'internal',
    active: true,
    lastLogin: '2025-10-04T08:15:00',
    createdAt: '2024-02-10T09:00:00',
  },
  {
    id: '3',
    name: 'Maria Nowak',
    email: 'maria.nowak@bankprzykladowy.pl',
    role: 'external_admin',
    entity: 'Bank Przykładowy S.A.',
    entityId: '1',
    active: true,
    lastLogin: '2025-10-03T16:30:00',
    createdAt: '2024-03-15T10:30:00',
  },
  {
    id: '4',
    name: 'Piotr Wiśniewski',
    email: 'piotr.wisniewski@tu-xyz.pl',
    role: 'external_admin',
    entity: 'Towarzystwo Ubezpieczeniowe XYZ',
    entityId: '2',
    active: true,
    lastLogin: '2025-10-04T09:00:00',
    createdAt: '2024-04-20T11:00:00',
  },
];
