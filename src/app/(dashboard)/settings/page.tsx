'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  return (
    <PageContainer className="max-w-3xl">
      <PageHeader title="Settings" description="Tabbed settings pattern." />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

function ProfileTab() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    await new Promise((r) => setTimeout(r, 400));
    setPending(false);
    toast.success('Profile saved');
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>How your name appears to teammates.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={pending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" value={user?.email ?? ''} disabled />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : 'Save changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Theme applies immediately and is remembered on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 max-w-xs">
          <Label htmlFor="theme">Theme</Label>
          <Select value={mounted ? theme : undefined} onValueChange={setTheme}>
            <SelectTrigger id="theme" className="w-full">
              <SelectValue placeholder="System" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

const NOTIFICATION_OPTIONS = [
  { id: 'notify-activity', label: 'Activity on items I own' },
  { id: 'notify-weekly', label: 'Weekly summary email' },
  { id: 'notify-security', label: 'Security alerts' },
];

function NotificationsTab() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    'notify-activity': true,
    'notify-weekly': false,
    'notify-security': true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what you want to hear about.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {NOTIFICATION_OPTIONS.map((opt) => (
          <div key={opt.id} className="flex items-center gap-3">
            <Checkbox
              id={opt.id}
              checked={enabled[opt.id] ?? false}
              onCheckedChange={(v) => setEnabled((prev) => ({ ...prev, [opt.id]: v === true }))}
            />
            <Label htmlFor={opt.id} className="font-normal">
              {opt.label}
            </Label>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={() => toast.success('Preferences saved')}>Save preferences</Button>
      </CardFooter>
    </Card>
  );
}
