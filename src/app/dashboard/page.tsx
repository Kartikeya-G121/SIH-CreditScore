
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/layout/logo';
import BeneficiaryDashboard from '@/components/dashboards/beneficiary-dashboard';
import OfficerDashboard from '@/components/dashboards/officer-dashboard';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Lightbulb,
  UploadCloud,
  Languages,
} from 'lucide-react';
import { UserNav } from '@/components/layout/user-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FloatingChatbotButton } from '@/components/chatbot/floating-chatbot-button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/language-context';

function DashboardSidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const activeTab = searchParams.get('tab') || (user?.role === 'beneficiary' ? 'overview' : 'dashboard');

  const handleNav = (href: string) => {
    if (href.startsWith('#')) {
      const tab = href.substring(1);
      router.push(`/dashboard?tab=${tab}`);
    } else {
       toast({ title: `Navigating to ${href.substring(1)}`});
       // In a real app, you would use: router.push(href);
    }
  };

  const navItems = {
    beneficiary: [
      {
        id: 'overview',
        icon: <LayoutDashboard />,
        label: t('sidebar_overview'),
      },
      {
        id: 'repayments',
        icon: <BarChart3 />,
        label: t('sidebar_repayments'),
      },
       {
        id: 'profile',
        icon: <Users />,
        label: t('sidebar_profile'),
      },
      {
        id: 'advice',
        icon: <Lightbulb />,
        label: t('sidebar_financial_advice'),
      },
      {
        id: 'bill-upload',
        icon: <UploadCloud />,
        label: t('sidebar_bill_upload'),
      },
    ],
    officer: [
      {
        id: 'dashboard',
        icon: <LayoutDashboard />,
        label: t('sidebar_dashboard'),
      },
      {
        id: 'beneficiaries',
        icon: <Users />,
        label: t('sidebar_beneficiaries'),
      },
    ],
  };
  
  const currentNavItems = user ? navItems[user.role] : [];

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {currentNavItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton 
                onClick={() => handleNav(`#${item.id}`)}
                isActive={activeTab === item.id}
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
           <SidebarMenuItem>
             <SidebarMenuButton onClick={() => handleNav('/help')}>
               <HelpCircle />
               <span>{t('sidebar_help')}</span>
             </SidebarMenuButton>
           </SidebarMenuItem>
            <SidebarMenuItem>
             <SidebarMenuButton onClick={() => handleNav('/settings')}>
               <Settings />
               <span>{t('sidebar_settings')}</span>
             </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="my-2" />
         {user && (
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">{user.name}</span>
              <span className="text-xs text-muted-foreground">{t(user.role)}</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function LanguageSwitcher() {
    const { setLanguage } = useLanguage();
    const { toast } = useToast();

    const handleLanguageChange = (lang: 'en' | 'hi' | 'bn' | 'ta') => {
        if (lang === 'en' || lang === 'hi') {
          setLanguage(lang);
          toast({
              title: 'Language Switched',
              description: `Language has been set to ${lang === 'en' ? 'English' : 'Hindi'}.`,
          });
        } else {
           toast({
                title: 'Language Not Available',
                description: 'This language is not yet supported in the prototype.',
                variant: 'destructive'
            });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => handleLanguageChange('en')}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleLanguageChange('hi')}>
                    हिंदी
                </DropdownMenuItem>
                 <DropdownMenuItem onSelect={() => handleLanguageChange('bn')}>
                    বাংলা
                </DropdownMenuItem>
                 <DropdownMenuItem onSelect={() => handleLanguageChange('ta')}>
                    தமிழ்
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function DashboardHeader() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const roleHeadings = {
    beneficiary: "beneficiary_dashboard",
    officer: "officer_dashboard",
  }
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <h1 className="text-xl font-semibold">{user ? t(roleHeadings[user.role]) : 'Dashboard'}</h1>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  );
}


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || (user?.role === 'beneficiary' ? 'overview' : 'dashboard');


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'beneficiary':
        return <BeneficiaryDashboard activeTab={tab} />;
      case 'officer':
        return <OfficerDashboard />;
      default:
        return <div>Invalid Role. Please contact support.</div>;
    }
  };

  return (
    <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
            <DashboardHeader/>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {renderDashboard()}
            </main>
        </SidebarInset>
        <FloatingChatbotButton/>
    </SidebarProvider>
  );
}

    