'use client';

import Link from 'next/link';
import { ChevronLeft, UserPlus, PackagePlus, History as HistoryIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddMemberSheet, AddItemSheet } from '@/app/_components/management-sheets';

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to Home</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => document.getElementById('add-member-trigger')?.click()}
          title="Add Team Member"
        >
          <UserPlus className="h-5 w-5 text-primary" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => document.getElementById('add-item-trigger')?.click()}
          title="Add Inventory Item"
        >
          <PackagePlus className="h-5 w-5 text-primary" />
        </Button>
        <Button asChild variant="ghost" size="icon" title="View History">
          <Link href="/history">
            <HistoryIcon className="h-5 w-5 text-primary" />
          </Link>
        </Button>
        <AddMemberSheet />
        <AddItemSheet />
      </div>
    </header>
  );
}
