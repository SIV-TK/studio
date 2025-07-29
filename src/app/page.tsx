import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarPlus, Video, HeartPulse, Salad, Stethoscope, FileText, Brain, AlertTriangle, Pill, Zap, Activity } from 'lucide-react';
import Link from 'next/link';
import { AnalyticsDashboard } from '@/components/pages/analytics-dashboard';
import { DataDashboard } from '@/components/pages/data-dashboard';

const features = [
  {
    icon: <AlertTriangle className="h-10 w-10 text-red-500" />,
    title: 'AI Emergency Department',
    description: '24/7 emergency triage and immediate care guidance.',
    href: '/emergency',
    cta: 'Emergency Care',
  },
  {
    icon: <Activity className="h-10 w-10 text-blue-500" />,
    title: 'AI Surgery Planning',
    description: 'Pre-operative planning and post-operative care guidance.',
    href: '/surgery',
    cta: 'Surgery Planning',
  },
  {
    icon: <Pill className="h-10 w-10 text-green-500" />,
    title: 'AI Pharmacy Services',
    description: 'Drug interaction checking and medication management.',
    href: '/pharmacy',
    cta: 'Pharmacy',
  },
  {
    icon: <Zap className="h-10 w-10 text-yellow-500" />,
    title: 'AI Radiology',
    description: 'Medical imaging analysis and diagnostic support.',
    href: '/radiology',
    cta: 'Radiology',
  },
  {
    icon: <Video className="h-10 w-10 text-purple-500" />,
    title: 'Telehealth Platform',
    description: 'Virtual consultations with AI-powered diagnostics.',
    href: '/telehealth',
    cta: 'Consult Online',
  },
  {
    icon: <Stethoscope className="h-10 w-10 text-indigo-500" />,
    title: 'AI Symptom Checker',
    description: 'Research-enhanced symptom analysis and diagnosis.',
    href: '/symptom-checker',
    cta: 'Check Symptoms',
  },
  {
    icon: <FileText className="h-10 w-10 text-teal-500" />,
    title: 'Lab Results Analyzer',
    description: 'Comprehensive lab analysis with personalized recommendations.',
    href: '/lab-results',
    cta: 'Analyze Results',
  },
  {
    icon: <Brain className="h-10 w-10 text-pink-500" />,
    title: 'Mental Health Services',
    description: 'AI-powered mental health support and therapy guidance.',
    href: '/mental-health',
    cta: 'Mental Health',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground">
          AI-Powered Digital Hospital
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Complete hospital services powered by AI - Emergency care, Surgery planning, Pharmacy, Radiology, and comprehensive medical services online.
        </p>
      </div>

      <DataDashboard />
      
      <AnalyticsDashboard />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-7xl mt-12">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title} className="group">
            <Card className="h-full flex flex-col hover:border-accent hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="p-4 bg-accent rounded-full mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-2xl">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div className="text-center text-accent-foreground group-hover:underline font-bold">
                  {feature.cta} &rarr;
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
