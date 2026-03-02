export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import {
    ArrowUpLeft,
    ArrowDownRight,
    History as HistoryIcon,
    Package,
    User
} from 'lucide-react';

export default async function HistoryPage() {
    const logs = await prisma.inventoryLog.findMany({
        orderBy: {
            timestamp: 'desc',
        },
        take: 100, // Show last 100 actions
    });

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <AppHeader title="Transaction History" />

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <HistoryIcon className="size-5 text-primary" />
                        <CardTitle>Recent Activity</CardTitle>
                    </div>
                    <CardDescription>
                        Last 100 checkout and check-in actions recorded in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase border-b">
                                <tr>
                                    <th className="px-4 py-3">Action</th>
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3">Team Member</th>
                                    <th className="px-4 py-3">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {log.action === 'CHECKOUT' ? (
                                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase">
                                                            <ArrowUpLeft className="size-3" />
                                                            Checked Out
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase">
                                                            <ArrowDownRight className="size-3" />
                                                            Checked In
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Package className="size-4 text-muted-foreground" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{log.itemName}</span>
                                                        <span className="text-[10px] text-muted-foreground">ID: {log.itemId}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="size-4 text-muted-foreground" />
                                                    <span>{log.teamMemberName || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">
                                                {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                                            No transaction history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
