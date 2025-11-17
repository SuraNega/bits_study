import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/components/context/AuthContext';
import { useState } from 'react';
import { User } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  telegram_username: z.string().optional(),
});

export default function ProfileModal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const { user, updateUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      telegram_username: user?.telegram_username || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const updateData: any = {};

      if (values.name !== user?.name) {
        updateData.name = values.name;
      }

      const currentTelegram = user?.telegram_username || '';
      const newTelegram = values.telegram_username || '';
      if (newTelegram !== currentTelegram) {
        updateData.telegram_username = newTelegram || null;
      }

      // Only proceed if there's something to update
      if (Object.keys(updateData).length === 0) {
        setError('No changes detected.');
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: updateData }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.join(', ') || 'Update failed');
      }

      const data = await res.json();
      // Update user data in context
      updateUser(data);
      setOpen(false);
      form.reset();
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Edit Profile</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="telegram_username" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram Username (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="@yourtelegram" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setChangePasswordOpen(true)}>
                Change Password
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </Dialog>
  );
}