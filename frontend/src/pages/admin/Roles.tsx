import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Shield, Plus, Edit } from 'lucide-react';
import { useApiData } from '../../shared/hooks/use-api-data';
import { apiClient } from '../../shared/api/api-client';

interface RoleDto {
  id: number;
  roleName: string;
  description?: string | null;
  permissions: string[];
}

export function Roles() {
  const { data } = useApiData<RoleDto[]>(() => apiClient.get('/roles'), []);
  const roles = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Role i uprawnienia</h2>
          <p className="text-muted-foreground">Zarządzanie rolami użytkowników i ich uprawnieniami</p>
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
                    <CardTitle>{role.roleName}</CardTitle>
                    <CardDescription>{role.description || 'Brak opisu roli'}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2">
                <Badge variant="secondary">{role.permissions.length} uprawnień</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">Uprawnienia:</p>
                <div className="space-y-2">
                  {role.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`${role.roleName}-${index}`} checked disabled />
                      <label htmlFor={`${role.roleName}-${index}`} className="text-sm">
                        {permission}
                      </label>
                    </div>
                  ))}
                  {role.permissions.length === 0 && (
                    <p className="text-sm text-muted-foreground">Brak przypisanych uprawnień.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
