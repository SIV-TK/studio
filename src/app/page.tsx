import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarPlus, Video, HeartPulse, Salad } from 'lucide-react';
import Link from 'next/link';
import { AnalyticsDashboard } from '@/components/pages/analytics-dashboard';

const features = [
  {
    icon: <CalendarPlus className="h-10 w-10 text-accent-foreground" />,
    title: 'Online Booking',
    description: 'Schedule appointments with specialists hassle-free.',
    href: '/booking',
    cta: 'Book Now',
  },
  {
    icon: <Video className="h-10 w-10 text-accent-foreground" />,
    title: 'Telehealth Platform',
    description: 'Consult with our experts from the comfort of your home.',
    href: '/telehealth',
    cta: 'Consult Online',
  },
  {
    icon: <HeartPulse className="h-10 w-10 text-accent-foreground" />,
    title: 'Health Tracker',
    description:
      'Integrate your health data for personalized insights and advice.',
    href: '/health-tracker',
    cta: 'Get Insights',
  },
  {
    icon: <Salad className="h-10 w-10 text-accent-foreground" />,
    title: 'AI-Powered Dietician',
    description: 'Receive personalized meal plans and nutritional guidance.',
    href: '/dietician',
    cta: 'Find Meals',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground">
          Welcome to MediAssist AI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Your personal AI-powered health assistant, dedicated to providing
          personalized medical services and proactive care.
        </p>
      </div>

      <AnalyticsDashboard />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl mt-12">
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
