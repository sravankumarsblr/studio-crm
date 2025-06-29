
"use client";

import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";

type HeaderProps = {
  title: string;
  actionText?: string;
  onActionClick?: () => void;
  children?: React.ReactNode;
};

export function Header({ title, actionText, onActionClick, children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 sm:p-6 border-b bg-card">
      <h1 className="text-2xl font-headline font-bold text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
        {actionText && onActionClick && (
          <Button onClick={onActionClick}>{actionText}</Button>
        )}
        <UserNav />
      </div>
    </header>
  );
}

    