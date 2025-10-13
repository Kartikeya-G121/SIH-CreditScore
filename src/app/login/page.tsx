
'use client';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/layout/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';

export default function LoginPage() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className='flex justify-center mb-4'>
           <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">{t('welcome_back')}</CardTitle>
          <CardDescription>
            {t('login_prompt')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            {t('no_account')}{' '}
            <Link href="/register" className="underline">
              {t('sign_up')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
