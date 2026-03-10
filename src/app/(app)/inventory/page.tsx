import { getInventoryItems } from '@/lib/data';
import { InventoryList } from './_components/inventory-list';
import { Suspense } from 'react';

export const metadata = {
  title: "Inventory | BJ's EquipTrack",
};

function InventorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
      <div className="h-10 w-72 bg-muted rounded-md animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default async function InventoryPage() {
  const items = await getInventoryItems();

  return (
    <Suspense fallback={<InventorySkeleton />}>
      <InventoryList items={items} />
    </Suspense>
  );
}
