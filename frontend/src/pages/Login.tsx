import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Building2 } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Platforma Komunikacyjna UKNF</CardTitle>
          <CardDescription>
            Zaloguj się do systemu komunikacji z podmiotami nadzorowanymi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adres email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jan.kowalski@uknf.gov.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Button variant="link" className="text-sm">
              Zapomniałeś hasła?
            </Button>
            <div className="text-sm text-muted-foreground">
              Nie masz konta?{' '}
              <Button variant="link" className="p-0 h-auto" asChild>
                <a href="/register">Zarejestruj się</a>
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              Demo - użyj dowolnego adresu email i hasła aby się zalogować
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
