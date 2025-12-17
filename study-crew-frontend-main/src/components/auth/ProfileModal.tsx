import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/components/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { User, Camera, AtSign, Activity, Lock, Mail, CheckCircle2, Clock, MinusCircle } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      // Close modal after 1.5 seconds so user sees success message
      setTimeout(() => {
        setOpen(false);
        setSuccess(null);
        form.reset({
            name: data.name || '',
            telegram_username: data.telegram_username || '',
            bio: data.bio || '',
            activity_status: data.activity_status || '',
          });
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="icon" className="group relative rounded-full overflow-hidden border-2 border-transparent hover:border-[#8fc95d] transition-all duration-300">
          {user?.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt="avatar"
              className="h-8 w-8 object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="h-8 w-8 bg-gray-100 flex items-center justify-center rounded-full text-gray-500 group-hover:bg-[#8fc95d]/10 group-hover:text-[#8fc95d] transition-colors">
              <User className="h-5 w-5" />
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-t-4 border-t-[#8fc95d] gap-6">
        <div className="flex flex-col space-y-2 text-center items-center">
          <DialogTitle className="text-2xl font-bold text-center text-[#8fc95d]">Edit Profile</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Customize how other study crew members see you.
          </DialogDescription>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center justify-center">
               <div 
                 className="relative group cursor-pointer" 
                 onClick={() => fileInputRef.current?.click()}
                 title="Change profile picture"
               >
                 {previewUrl || user?.profile_picture_url ? (
                   <img
                     src={previewUrl || user?.profile_picture_url}
                     alt="Profile"
                     className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-gray-100 group-hover:ring-[#8fc95d] transition-all duration-300"
                   />
                 ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg ring-2 ring-gray-100 group-hover:ring-[#8fc95d] transition-all duration-300">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                 )}
                 <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                   <Camera className="h-8 w-8 text-white drop-shadow-md" />
                 </div>
               </div>
               <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    }
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#8fc95d] font-medium mt-2 hover:underline focus:outline-none"
                >
                  Change Photo
                </button>
            </div>

            <div className="grid gap-4">
              {/* Email Field - Read Only */}
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold text-sm">Email Address</FormLabel>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    value={user?.email || ''} 
                    disabled 
                    className="pl-10 text-gray-500 bg-gray-100 border-gray-200 cursor-not-allowed" 
                  />
                </div>
              </FormItem>

              {/* Name Field */}
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold text-sm">Full Name</FormLabel>
                   <div className="relative group">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-[#8fc95d] transition-colors" />
                      <FormControl>
                        <Input placeholder="Your Name" {...field} className="pl-10 focus-visible:ring-[#8fc95d] border-gray-200 bg-gray-50/50 hover:bg-white transition-colors" />
                      </FormControl>
                   </div>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Telegram */}
              <FormField name="telegram_username" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold text-sm">Telegram Username (optional)</FormLabel>
                   <div className="relative group">
                      <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-[#8fc95d] transition-colors" />
                      <FormControl>
                        <Input placeholder="username" {...field} className="pl-10 focus-visible:ring-[#8fc95d] border-gray-200 bg-gray-50/50 hover:bg-white transition-colors" />
                      </FormControl>
                   </div>
                  <FormMessage />
                </FormItem>
              )} />
              
               {/* Bio */}
              <FormField name="bio" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold text-sm">Bio (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us a bit about yourself..." 
                      className="resize-none focus-visible:ring-[#8fc95d] border-gray-200 bg-gray-50/50 hover:bg-white transition-colors min-h-[80px]" 
                      maxLength={70} 
                      {...field} 
                    />
                  </FormControl>
                  <div className="flex justify-end">
                    <FormDescription className={`text-xs ${remainingChars < 10 ? "text-[#FF0000] font-bold" : "text-gray-400"}`}>
                      {remainingChars} characters remaining
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Activity Status (Assistants only) */}
               {hasRole('assistant') && (
                <FormField name="activity_status" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-sm">Availability Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-[#8fc95d] border-gray-200 bg-gray-50/50 hover:bg-white h-11 transition-all duration-200">
                          <div className="flex items-center gap-2">
                             <Activity className="h-4 w-4 text-gray-500" />
                             <SelectValue placeholder="Set your status" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-gray-100 shadow-lg rounded-xl">
                        <SelectItem value="available" className="focus:bg-green-50 focus:text-green-900 cursor-pointer py-3">
                          <div className="flex items-center gap-3">
                             <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                             <span className="font-medium">Available</span>
                          </div>
                        </SelectItem>
                        
                        <SelectItem value="busy" className="focus:bg-amber-50 focus:text-amber-900 cursor-pointer py-3">
                           <div className="flex items-center gap-3">
                             <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                             <span className="font-medium">Busy</span>
                          </div>
                        </SelectItem>

                        <SelectItem value="not available" className="focus:bg-red-50 focus:text-red-900 cursor-pointer py-3">
                           <div className="flex items-center gap-3">
                             <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                             <span className="font-medium">Not Available</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center animate-in slide-in-from-top-2 fade-in">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}
            
            {success && (
               <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center animate-in slide-in-from-top-2 fade-in">
                <span className="mr-2">✅</span> {success}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                type="submit" 
                className="flex-1 bg-[#8fc95d] hover:bg-[#7ab34b] text-white font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                   <span className="flex items-center gap-2">
                     <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> 
                     Saving...
                   </span>
                ) : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setChangePasswordOpen(true)}
                className="flex-1 border-2 border-[#8fc95d] text-[#8fc95d] hover:bg-[#8fc95d]/10 font-semibold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <Lock className="w-4 h-4 mr-2" />
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