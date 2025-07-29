'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import {
  LayoutDashboard,
  CalendarPlus,
  Video,
  HeartPulse,
  Salad,
  PanelLeftClose,
  PanelRightClose,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Collapsible } from '../ui/collapsible';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/booking', label: 'Booking', icon: CalendarPlus },
  { href: '/telehealth', label: 'Telehealth', icon: Video },
  { href: '/health-tracker', label: 'Health Tracker', icon: HeartPulse },
  { href: '/dietician', label: 'AI Dietician', icon: Salad },
];

function SidebarToggleButton() {
  const { state, setState } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setState(state === 'open' ? 'closed' : 'open')}
    >
      {state === 'open' ? <PanelLeftClose /> : <PanelRightClose />}
    </Button>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Logo className="w-8 h-8" />
                <span className="font-headline text-xl font-bold">
                  MediAssist AI
                </span>
              </div>
              <SidebarToggleButton />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Collapsible asChild>
                    <Link href={item.href} passHref>
                      <SidebarMenuButton
                        isActive={pathname === item.href}
                        tooltip={{ children: item.label, side: 'right' }}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
