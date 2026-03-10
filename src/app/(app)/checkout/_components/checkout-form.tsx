'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useActionState, useState, useMemo, useRef } from 'react'; // Added useRef

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input'; // Added Input import
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription
import { useToast } from '@/hooks/use-toast';
import { checkOutEquipment } from '@/app/actions';
import type { TeamMember, InventoryItem } from '@/lib/types';
import { AppHeader } from '@/components/app-header';
import { PackageSearch, User } from 'lucide-react'; // Added User import

const FormSchema = z.object({
  teamMemberId: z.number({ required_error: 'Please select a team member.' }),
  itemIds: z.array(z.number()).min(1, 'You have to select at least one item.'), // Changed refine to min
});

type CheckoutFormProps = {
  teamMembers: TeamMember[];
  availableItems: InventoryItem[];
};

export function CheckoutForm({ teamMembers, availableItems }: CheckoutFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [category, setCategory] = useState('all');
  const [scanValue, setScanValue] = useState('');
  const [memberScanValue, setMemberScanValue] = useState('');
  const scanInputRef = useRef<HTMLInputElement>(null);
  const memberScanInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    availableItems.forEach(item => {
      const categoryName = item.name.split('#')[0].trim();
      categorySet.add(categoryName);
    });
    return ['all', ...Array.from(categorySet).sort()];
  }, [availableItems]);

  const filteredItems = useMemo(() => {
    if (category === 'all') {
      return availableItems;
    }
    return availableItems.filter(item => item.name.startsWith(category));
  }, [availableItems, category]);

  const [isScanTriggered, setIsScanTriggered] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      itemIds: [],
    },
  });

  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      const teamMemberId = formData.get('teamMemberId');
      const itemIds = formData.getAll('itemIds');

      const validatedFields = FormSchema.safeParse({
        teamMemberId: Number(teamMemberId),
        itemIds: itemIds.map(id => Number(id)),
      });

      if (!validatedFields.success) {
        setIsScanTriggered(false); // Reset if validation fails
        return {
          success: false,
          message: 'Invalid data',
          errors: validatedFields.error.flatten().fieldErrors,
        };
      }
      return await checkOutEquipment(validatedFields.data.teamMemberId, validatedFields.data.itemIds);
    },
    null
  );

  useEffect(() => {
    if (!memberScanValue.trim()) return;

    // Check for exact match
    const member = teamMembers.find(m => m.name.toLowerCase() === memberScanValue.trim().toLowerCase());
    if (member) {
      form.setValue('teamMemberId', member.id, { shouldValidate: true });
      toast({
        title: 'Member Selected',
        description: `${member.name} recognized.`,
      });
      setMemberScanValue('');
      // Move focus to item scan
      scanInputRef.current?.focus();
    }
  }, [memberScanValue, teamMembers, form, toast]);

  useEffect(() => {
    if (!scanValue.trim()) return;

    // Check for exact match
    const item = availableItems.find(i => i.name.toLowerCase() === scanValue.trim().toLowerCase());
    if (item) {
      const currentIds = form.getValues('itemIds') || [];
      if (!currentIds.includes(item.id)) {
        form.setValue('itemIds', [...currentIds, item.id], { shouldValidate: true });
        toast({
          title: 'Added',
          description: `${item.name} added to checkout list.`,
        });

        // Auto-submit if member is already selected
        const memberId = form.getValues('teamMemberId');
        if (memberId) {
          setIsScanTriggered(true);
          setTimeout(() => {
            formRef.current?.requestSubmit();
          }, 100);
        }
      } else {
        toast({
          title: 'Already Selected',
          description: `${item.name} is already in the list.`,
        });
      }
      setScanValue('');
    }
  }, [scanValue, availableItems, form, toast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If no exact match was found yet, attempt a search/feedback
      // (The useEffect handles the auto-advance on exact match)
    }
  };

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
      });

      if (isScanTriggered) {
        // Reset form and focus for next scan
        form.reset({
          teamMemberId: undefined as any,
          itemIds: [],
        });
        setIsScanTriggered(false);
        setMemberScanValue('');
        setScanValue('');
        // Re-focus member scan for the next person
        setTimeout(() => memberScanInputRef.current?.focus(), 50);
      } else {
        form.reset();
        router.push('/');
      }
    } else if (state?.success === false) {
      setIsScanTriggered(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast, router, form, isScanTriggered]);

  useEffect(() => {
    // Auto-focus the member scan input on mount
    memberScanInputRef.current?.focus();
  }, []); // New useEffect for auto-focus

  return (
    <>
      <AppHeader title="Check Out Equipment" />
      <Form {...form}>
        <form ref={formRef} action={formAction} className="space-y-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-primary/50 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="size-5 text-primary" />
                    Quick Scan Badge
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Input
                      ref={memberScanInputRef}
                      placeholder="Scan badge or type name..."
                      value={memberScanValue}
                      onChange={(e) => setMemberScanValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="border-primary focus-visible:ring-primary"
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Step 1: Scan your badge to identify yourself.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="teamMemberId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Or Select Manually</FormLabel>
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          value={field.value?.toString()}
                          name={field.name}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a team member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teamMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id.toString()}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-primary/50 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PackageSearch className="size-5 text-primary" />
                    Quick Scan Item
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Input
                      ref={scanInputRef} // Added ref to Input
                      placeholder="Scan barcode or type name..."
                      value={scanValue}
                      onChange={(e) => setScanValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="border-primary focus-visible:ring-primary"
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Tip: Scan an item name and hit Enter to add it instantly.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Filter by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={setCategory} defaultValue={category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat === 'all' ? 'All Equipment' : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Available Equipment</CardTitle>
                  <CardDescription>
                    Select items manually or use the Quick Scan box.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredItems.length > 0 ? (
                    <FormField
                      control={form.control}
                      name="itemIds"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        <span>{item.name}</span>
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
                      No items available for this category.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t flex justify-center z-10">
            <Button
              type="submit"
              size="lg"
              className="w-full max-w-md shadow-lg"
              disabled={form.formState.isSubmitting || !form.watch('itemIds') || form.watch('itemIds').length === 0}
            >
              {form.formState.isSubmitting ? 'Checking Out...' : `Check Out ${form.watch('itemIds')?.length || 0} Items`}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
