import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-2 px-3 py-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
