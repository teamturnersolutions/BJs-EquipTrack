import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export async function GET() {
    try {
        const logs = await prisma.inventoryLog.findMany({
            orderBy: {
                timestamp: 'desc',
            },
        });

        // CSV Headers
        const headers = ['Action', 'Item Name', 'Item ID', 'Team Member', 'Date', 'Time'];

        // CSV Rows
        const rows = logs.map(log => {
            const dateObj = new Date(log.timestamp);
            return [
                log.action === 'CHECKOUT' ? 'Checked Out' : 'Checked In',
                `"${log.itemName.replace(/"/g, '""')}"`, // Handle quotes in names
                log.itemId,
                `"${(log.teamMemberName || 'N/A').replace(/"/g, '""')}"`,
                format(dateObj, 'yyyy-MM-dd'),
                format(dateObj, 'HH:mm:ss'),
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');

        const filename = `equiptrack-history-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Failed to export history' }, { status: 500 });
    }
}
