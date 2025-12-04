import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthModal } from '@/components/context/AuthModalContext';
import { useAuth } from '@/components/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginCard() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { openModal, closeModal, intent } = useAuthModal();
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await login(values.email, values.password);
    if (success) {
      closeModal();
      
      // Get the stored user to check roles and active_role
      const storedUser = localStorage.getItem("user");
      let activeRole = "user";
      let academicYear = 1;
      
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          activeRole = parsed.active_role || "user";
          academicYear = parsed.academic_year || 1;
        } catch {}
      }
      
      // Handle intent-based navigation
      if (intent === 'assistant') {
        const eligibleYears = [1,2,3,4].filter(y => y < academicYear);
        if (eligibleYears.length > 0) {
          navigate(`/dashboard/assistant?year=${eligibleYears[0]}&semester=Semester%201`);
        } else {
          navigate('/dashboard/assistant');
        }
      } else if (intent === 'user') {
        navigate('/dashboard/user');
      } else {
        // Navigate based on active_role
        if (activeRole === 'assistant') {
          navigate('/dashboard/assistant');
        } else {
          navigate('/dashboard/user');
        }
      }
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access StudyCrew</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && <div className="text-red-500 text-center">{error}</div>}
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
            <Button type="submit" className="w-full" disabled={loading}>Sign in</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            className="text-blue-600 hover:underline"
            type="button"
            onClick={() => openModal('register')}
          >
            Sign up
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

