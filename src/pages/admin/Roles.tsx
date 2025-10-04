import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Shield, Plus, Edit } from 'lucide-react';

const roles = [
  {
    id: 'admin',
    name: 'Administrator systemu',
    description: 'Pełny dostęp do wszystkich funkcji systemu',
    usersCount: 2,
    permissions: [
      'Zarządzanie użytkownikami',
      'Zarządzanie rolami',
      'Zarządzanie podmiotami',
      'Zarządzanie sprawozdaniami',
      'Zarządzanie wiadomościami',
      'Zarządzanie sprawami',
      'Zarządzanie biblioteką',
      'Zarządzanie ogłoszeniami',
      'Konfiguracja systemu',
      'Dostęp do logów',
    ],
  },
  {
    id: 'internal',
    name: 'Pracownik UKNF',
    description: 'Dostęp do funkcji nadzorczych',
    usersCount: 15,
    permissions: [
      'Przeglądanie sprawozdań',
      'Walidacja sprawozdań',
      'Komunikacja z podmiotami',
      'Zarządzanie sprawami',
      'Dostęp do biblioteki',
      'Publikowanie ogłoszeń',
      'Przeglądanie FAQ',
    ],
  },
  {
    id: 'external_admin',
    name: 'Administrator podmiotu',
    description: 'Zarządzanie użytkownikami i danymi podmiotu',
    usersCount: 8,
    permissions: [
      'Składanie sprawozdań',
      'Komunikacja z UKNF',
      'Zarządzanie użytkownikami podmiotu',
      'Aktualizacja danych podmiotu',
      'Dostęp do biblioteki',
      'Przeglądanie ogłoszeń',
      'Przeglądanie FAQ',
    ],
  },
  {
    id: 'external_user',
    name: 'Przedstawiciel podmiotu',
    description: 'Podstawowy dostęp do funkcji komunikacyjnych',
    usersCount: 35,
    permissions: [
      'Przeglądanie sprawozdań',
      'Komunikacja z UKNF',
      'Dostęp do biblioteki',
      'Przeglądanie ogłoszeń',
      'Przeglądanie FAQ',
    ],
  },
];

export function Roles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Role i uprawnienia</h2>
          <p className="text-muted-foreground">
            Zarządzanie rolami użytkowników i ich uprawnieniami
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nowa rola
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>{role.name}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2">
                <Badge variant="secondary">
                  {role.usersCount} użytkowników
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">Uprawnienia:</p>
                <div className="space-y-2">
                  {role.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`${role.id}-${index}`} checked disabled />
                      <label
                        htmlFor={`${role.id}-${index}`}
                        className="text-sm cursor-pointer"
                      >
                        {permission}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
