import { getInventoryItems } from '@/lib/data';
import { AuditClient } from './_components/audit-client';
import { Suspense } from 'react';

export const metadata = {
  title: "Perform Audit | BJ's EquipTrack",
};

function AuditSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
      <div className="h-[500px] bg-muted rounded-md animate-pulse" />
    </div>
  )
}

export default async function AuditPage() {
  const items = await getInventoryItems();

  return (
    <Suspense fallback={<AuditSkeleton />}>
      <AuditClient items={items} />
    </Suspense>
  );
}
