import Navigation from './navigation';
import Footer from './footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-grow w-full">
        <div className="min-h-full">
          {children}
        </div>
      </main>
      {/* Footer is only included on the homepage */}
    </div>
  );
}

export { MainLayout };
