import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Save } from 'lucide-react';

export function PasswordPolicy() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Polityka haseł</h2>
          <p className="text-muted-foreground">
            Konfiguracja wymagań bezpieczeństwa dla haseł użytkowników
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Wymagania dotyczące haseł</CardTitle>
            <CardDescription>
              Ustaw minimalne wymagania dla haseł użytkowników
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="min-length">Minimalna długość hasła</Label>
              <Input
                id="min-length"
                type="number"
                defaultValue={8}
                min={6}
                max={32}
              />
              <p className="text-xs text-muted-foreground">
                Hasło musi zawierać co najmniej tę liczbę znaków (6-32)
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-uppercase">Wymagaj wielkich liter</Label>
                <p className="text-xs text-muted-foreground">
                  Hasło musi zawierać co najmniej jedną wielką literę (A-Z)
                </p>
              </div>
              <Switch id="require-uppercase" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-lowercase">Wymagaj małych liter</Label>
                <p className="text-xs text-muted-foreground">
                  Hasło musi zawierać co najmniej jedną małą literę (a-z)
                </p>
              </div>
              <Switch id="require-lowercase" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-numbers">Wymagaj cyfr</Label>
                <p className="text-xs text-muted-foreground">
                  Hasło musi zawierać co najmniej jedną cyfrę (0-9)
                </p>
              </div>
              <Switch id="require-numbers" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-special">Wymagaj znaków specjalnych</Label>
                <p className="text-xs text-muted-foreground">
                  Hasło musi zawierać co najmniej jeden znak specjalny (!@#$%^&*)
                </p>
              </div>
              <Switch id="require-special" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wygasanie haseł</CardTitle>
            <CardDescription>
              Zarządzaj okresem ważności haseł
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="password-expiry">Włącz wygasanie haseł</Label>
                <p className="text-xs text-muted-foreground">
                  Hasła będą wymagały regularnej zmiany
                </p>
              </div>
              <Switch id="password-expiry" defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry-days">Okres ważności hasła (dni)</Label>
              <Input
                id="expiry-days"
                type="number"
                defaultValue={90}
                min={30}
                max={365}
              />
              <p className="text-xs text-muted-foreground">
                Użytkownicy będą musieli zmienić hasło po tym okresie
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warning-days">Ostrzeżenie przed wygaśnięciem (dni)</Label>
              <Input
                id="warning-days"
                type="number"
                defaultValue={7}
                min={1}
                max={30}
              />
              <p className="text-xs text-muted-foreground">
                Ile dni przed wygaśnięciem użytkownik otrzyma ostrzeżenie
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historia haseł</CardTitle>
            <CardDescription>
              Zapobiegaj ponownemu użyciu starych haseł
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="password-history">Włącz historię haseł</Label>
                <p className="text-xs text-muted-foreground">
                  Zapobiegaj ponownemu użyciu ostatnich haseł
                </p>
              </div>
              <Switch id="password-history" defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="history-count">Liczba pamiętanych haseł</Label>
              <Input
                id="history-count"
                type="number"
                defaultValue={5}
                min={1}
                max={24}
              />
              <p className="text-xs text-muted-foreground">
                System zapamięta ostatnie N haseł
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blokada konta</CardTitle>
            <CardDescription>
              Zabezpieczenie przed atakami brute-force
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="account-lockout">Włącz blokadę konta</Label>
                <p className="text-xs text-muted-foreground">
                  Konto zostanie zablokowane po nieudanych próbach logowania
                </p>
              </div>
              <Switch id="account-lockout" defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-attempts">Maksymalna liczba prób</Label>
              <Input
                id="max-attempts"
                type="number"
                defaultValue={5}
                min={3}
                max={10}
              />
              <p className="text-xs text-muted-foreground">
                Liczba nieudanych prób logowania przed blokadą
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockout-duration">Czas blokady (minuty)</Label>
              <Input
                id="lockout-duration"
                type="number"
                defaultValue={30}
                min={5}
                max={1440}
              />
              <p className="text-xs text-muted-foreground">
                Konto zostanie automatycznie odblokowane po tym czasie
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Anuluj</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Zapisz ustawienia
          </Button>
        </div>
      </div>
    </div>
  );
}
