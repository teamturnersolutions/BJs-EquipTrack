'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryCard } from '@/components/inventory-card';
import { type InventoryItem } from '@/lib/types';
import { AppHeader } from '@/components/app-header';

type InventoryListProps = {
  items: InventoryItem[];
};

export function InventoryList({ items }: InventoryListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const statusFilter = searchParams.get('status') || 'all';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const filteredItems = items.filter(item => {
    if (statusFilter === 'available') return item.status === 'Available';
    if (statusFilter === 'checked-out') return item.status === 'Checked Out';
    return true;
  });

  return (
    <>
    <AppHeader title="View Inventory" />
    <div className="space-y-6">
      <Tabs value={statusFilter} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="checked-out">Checked Out</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No items match the current filter.</p>
        </div>
      )}
    </div>
    </>
  );
}
