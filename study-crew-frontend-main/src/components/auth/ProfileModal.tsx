import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/components/context/AuthContext';
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  telegram_username: z.string().optional(),
  bio: z.string().max(70, { message: 'Bio must be at most 70 characters.' }).optional(),
  activity_status: z.string().optional(),
});

export default function ProfileModal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const { user, hasRole, updateUser } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profile_picture_url || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      telegram_username: user?.telegram_username || '',
      bio: user?.bio || '',
      activity_status: user?.activity_status || '',
    },
  });

  const bioValue = form.watch("bio");
  const remainingChars = 70 - (bioValue?.length || 0);

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        telegram_username: user.telegram_username || '',
        bio: user.bio || '',
        activity_status: user.activity_status || '',
      });
    }
  }, [user, form]);

  // Reset preview when modal opens or user picture changes
  useEffect(() => {
    if (open) {
      setPreviewUrl(user?.profile_picture_url || null);
      setImageFile(null);
    }
  }, [open, user?.profile_picture_url]);

  // Revoke object URL to avoid memory leak
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

      const currentBio = user?.bio || '';
      const newBio = values.bio || '';
      if (newBio !== currentBio) {
        updateData.bio = newBio || null;
      }

      const currentActivityStatus = user?.activity_status || '';
      const newActivityStatus = values.activity_status || '';
      if (newActivityStatus !== currentActivityStatus) {
        updateData.activity_status = newActivityStatus || null;
      }

      const hasPicture = Boolean(imageFile);
      const hasChanges = Object.keys(updateData).length > 0;

      if (!hasChanges && !hasPicture) {
        // No changes and no new picture, just close the modal
        setOpen(false);
        form.reset();
        return;
      }

      let res: Response;
      if (imageFile) {
        const formData = new FormData();
        Object.entries(updateData).forEach(([key, value]) => {
          formData.append(`user[${key}]`, value as string | Blob);
        });
        formData.append('user[profile_picture]', imageFile);
        res = await fetch(`http://localhost:3000/users/${user.id}`, {
          method: 'PATCH',
          credentials: 'include',
          body: formData,
        });
      } else {
        res = await fetch(`http://localhost:3000/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ user: updateData }),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.join(', ') || 'Update failed');
      }

      const data = await res.json();
      // Update user data in context
      updateUser(data);
      setSuccess('Profile updated successfully!');
      form.reset();
      // Close modal after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
          {user?.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt="avatar"
              className="h-8 w-8 object-cover rounded-full"
            />
          ) : (
            <User className="h-5 w-5" />
          )}
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
            <FormField name="bio" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Bio (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us about yourself (max 70 characters)" maxLength={70} {...field} />
                </FormControl>
                <FormDescription>{remainingChars} characters remaining</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            {/* Profile Picture */}
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="selected avatar"
                  className="h-20 w-20 rounded-full object-cover mb-2"
                />
              )}
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
            {hasRole('assistant') && (
              <FormField name="activity_status" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="not available">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
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