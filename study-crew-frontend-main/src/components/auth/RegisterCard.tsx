import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useAuthModal } from '@/components/context/AuthModalContext';
import { useAuth } from '@/components/context/AuthContext';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  academic_year: z.number().min(1).max(4, { message: 'Academic year must be between 1 and 4.' }),
  telegram_username: z.string().optional(),
  bio: z.string().max(70, { message: 'Bio must be at most 70 characters.' }).optional(),
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
      academic_year: 1,
      telegram_username: '',
      bio: '',
    },
  });
  const { openModal, closeModal } = useAuthModal();
  const { login } = useAuth();

  const bioValue = form.watch("bio");
  const remainingChars = 70 - (bioValue?.length || 0);
  const academicYear = form.watch("academic_year");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user: {
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.password,
            academic_year: values.academic_year,
            telegram_username: values.telegram_username || null,
            bio: values.bio || null,
            // Note: roles are auto-assigned by backend based on academic_year
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.join(', ') || 'Registration failed');
      }

      const data = await res.json();
      console.log('Registration successful:', data);

      // Automatically log the user in after successful registration
      const loginSuccess = await login(values.email, values.password);
      if (loginSuccess) {
        closeModal();
      } else {
        setError('Registration successful, but login failed. Please try signing in manually.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="relative w-full bg-white border border-gray-200 shadow-xl overflow-hidden rounded-xl">
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-green-600 to-green-700"></div>
        
        <CardHeader className="space-y-2 pt-6 pb-4 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="/bits-logo.png" 
                alt="BITS Logo" 
                className="w-14 h-14 object-contain drop-shadow-lg"
              />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Join StudyCrew today
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-4 max-h-[45vh] overflow-y-auto scroll-smooth scroll-styled">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <Input 
                        placeholder="Enter your full name" 
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <Input 
                        placeholder="you@email.com" 
                        type="email" 
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField name="password" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <Input 
                        placeholder="Create a strong password" 
                        type="password" 
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField name="academic_year" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    Academic Year
                  </FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="h-11 border-2 border-gray-200 bg-white hover:border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 rounded-lg shadow-sm">
                        <SelectValue placeholder="Select your academic year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-2 border-green-100 shadow-xl rounded-lg">
                      <SelectItem value="1" className="hover:bg-green-50 focus:bg-green-50 cursor-pointer py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">1</span>
                          <span className="font-medium">1st Year - Freshman</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="2" className="hover:bg-green-50 focus:bg-green-50 cursor-pointer py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">2</span>
                          <span className="font-medium">2nd Year - Sophomore</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="3" className="hover:bg-green-50 focus:bg-green-50 cursor-pointer py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">3</span>
                          <span className="font-medium">3rd Year - Junior</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="4" className="hover:bg-green-50 focus:bg-green-50 cursor-pointer py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">4</span>
                          <span className="font-medium">4th Year - Senior</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {academicYear >= 2 && (
                    <FormDescription className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-md p-2 mt-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">You'll be able to help other students as an Assistant!</span>
                    </FormDescription>
                  )}
                  {academicYear === 1 && (
                    <FormDescription className="flex items-center gap-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-2 mt-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>As a 1st year student, you can find assistants to help you.</span>
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField name="telegram_username" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Telegram Username 
                    <span className="text-sm text-gray-500 font-normal ml-1">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.001.321.023.465.14.12.098.153.23.169.324.016.094.036.308.02.475z"/>
                        </svg>
                      </div>
                      <Input 
                        placeholder="@yourusername" 
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField name="bio" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Bio 
                    <span className="text-sm text-gray-500 font-normal ml-1">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself..." 
                      maxLength={70} 
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-right text-sm">
                    <span className={`font-medium ${remainingChars < 20 ? 'text-orange-600' : 'text-gray-500'}`}>
                      {remainingChars}
                    </span> characters remaining
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign Up</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="py-4 border-t border-gray-100">
          <div className="w-full text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              className="text-green-700 hover:text-green-800 font-semibold hover:underline"
              type="button"
              onClick={() => openModal('login')}
            >
              Sign in
            </button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Custom Scrollbar Styles - Auto-hide */}
      <style>{`
        .scroll-styled {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        .scroll-styled:hover {
          scrollbar-color: #16a34a #dcfce7;
        }
        .scroll-styled::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-styled::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .scroll-styled::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 10px;
        }
        .scroll-styled:hover::-webkit-scrollbar-track {
          background: #dcfce7;
        }
        .scroll-styled:hover::-webkit-scrollbar-thumb {
          background: #16a34a;
        }
        .scroll-styled:hover::-webkit-scrollbar-thumb:hover {
          background: #15803d;
        }
      `}</style>
    </div>
  );
}


