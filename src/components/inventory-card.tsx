import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type InventoryItem } from '@/lib/types';
import { User, Clock } from 'lucide-react';

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function InventoryCard({ item }: { item: InventoryItem }) {
  const lastActivityDate = item.status === 'Checked Out' ? item.checkedOutDate : item.checkedInDate;
  const lastActivityLabel = item.status === 'Checked Out' ? 'Checked Out' : 'Last Check-In';

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription>
          <Badge variant={item.status === 'Available' ? 'secondary' : 'destructive'}>
            {item.status}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {item.status === 'Checked Out' && item.checkedOutBy && (
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-2 h-4 w-4" />
            <span>Assigned to: {item.checkedOutBy}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>{lastActivityLabel}: {formatDate(lastActivityDate)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
