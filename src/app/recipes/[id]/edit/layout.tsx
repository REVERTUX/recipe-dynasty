import React from 'react';
import { Card } from '@/components/ui/card';

import '@mdxeditor/editor/style.css';

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <Card className="mx-auto my-10 max-w-5xl rounded-lg p-8">{children}</Card>
  );
}
