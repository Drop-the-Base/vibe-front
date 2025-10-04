import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Save } from 'lucide-react';
import { useApiData } from '../../shared/hooks/use-api-data';
import { apiClient } from '../../shared/api/api-client';

interface PasswordPolicyDto {
  id: number;
  minimumLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecial: boolean;
  expireAfterDays: number;
  historySize: number;
}

export function PasswordPolicy() {
  const { data } = useApiData<PasswordPolicyDto>(() => apiClient.get('/password-policy'), []);
  const [policy, setPolicy] = useState<PasswordPolicyDto | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setPolicy(data);
    }
  }, [data]);

  const updateField = <K extends keyof PasswordPolicyDto>(field: K, value: PasswordPolicyDto[K]) => {
    setPolicy((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!policy) return;
    setSaving(true);
    try {
      await apiClient.put('/password-policy', {
        minimumLength: policy.minimumLength,
        requireUppercase: policy.requireUppercase,
        requireLowercase: policy.requireLowercase,
        requireDigit: policy.requireDigit,
        requireSpecial: policy.requireSpecial,
        expireAfterDays: policy.expireAfterDays,
        historySize: policy.historySize,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!policy) {
    return <p>Ładowanie konfiguracji polityki haseł...</p>;
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <h2>Polityka haseł</h2>
          <p className="text-muted-foreground">Konfiguracja wymagań bezpieczeństwa dla haseł użytkowników</p>
        </div>
        <Button type="submit" disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          Zapisz zmiany
        </Button>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Wymagania dotyczące haseł</CardTitle>
            <CardDescription>Ustaw minimalne wymagania dla haseł użytkowników</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="min-length">Minimalna długość hasła</Label>
              <Input
                id="min-length"
                type="number"
                value={policy.minimumLength}
                min={6}
                max={32}
                onChange={(event) => updateField('minimumLength', Number(event.target.value))}
              />
              <p className="text-xs text-muted-foreground">Hasło musi zawierać co najmniej tę liczbę znaków (6-32)</p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-uppercase">Wymagaj wielkich liter</Label>
                <p className="text-xs text-muted-foreground">Hasło musi zawierać co najmniej jedną wielką literę (A-Z)</p>
              </div>
              <Switch
                id="require-uppercase"
                checked={policy.requireUppercase}
                onCheckedChange={(value) => updateField('requireUppercase', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-lowercase">Wymagaj małych liter</Label>
                <p className="text-xs text-muted-foreground">Hasło musi zawierać co najmniej jedną małą literę (a-z)</p>
              </div>
              <Switch
                id="require-lowercase"
                checked={policy.requireLowercase}
                onCheckedChange={(value) => updateField('requireLowercase', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-numbers">Wymagaj cyfr</Label>
                <p className="text-xs text-muted-foreground">Hasło musi zawierać co najmniej jedną cyfrę (0-9)</p>
              </div>
              <Switch
                id="require-numbers"
                checked={policy.requireDigit}
                onCheckedChange={(value) => updateField('requireDigit', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-special">Wymagaj znaków specjalnych</Label>
                <p className="text-xs text-muted-foreground">Hasło musi zawierać co najmniej jeden znak specjalny (!@#$%^&*)</p>
              </div>
              <Switch
                id="require-special"
                checked={policy.requireSpecial}
                onCheckedChange={(value) => updateField('requireSpecial', value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wygasanie haseł</CardTitle>
            <CardDescription>Zarządzaj okresem ważności haseł</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="expiry-days">Okres ważności hasła (dni)</Label>
              <Input
                id="expiry-days"
                type="number"
                value={policy.expireAfterDays}
                min={0}
                max={365}
                onChange={(event) => updateField('expireAfterDays', Number(event.target.value))}
              />
              <p className="text-xs text-muted-foreground">Użytkownicy będą musieli zmienić hasło po tym okresie</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historia haseł</CardTitle>
            <CardDescription>Zapobiegaj ponownemu użyciu starych haseł</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="history-count">Liczba pamiętanych haseł</Label>
              <Input
                id="history-count"
                type="number"
                value={policy.historySize}
                min={0}
                max={24}
                onChange={(event) => updateField('historySize', Number(event.target.value))}
              />
              <p className="text-xs text-muted-foreground">System zapamięta ostatnie N haseł</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
