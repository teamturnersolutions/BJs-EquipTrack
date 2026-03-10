'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addTeamMember, addInventoryItem } from '@/app/actions';
import { UserPlus, PackagePlus } from 'lucide-react';

const memberSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

const itemSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

import { Checkbox } from '@/components/ui/checkbox';

export function AddMemberSheet() {
    const [open, setOpen] = React.useState(false);
    const [continuousMode, setContinuousMode] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof memberSchema>>({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            name: '',
        },
    });

    React.useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    async function onSubmit(values: z.infer<typeof memberSchema>) {
        const result = await addTeamMember(values.name);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            if (!continuousMode) {
                setOpen(false);
            }
            form.reset();
            setTimeout(() => inputRef.current?.focus(), 10);
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="hidden" id="add-member-trigger" />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Team Member</SheetTitle>
                    <SheetDescription>
                        Enter the name of the new team member. ID will be generated automatically.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            {...field}
                                            ref={(e) => {
                                                field.ref(e);
                                                (inputRef as any).current = e;
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center space-x-2 py-2">
                            <Checkbox
                                id="member-continuous"
                                checked={continuousMode}
                                onCheckedChange={(checked) => setContinuousMode(!!checked)}
                            />
                            <label
                                htmlFor="member-continuous"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Keep open for next scan (Bulk Add)
                            </label>
                        </div>
                        <Button type="submit" className="w-full">
                            Add Member
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}

export function AddItemSheet() {
    const [open, setOpen] = React.useState(false);
    const [continuousMode, setContinuousMode] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof itemSchema>>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            name: '',
        },
    });

    React.useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    async function onSubmit(values: z.infer<typeof itemSchema>) {
        const result = await addInventoryItem(values.name);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            if (!continuousMode) {
                setOpen(false);
            }
            form.reset();
            setTimeout(() => inputRef.current?.focus(), 10);
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="hidden" id="add-item-trigger" />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Inventory Item</SheetTitle>
                    <SheetDescription>
                        Enter the name of the new hardware item. ID will be generated automatically.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="MacBook Pro"
                                            {...field}
                                            ref={(e) => {
                                                field.ref(e);
                                                (inputRef as any).current = e;
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center space-x-2 py-2">
                            <Checkbox
                                id="item-continuous"
                                checked={continuousMode}
                                onCheckedChange={(checked) => setContinuousMode(!!checked)}
                            />
                            <label
                                htmlFor="item-continuous"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Keep open for next scan (Bulk Add)
                            </label>
                        </div>
                        <Button type="submit" className="w-full">
                            Add Item
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
export { BulkImportSheet } from './bulk-import-sheet';
