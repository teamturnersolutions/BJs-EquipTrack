'use client';

import { Button } from '@/components/ui/button';
import { UserPlus, PackagePlus, FileUp } from 'lucide-react';
import { AddMemberSheet, AddItemSheet, BulkImportSheet } from './management-sheets';

export function HomeManagementControls() {
    return (
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => document.getElementById('add-member-trigger')?.click()}
                title="Add Team Member"
            >
                <UserPlus className="h-5 w-5 text-primary" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => document.getElementById('bulk-import-trigger')?.click()}
                title="Bulk Import CSV"
            >
                <FileUp className="h-5 w-5 text-primary" />
            </Button>
            <AddMemberSheet />
            <AddItemSheet />
            <BulkImportSheet />
        </div>
    );
}
