import { getTeamMembers, getAvailableInventoryItems } from '@/lib/data';
import { CheckoutForm } from './_components/checkout-form';
import { Suspense } from 'react';

export const metadata = {
  title: "Check Out Equipment | BJ's EquipTrack",
};

function CheckoutSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
      <div className="h-40 bg-muted rounded-md animate-pulse" />
      <div className="h-64 bg-muted rounded-md animate-pulse" />
    </div>
  )
}

export default async function CheckoutPage() {
  const teamMembers = await getTeamMembers();
  const availableItems = await getAvailableInventoryItems();

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutForm teamMembers={teamMembers} availableItems={availableItems} />
    </Suspense>
  );
}
