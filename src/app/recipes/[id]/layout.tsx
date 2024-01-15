import React from 'react';

import '@mdxeditor/editor/style.css';

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return <div className="m-auto w-full max-w-5xl px-2 pt-1">{children}</div>;
}
