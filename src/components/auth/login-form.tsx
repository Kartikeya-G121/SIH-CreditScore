'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { MOCK_USERS } from '@/lib/data';
import { useLanguage } from '@/contexts/language-context';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const success = await login(email);

    if (success) {
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email. Please try again with a mock user email.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Select a Profile to Login</Label>
        <Select onValueChange={setEmail} value={email}>
          <SelectTrigger>
            <SelectValue placeholder="Select a user to log in" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_USERS.map((user) => (
              <SelectItem key={user.id} value={user.email}>
                {user.name} ({t(user.role)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !email}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t('login')}
      </Button>
      <Button variant="outline" className="w-full" type="button">
        {t('login_with_google')}
      </Button>
    </form>
  );
}
