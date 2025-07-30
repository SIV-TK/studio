import { BookingSessionsView } from '@/components/pages/booking-sessions-view';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function BookingSessionsPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-blue-600">
            My Booking Sessions
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
            View and manage your scheduled appointments and consultations.
          </p>
        </div>
        <BookingSessionsView />
      </div>
    </AuthGuard>
  );
}