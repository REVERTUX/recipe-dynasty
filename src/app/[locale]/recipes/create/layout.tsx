import React from 'react';
import { Card } from '@/components/ui/card';

import '@mdxeditor/editor/style.css';

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <Card className="mx-auto my-4 max-w-5xl rounded-lg md:my-10 md:p-8">
      {children}
    </Card>
  );
}
