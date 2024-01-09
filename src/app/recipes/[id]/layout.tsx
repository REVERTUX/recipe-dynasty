import React from 'react';

import '@mdxeditor/editor/style.css';

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return <div className="flex min-h-screen justify-center">{children}</div>;
}
