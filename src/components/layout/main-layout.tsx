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
  Stethoscope,
  FileText,
  Brain,
  AlertTriangle,
  Pill,
  Zap,
  Activity,
  PanelLeftClose,
  PanelRightClose,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleTrigger } from '../ui/collapsible';
import Footer from './footer';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/login', label: 'Login', icon: LayoutDashboard },
  { href: '/emergency', label: 'Emergency', icon: AlertTriangle },
  { href: '/booking', label: 'Booking', icon: CalendarPlus },
  { href: '/telehealth', label: 'Telehealth', icon: Video },
  { href: '/health-tracker', label: 'Health Tracker', icon: HeartPulse },
  { href: '/dietician', label: 'AI Dietician', icon: Salad },
  { href: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
  { href: '/lab-results', label: 'Lab Results', icon: FileText },
  { href: '/pharmacy', label: 'Pharmacy', icon: Pill },
  { href: '/radiology', label: 'Radiology', icon: Zap },
  { href: '/surgery', label: 'Surgery', icon: Activity },
  { href: '/mental-health', label: 'Mental Health', icon: Brain },
  { href: '/profile', label: 'My Profile', icon: LayoutDashboard },
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
        <div className="flex-1 flex flex-col">
          <main className="flex-grow min-h-screen">{children}</main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
