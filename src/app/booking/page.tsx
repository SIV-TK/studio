import { BookingForm } from '@/components/pages/booking-form';
import { MainLayout } from '@/components/layout/main-layout';

export default function BookingPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            Book an Appointment
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Fill out the form below to schedule your visit.
          </p>
        </div>
        <BookingForm />
      </div>
    </MainLayout>
  );
}
