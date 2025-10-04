import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth';
import { entities } from '../lib/mock-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import {
  Home,
  FileText,
  MessageSquare,
  Briefcase,
  FolderOpen,
  Megaphone,
  HelpCircle,
  Building2,
  Users,
  Settings,
  LogOut,
  Bell,
  User,
  Menu,
  X,
} from 'lucide-react';

export function Layout() {
  const { user, logout, currentEntity, switchEntity } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsCount] = useState(3);

  const navigation = [
    { name: 'Pulpit główny', href: '/', icon: Home },
    {
      name: 'Komunikacja',
      icon: MessageSquare,
      children: [
        { name: 'Sprawozdania', href: '/reports' },
        { name: 'Wiadomości', href: '/messages' },
        { name: 'Sprawy', href: '/cases' },
        { name: 'Biblioteka', href: '/library' },
        { name: 'Tablica ogłoszeń', href: '/announcements' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Kartoteka podmiotów', href: '/entities' },
      ],
    },
    {
      name: 'Administracja',
      icon: Settings,
      children: [
        { name: 'Użytkownicy', href: '/admin/users' },
        { name: 'Wnioski o dostęp', href: '/admin/requests' },
        { name: 'Role i uprawnienia', href: '/admin/roles' },
        { name: 'Polityka haseł', href: '/admin/password-policy' },
      ],
    },
  ];

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs = [{ name: 'Pulpit główny', href: '/' }];

    if (segments.length > 0) {
      if (segments[0] === 'reports') breadcrumbs.push({ name: 'Sprawozdania', href: '/reports' });
      if (segments[0] === 'messages') breadcrumbs.push({ name: 'Wiadomości', href: '/messages' });
      if (segments[0] === 'cases') breadcrumbs.push({ name: 'Sprawy', href: '/cases' });
      if (segments[0] === 'library') breadcrumbs.push({ name: 'Biblioteka', href: '/library' });
      if (segments[0] === 'announcements') breadcrumbs.push({ name: 'Tablica ogłoszeń', href: '/announcements' });
      if (segments[0] === 'faq') breadcrumbs.push({ name: 'FAQ', href: '/faq' });
      if (segments[0] === 'entities') breadcrumbs.push({ name: 'Kartoteka podmiotów', href: '/entities' });
      if (segments[0] === 'admin') {
        breadcrumbs.push({ name: 'Administracja', href: '/admin/users' });
        if (segments[1] === 'users') breadcrumbs.push({ name: 'Użytkownicy', href: '/admin/users' });
        if (segments[1] === 'requests') breadcrumbs.push({ name: 'Wnioski o dostęp', href: '/admin/requests' });
        if (segments[1] === 'roles') breadcrumbs.push({ name: 'Role i uprawnienia', href: '/admin/roles' });
        if (segments[1] === 'password-policy') breadcrumbs.push({ name: 'Polityka haseł', href: '/admin/password-policy' });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-sm">Platforma Komunikacyjna UKNF</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === 'external_admin' || user?.role === 'external_user' ? (
            <Select
              value={currentEntity?.id || ''}
              onValueChange={switchEntity}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Wybierz podmiot" />
              </SelectTrigger>
              <SelectContent>
                {entities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationsCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              >
                {notificationsCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.role === 'admin' && 'Administrator'}
                    {user?.role === 'internal' && 'Pracownik UKNF'}
                    {user?.role === 'external_admin' && 'Administrator podmiotu'}
                    {user?.role === 'external_user' && 'Przedstawiciel podmiotu'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Ustawienia
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Wyloguj
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Wyloguj
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 border-r bg-card overflow-y-auto">
            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                              location.pathname === child.href
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent'
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href!}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        location.pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.href}>{crumb.name}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
