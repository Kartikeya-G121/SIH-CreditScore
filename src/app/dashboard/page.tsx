'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import AdminDashboard from '@/components/dashboards/admin-dashboard';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { UserNav } from '@/components/layout/user-nav';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FloatingChatbotButton } from '../chatbot/floating-chatbot-button';
import { Separator } from '../ui/separator';

function DashboardSidebar() {
  const { user } = useAuth();

  const navItems = {
    beneficiary: [
      {
        href: '#',
        icon: <LayoutDashboard />,
        label: 'Overview',
      },
      {
        href: '#',
        icon: <BarChart3 />,
        label: 'My Score',
      },
    ],
    officer: [
      {
        href: '#',
        icon: <LayoutDashboard />,
        label: 'Dashboard',
      },
      {
        href: '#',
        icon: <Users />,
        label: 'Beneficiaries',
      },
    ],
    admin: [
      {
        href: '#',
        icon: <LayoutDashboard />,
        label: 'Analytics',
      },
      {
        href: '#',
        icon: <Users />,
        label: 'User Management',
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
          {currentNavItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton href={item.href} isActive={index === 0}>
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
             <SidebarMenuButton href="#">
               <HelpCircle />
               <span>Help</span>
             </SidebarMenuButton>
           </SidebarMenuItem>
            <SidebarMenuItem>
             <SidebarMenuButton href="#">
               <Settings />
               <span>Settings</span>
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
              <span className="text-xs text-muted-foreground">{user.role}</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function DashboardHeader() {
  const { user } = useAuth();
  const roleHeadings = {
    beneficiary: "Beneficiary Dashboard",
    officer: "Officer Dashboard",
    admin: "Admin Analytics"
  }
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <h1 className="text-xl font-semibold">{user ? roleHeadings[user.role] : 'Dashboard'}</h1>
      <UserNav />
    </header>
  );
}


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
        return <BeneficiaryDashboard />;
      case 'officer':
        return <OfficerDashboard />;
      case 'admin':
        return <AdminDashboard />;
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
