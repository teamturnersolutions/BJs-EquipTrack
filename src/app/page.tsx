import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PackageSearch,
  PackageCheck,
  LayoutGrid,
  ClipboardCheck,
} from 'lucide-react';

const navItems = [
  {
    href: '/checkout',
    icon: <PackageSearch className="size-8 text-primary" />,
    title: 'Check Out Equipment',
    description: 'Assign equipment to a team member.',
  },
  {
    href: '/checkin',
    icon: <PackageCheck className="size-8 text-primary" />,
    title: 'Check In Equipment',
    description: 'Return equipment to the inventory.',
  },
  {
    href: '/inventory',
    icon: <LayoutGrid className="size-8 text-primary" />,
    title: 'View Inventory',
    description: 'Browse all items and their status.',
  },
  {
    href: '/history',
    icon: <HistoryIcon className="size-8 text-primary" />,
    title: 'Transaction History',
    description: 'View a timeline of all inventory actions.',
  },
];

import { History as HistoryIcon } from 'lucide-react';
import { HomeManagementControls } from './_components/home-management-controls';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 relative">
      <HomeManagementControls />

      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
          BJ&apos;s EquipTrack
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Hardware tracking simplified
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href} className="group">
            <Card className="h-full hover:border-primary/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  {item.icon}
                </div>
                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
