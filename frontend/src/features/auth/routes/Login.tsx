import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Building2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import { useAuth } from '..';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      toast.success('Zalogowano pomyślnie');
      navigate('/');
    } catch (caughtError: unknown) {
      const message = caughtError instanceof Error ? caughtError.message : 'Nieprawidłowy login lub hasło';
      setError(message);
      toast.error(message);
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
          <CardTitle>Platforma Komunikacyjna UKNF</CardTitle>
          <CardDescription>
            Zaloguj się do systemu komunikacji z podmiotami nadzorowanymi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Login / Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="kowalski"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate('/register')}
              >
                Zarejestruj się
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              Demo - Login: <strong>kowalski</strong>, Hasło: <strong>kowalski</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
