import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Target, BookOpen, Heart, Sparkles, GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '@/components/context/AuthModalContext';

export default function AboutPage() {
  const navigate = useNavigate();
  const { openModal } = useAuthModal();

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full bg-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-green-50 to-white pt-24 pb-16">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#8fc95d]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 text-[#8fc95d] text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4" />
            <span>Empowering Students Worldwide</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Learning is Better <span className="text-[#8fc95d] relative inline-block">
              Together
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#8fc95d]/30" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.7274 3.39996 90.7273 -1.80006 197.728 2.39998" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            StudyCrew connects students with knowledgeable peers for academic support, fostering a collaborative environment where everyone thrives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Button 
              size="lg" 
              className="bg-[#8fc95d] hover:bg-[#7ab34b] text-white font-bold text-lg px-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              onClick={() => openModal('register')}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-[#8fc95d] text-[#8fc95d] hover:bg-[#8fc95d]/10 font-bold text-lg px-8"
              onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Our Story
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {/* Mission Section */}
        <section className="relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6 animate-in slide-in-from-left duration-700 delay-300 viewport-trigger">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-xl mb-4">
                <Target className="w-8 h-8 text-[#8fc95d]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that education should be accessible and collaborative. Our mission is to bridge the gap between students who need help and those who can provide it, creating a supportive ecosystem where knowledge flows freely.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Democratizing access to academic support",
                  "Fostering peer-to-peer learning networks",
                  "Building confidence through collaboration"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8fc95d]/20 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-[#8fc95d]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2 relative group">
              <div className="absolute inset-0 bg-[#8fc95d] rounded-2xl rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-500">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce duration-[3000ms]">
                   <Heart className="w-8 h-8 text-[#8fc95d]" />
                </div>
                <Users className="w-16 h-16 text-[#8fc95d] mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Community First</h3>
                <p className="text-gray-600">
                  Built by students, for students. We understand the unique challenges of academic life because we've been there.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section>
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Who is StudyCrew For?</h2>
             <p className="text-gray-600 max-w-2xl mx-auto">
               Whether you're looking to master a new subject or share your expertise, there's a place for you here.
             </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-[#8fc95d]/30 transition-all duration-500 hover:shadow-2xl bg-white/50 backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-32 bg-blue-50/50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              <CardContent className="relative p-8 flex flex-col items-start h-full">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">For Students</h3>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                   Get personalized help with your coursework. Understand difficult concepts and improve your grades with support from peers who have successfully navigated the same path.
                </p>
                <div className="space-y-3 w-full">
                  {["Find help for any subject", "Connect with verified peer tutors", "Learn at your own pace"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600 bg-white/80 p-2 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-[#8fc95d]/30 transition-all duration-500 hover:shadow-2xl bg-white/50 backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-32 bg-green-50/50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              <CardContent className="relative p-8 flex flex-col items-start h-full">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-[#8fc95d] group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#8fc95d] transition-colors">For Supporting Peers</h3>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  Share your knowledge and strengthen your own understanding. Teaching is one of the best ways to learn, and helping others succeed builds a stronger community.
                </p>
                <div className="space-y-3 w-full">
                  {["Reinforce your own knowledge", "Build leadership & mentoring skills", "Earn recognition in the community"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600 bg-white/80 p-2 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8fc95d]"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Story Section */}
        <section id="our-story" className="py-16 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-green-50 to-transparent opacity-50 rounded-bl-full"></div>
          <div className="relative px-8 md:px-12 text-center md:text-left">
             <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 text-[#8fc95d] font-bold uppercase tracking-wider text-sm">
                     <div className="w-8 h-0.5 bg-[#8fc95d]"></div>
                     Our Story
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">From a Study Group to a Movement</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    StudyCrew was founded by a group of students who understood the challenges of academic life first-hand. We noticed that complex concepts often click faster when explained by a peer who recently mastered them.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    What started as a small library study group has grown into a platform connecting thousands of students. We're proud to support a diverse community of learners helping each other succeed academically and beyond.
                  </p>
                </div>
                <div className="flex-1 relative">
                   <div className="relative z-10 grid grid-cols-2 gap-4">
                      <div className="space-y-4 mt-8">
                         <div className="bg-gray-100 h-40 rounded-2xl w-full flex items-center justify-center text-gray-300">
                            <span className="text-4xl opacity-20">2023</span>
                         </div>
                         <div className="bg-[#8fc95d] h-56 rounded-2xl w-full flex items-center justify-center text-white p-6 transition-transform hover:scale-105 duration-300">
                            <div className="text-center flex flex-col items-center gap-3">
                              <Users className="w-12 h-12 opacity-90" />
                              <div>
                                <div className="text-2xl font-bold mb-1">Student Led</div>
                                <div className="text-white/90 text-sm font-medium">By Students, For Students</div>
                              </div>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="bg-[#1a1a1a] h-56 rounded-2xl w-full flex items-center justify-center text-white p-6 transition-transform hover:scale-105 duration-300">
                            <div className="text-center flex flex-col items-center gap-3">
                              <Heart className="w-12 h-12 opacity-90" />
                              <div>
                                <div className="text-2xl font-bold mb-1">Inclusive</div>
                                <div className="text-white/90 text-sm font-medium">Growth for Everyone</div>
                              </div>
                            </div>
                         </div>
                         <div className="bg-gray-100 h-40 rounded-2xl w-full flex items-center justify-center text-gray-300">
                             <span className="text-4xl opacity-20">2025</span>
                         </div>
                      </div>
                   </div>
                   {/* Decorative circle */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-green-100 rounded-full z-0 animate-[spin_60s_linear_infinite]"></div>
                </div>
             </div>
          </div>
        </section>

        {/* CTA */}
        <div className="pb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to start your journey?</h2>
          <Button 
            size="lg" 
            className="bg-[#8fc95d] hover:bg-[#7ab34b] text-white font-bold text-lg px-12 py-6 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            onClick={() => openModal('register')}
          >
            Join the Crew
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </ScrollArea>
  );
}
