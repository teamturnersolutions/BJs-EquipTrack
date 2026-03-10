'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app-header';
import { type InventoryItem } from '@/lib/types';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';

type AuditClientProps = {
  items: InventoryItem[];
};

type AuditResult = {
  missingItems: InventoryItem[];
  presentCount: number;
  totalCount: number;
};

export function AuditClient({ items }: AuditClientProps) {
  const { toast } = useToast();
  const [presentItems, setPresentItems] = useState<Set<string>>(new Set());
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    setPresentItems((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleCompleteAudit = () => {
    const missingItems = items.filter((item) => !presentItems.has(item.id));
    setAuditResult({
      missingItems,
      presentCount: presentItems.size,
      totalCount: items.length,
    });
    toast({
      title: 'Audit Complete',
      description: 'Review the summary below.',
    });
  };

  const handleEmailReport = () => {
    toast({
        title: "Report Sent (Simulation)",
        description: "The audit summary has been sent via email.",
    });
  };

  if (auditResult) {
    return (
      <>
        <AppHeader title="Audit Summary" />
        <Card>
          <CardHeader>
            <CardTitle>Audit Results</CardTitle>
            <CardDescription>
              {auditResult.presentCount} of {auditResult.totalCount} items accounted for.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {auditResult.missingItems.length > 0 ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Discrepancies Found</AlertTitle>
                <AlertDescription>
                  The following {auditResult.missingItems.length} items were not marked as present:
                  <ul className="mt-2 list-disc pl-5">
                    {auditResult.missingItems.map((item) => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>No Discrepancies</AlertTitle>
                <AlertDescription>
                  All inventory items have been accounted for. Great job!
                </AlertDescription>
              </Alert>
            )}
            <Separator />
            <div className="flex gap-2">
                <Button onClick={() => setAuditResult(null)}>Start New Audit</Button>
                <Button variant="secondary" onClick={handleEmailReport}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Report
                </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Perform Audit" />
      <Card>
        <CardHeader>
          <CardTitle>Inventory Stock Take</CardTitle>
          <CardDescription>
            Check the box for each item that is physically present.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 rounded-md border p-4"
              >
                <Checkbox
                  id={item.id}
                  onCheckedChange={(checked) => handleCheckboxChange(item.id, !!checked)}
                  checked={presentItems.has(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                >
                  {item.name}
                </label>
              </div>
            ))}
          </div>
          <Button onClick={handleCompleteAudit}>Complete Audit</Button>
        </CardContent>
      </Card>
    </>
  );
}
