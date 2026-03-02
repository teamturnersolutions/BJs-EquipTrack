'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useActionState, useState, useMemo, useRef } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { checkInEquipment } from '@/app/actions';
import type { InventoryItem } from '@/lib/types';
import { AppHeader } from '@/components/app-header';
import { User, PackageSearch } from 'lucide-react';

const FormSchema = z.object({
  itemIds: z.array(z.number()).min(1, 'You have to select at least one item to check in.'),
});

type CheckinClientPageProps = {
  items: InventoryItem[];
};

export function CheckinClientPage({ items }: CheckinClientPageProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      itemIds: [],
    },
  });

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return items;
    }
    return items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [items, searchTerm]);

  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      const itemIds = formData.getAll('itemIds');

      const validatedFields = FormSchema.safeParse({
        itemIds: itemIds.map(id => Number(id)),
      });

      if (!validatedFields.success) {
        return {
          success: false,
          message: 'Invalid data',
          errors: validatedFields.error.flatten().fieldErrors,
        };
      }
      return await checkInEquipment(validatedFields.data.itemIds);
    },
    null
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there's an exact match or a single filtered item, select it
      const exactMatch = items.find(i => i.name.toLowerCase() === searchTerm.toLowerCase());
      const target = exactMatch || (filteredItems.length === 1 ? filteredItems[0] : null);

      if (target) {
        const currentIds = form.getValues('itemIds') || [];
        if (!currentIds.includes(target.id)) {
          form.setValue('itemIds', [...currentIds, target.id], { shouldValidate: true });
          toast({
            title: 'Selected',
            description: `${target.name} marked for return.`,
          });
        }
        setSearchTerm('');
      } else if (filteredItems.length > 1) {
        toast({
          title: 'Multiple Matches',
          description: 'Please be more specific or select manually.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Not Found',
          description: `No checked-out item found matching "${searchTerm}".`,
        });
      }
    }
  };

  useEffect(() => {
    if (state?.success === false) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <>
      <AppHeader title="Check In Equipment" />
      <div className="space-y-8 pb-20">

        {items.length > 0 && (
          <Card className="border-primary/50 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <PackageSearch className="size-5" />
                Quick Scan / Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                ref={searchInputRef}
                placeholder="Scan device name (e.g. RF# 01) and hit Enter"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-primary focus-visible:ring-primary h-12 text-lg"
              />
              <p className="text-xs text-muted-foreground mt-2 italic">
                Tip: Scan a barcode to quickly find and select an item for return.
              </p>
            </CardContent>
          </Card>
        )}

        {items.length > 0 ? (
          <Form {...form}>
            <form action={formAction} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment to Check In</CardTitle>
                  <CardDescription>
                    Select the items to return. Showing {filteredItems.length} of {items.length} checked out items.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredItems.length > 0 ? (
                    <FormField
                      control={form.control}
                      name="itemIds"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredItems.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="itemIds"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          name={field.name}
                                          value={item.id}
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), item.id])
                                              : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              );
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal w-full cursor-pointer flex justify-between items-center py-1">
                                        <div className="flex flex-col">
                                          <span>{item.name}</span>
                                          {item.checkedOutBy && (
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                                              <User className="size-2.5" />
                                              {item.checkedOutBy}
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase font-bold text-muted-foreground">
                                          ID: {item.id}
                                        </span>
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="text-muted-foreground py-8 text-center border rounded-md border-dashed">
                      No items match your search term.
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t flex justify-center z-10">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full max-w-md shadow-lg"
                  disabled={form.formState.isSubmitting || !form.watch('itemIds') || form.watch('itemIds').length === 0}
                >
                  {form.formState.isSubmitting ? 'Checking In...' : `Check In ${form.watch('itemIds')?.length || 0} Items`}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Card>
            <CardHeader><CardTitle>All Equipment is Available</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">There are no items currently checked out.</p></CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
