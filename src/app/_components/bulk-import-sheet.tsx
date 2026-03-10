'use client';

import * as React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { bulkAddTeamMembers, bulkAddInventoryItems } from '@/app/actions';
import { FileUp, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function BulkImportSheet() {
    const [open, setOpen] = React.useState(false);
    const [isPending, setIsPending] = React.useState(false);
    const [memberCsv, setMemberCsv] = React.useState('');
    const [itemCsv, setItemCsv] = React.useState('');
    const { toast } = useToast();

    function parseCsv(csv: string) {
        const lines = csv.trim().split(/\r?\n/);
        if (lines.length === 0) return [];

        // Check if first line is a header by looking for common keywords
        const firstLine = lines[0].toLowerCase();
        const hasHeader = firstLine.includes('name') || firstLine.includes('id') || firstLine.includes('status');

        const dataLines = hasHeader ? lines.slice(1) : lines;

        return dataLines.map(line => {
            const parts = line.split(',').map(p => p.trim());
            return parts;
        }).filter(parts => parts.length > 0 && parts[0] !== '');
    }

    async function handleMemberImport() {
        if (!memberCsv.trim()) return;
        setIsPending(true);
        const rows = parseCsv(memberCsv);
        const members = rows.map(r => ({ name: r[0] || r[1] })); // Try first or second col

        const result = await bulkAddTeamMembers(members);
        setIsPending(false);

        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setMemberCsv('');
            setOpen(false);
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    }

    async function handleItemImport() {
        if (!itemCsv.trim()) return;
        setIsPending(true);
        const rows = parseCsv(itemCsv);
        // Simple heuristic: if 2+ columns, assume name is second if first is id, else first.
        const items = rows.map(r => ({
            name: r.length > 1 && r[0].includes('-') ? r[1] : r[0],
            status: 'Available'
        }));

        const result = await bulkAddInventoryItems(items);
        setIsPending(false);

        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setItemCsv('');
            setOpen(false);
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="hidden" id="bulk-import-trigger" />
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Bulk Data Import</SheetTitle>
                    <SheetDescription>
                        Paste CSV data to quickly add multiple records. Existing records (by name) will be skipped.
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="items" className="mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="items">Inventory Items</TabsTrigger>
                        <TabsTrigger value="members">Team Members</TabsTrigger>
                    </TabsList>

                    <TabsContent value="items" className="space-y-4 pt-4">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Format Note</AlertTitle>
                            <AlertDescription>
                                Paste lines like: `Item Name` or `ID, Item Name`. One per line.
                            </AlertDescription>
                        </Alert>
                        <Textarea
                            placeholder="RF# 01&#10;RF# 02&#10;iPad# 01"
                            className="min-h-[200px] font-mono text-xs"
                            value={itemCsv}
                            onChange={(e) => setItemCsv(e.target.value)}
                        />
                        <Button
                            className="w-full"
                            disabled={isPending || !itemCsv.trim()}
                            onClick={handleItemImport}
                        >
                            {isPending ? 'Importing...' : 'Import Items'}
                        </Button>
                    </TabsContent>

                    <TabsContent value="members" className="space-y-4 pt-4">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Format Note</AlertTitle>
                            <AlertDescription>
                                Paste lines like: `Full Name` or `ID, Full Name`. One per line.
                            </AlertDescription>
                        </Alert>
                        <Textarea
                            placeholder="James Turner&#10;Jospeh Hay&#10;Roberto Coldutty"
                            className="min-h-[200px] font-mono text-xs"
                            value={memberCsv}
                            onChange={(e) => setMemberCsv(e.target.value)}
                        />
                        <Button
                            className="w-full"
                            disabled={isPending || !memberCsv.trim()}
                            onClick={handleMemberImport}
                        >
                            {isPending ? 'Importing...' : 'Import Members'}
                        </Button>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
