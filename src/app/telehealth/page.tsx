import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const doctors = [
  {
    name: 'Dr. Evelyn Reed',
    specialty: 'Cardiology',
    avatar: 'https://placehold.co/128x128.png',
    dataAiHint: 'doctor portrait',
    status: 'online',
  },
  {
    name: 'Dr. Samuel Chen',
    specialty: 'Neurology',
    avatar: 'https://placehold.co/128x128.png',
    dataAiHint: 'doctor portrait',
    status: 'online',
  },
  {
    name: 'Dr. Anika Sharma',
    specialty: 'Pediatrics',
    avatar: 'https://placehold.co/128x128.png',
    dataAiHint: 'doctor portrait',
    status: 'offline',
  },
  {
    name: 'Dr. Marcus Thorne',
    specialty: 'Orthopedics',
    avatar: 'https://placehold.co/128x128.png',
    dataAiHint: 'doctor portrait',
    status: 'online',
  },
];

export default function TelehealthPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Virtual Consultations
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Connect with our world-class specialists from anywhere.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {doctors.map((doctor) => (
          <Card key={doctor.name} className="flex flex-col text-center">
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage asChild src={doctor.avatar}>
                   <Image
                     src={doctor.avatar}
                     alt={`Portrait of ${doctor.name}`}
                     width={128}
                     height={128}
                     data-ai-hint={doctor.dataAiHint}
                   />
                </AvatarImage>
                <AvatarFallback>
                  {doctor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-2xl">
                {doctor.name}
              </CardTitle>
              <CardDescription className="text-base">
                {doctor.specialty}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Badge
                variant={doctor.status === 'online' ? 'default' : 'secondary'}
              >
                {doctor.status === 'online' ? 'Available Now' : 'Offline'}
              </Badge>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={doctor.status !== 'online'}
              >
                Start Consultation
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
