'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { UserPlus, PackagePlus } from 'lucide-react';
import { AddMemberSheet, AddItemSheet } from './management-sheets';

export function ManagementSection() {
    return (
        <div className="mt-16 w-full max-w-6xl">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
                <span className="p-2 bg-primary/10 rounded-lg">⚙️</span>
                Administrative Management
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                    onClick={() => document.getElementById('add-member-trigger')?.click()}
                    className="cursor-pointer group"
                >
                    <Card className="h-full hover:border-primary/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="flex flex-col items-center text-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                                <UserPlus className="size-8 text-primary" />
                            </div>
                            <CardTitle className="text-lg font-semibold text-primary">Add Team Member</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center">
                                Register a new technician or researcher into the system.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>

                <div
                    onClick={() => document.getElementById('add-item-trigger')?.click()}
                    className="cursor-pointer group"
                >
                    <Card className="h-full hover:border-primary/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="flex flex-col items-center text-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                                <PackagePlus className="size-8 text-primary" />
                            </div>
                            <CardTitle className="text-lg font-semibold text-primary">Add Inventory Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center">
                                Add a new piece of hardware, tool, or equipment to the inventory.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AddMemberSheet />
            <AddItemSheet />
        </div>
    );
}
