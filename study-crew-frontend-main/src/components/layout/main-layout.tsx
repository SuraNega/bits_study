import { ReactNode } from 'react';
import { Navbar } from './navbar';

interface MainLayoutProps {
  children: ReactNode;
}


export function MainLayout({ children }: MainLayoutProps) {


  return (
    <div className="min-h-screen bg-background w-full">
      <Navbar />
      
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
