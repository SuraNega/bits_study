import { ReactNode } from 'react';
import { Navbar } from './navbar';

interface MainLayoutProps {
  children: ReactNode;
}


export function MainLayout({ children }: MainLayoutProps) {


  return (
    <div className="min-h-screen bg-background w-full">
      <Navbar />
      
      <main className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
