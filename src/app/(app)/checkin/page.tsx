import { getCheckedOutInventoryItems } from '@/lib/data';
import { CheckinClientPage } from './_components/checkin-client-page';
import { Suspense } from 'react';

export const metadata = {
  title: "Check In Equipment | BJ's EquipTrack",
};

function CheckinSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
      <div className="h-24 bg-muted rounded-md animate-pulse" />
      <div className="h-64 bg-muted rounded-md animate-pulse" />
    </div>
  )
}

export default async function CheckinPage() {
  const checkedOutItems = await getCheckedOutInventoryItems();

  return (
    <Suspense fallback={<CheckinSkeleton />}>
      <CheckinClientPage items={checkedOutItems} />
    </Suspense>
  );
}
