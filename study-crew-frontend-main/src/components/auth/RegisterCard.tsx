import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useAuthModal } from '@/components/context/AuthModalContext';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  role: z.enum(['user', 'assistant'], { message: 'Please select a role.' }),
  academic_year: z.number().min(1).max(4, { message: 'Academic year must be between 1 and 4.' }),
  telegram_username: z.string().optional(),
  bio: z.string().max(70, { message: 'Bio must be at most 70 characters.' }).optional(),
}).refine((data) => {
  if (data.role === 'assistant') {
    return data.academic_year > 1;
  }
  return true;
}, {
  message: '1st year students cannot register as assistants.',
  path: ['academic_year'],
});

export default function RegisterCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      academic_year: 1,
      telegram_username: '',
      bio: '',
    },
  });
  const { openModal, closeModal } = useAuthModal();

  const bioValue = form.watch("bio");
  const remainingChars = 70 - (bioValue?.length || 0);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.password,
            role: values.role,
            academic_year: values.academic_year,
            telegram_username: values.telegram_username || null,
            bio: values.bio || null,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.join(', ') || 'Registration failed');
      }

      const data = await res.json();
      console.log('Registration successful:', data);
      closeModal();
      // Optionally, you could automatically log them in or show a success message
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
        <CardDescription className="text-center">Sign up to get started with StudyCrew</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="password" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="role" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user">Student</SelectItem>
                    <SelectItem value="assistant">Assistant</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="academic_year" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            className="text-blue-600 hover:underline"
            type="button"
            onClick={() => openModal('login')}
          >
            Sign in
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
