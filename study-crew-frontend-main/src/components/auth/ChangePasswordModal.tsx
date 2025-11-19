import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/components/context/AuthContext';
import { useState } from 'react';

const formSchema = z.object({
  current_password: z.string().min(1, { message: 'Current password is required.' }),
  password: z.string().min(8, { message: 'New password must be at least 8 characters.' }),
  password_confirmation: z.string().min(8, { message: 'Password confirmation is required.' }),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match.',
  path: ['password_confirmation'],
});

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user: {
            password: values.password,
            password_confirmation: values.password_confirmation,
            current_password: values.current_password,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.join(', ') || 'Password update failed');
      }

      setSuccess('Password updated successfully!');
      form.reset();
    } catch (err: any) {
      setError(err.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Change Password</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="current_password" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Current Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="password" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="New Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="password_confirmation" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm New Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            {success ? (
              <Button type="button" className="w-full" onClick={() => { onOpenChange(false); setSuccess(null); }}>
                Close
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}