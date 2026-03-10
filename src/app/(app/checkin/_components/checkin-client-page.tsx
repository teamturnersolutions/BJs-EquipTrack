'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useActionState, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

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
import { User } from 'lucide-react';

const FormSchema = z.object({
  itemIds: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item to check in.',
  }),
});

type CheckinClientPageProps = {
  items: InventoryItem[];
};

export function CheckinClientPage({ items }: CheckinClientPageProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

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

  useEffect(() => {
    form.setValue('itemIds', []);
  }, [searchTerm, form]);


  const [state, formAction] = useActionState(
    (prevState: any, formData: FormData) => {
        const validatedFields = FormSchema.safeParse({
            itemIds: formData.getAll('itemIds'),
        });

        if (!validatedFields.success) {
            return {
                message: 'Invalid data',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }
        return checkInEquipment(validatedFields.data.itemIds);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      form.reset();
      router.push('/');
    } else if (state?.success === false) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast, router, form]);

  return (
    <>
      <AppHeader title="Check In Equipment" />
      <div className="space-y-8">
        
        {items.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Search Checked Out Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input 
                    placeholder="Filter by device ID (e.g. RF# 01)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal w-full cursor-pointer flex justify-between items-center">
                                        <span>{item.name}</span>
                                        {item.checkedOutBy && (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <User className="size-3" />
                                                {item.checkedOutBy}
                                            </span>
                                        )}
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
                    <p className="text-muted-foreground">
                      No items match your search term.
                    </p>
                  )}
                </CardContent>
              </Card>

              {filteredItems.length > 0 && (
                <Button type="submit" disabled={form.formState.isSubmitting || !form.watch('itemIds') || form.watch('itemIds').length === 0}>
                  {form.formState.isSubmitting ? 'Checking In...' : 'Check In Selected Items'}
                </Button>
              )}
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
