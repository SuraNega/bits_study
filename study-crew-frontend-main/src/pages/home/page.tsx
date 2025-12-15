import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useAuthModal } from "@/components/context/AuthModalContext";

export default function HomePage() {
  const { openModal } = useAuthModal();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Gradient Background */}
      <section
        className="relative overflow-hidden text-white"
        style={{ backgroundColor: "#8ec95a" }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-15 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-[#8ec95a] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative w-full">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                {/* Main Heading */}
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 bg-white/15 backdrop-blur rounded-full border border-white/20">
                  <span className="text-white font-semibold text-sm tracking-wide uppercase">
                    BITS Academic Excellence
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Your study support,
                  <span className="block">
                    powered by{" "}
                    <span className="text-white underline decoration-white/30 underline-offset-8">
                      StudyCrew
                    </span>
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Connect with expert study assistants or become one.
                  <span className="block mt-2 text-white font-semibold">
                    Get the help you need or share your knowledge to assist others.
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base font-semibold bg-white text-[#8ec95a] hover:bg-white/90 shadow-lg"
                    onClick={() => openModal("login", "user")}
                  >
                    Get Help Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base font-semibold border-white/60 text-white hover:bg-white/15 hover:text-white"
                    onClick={() => openModal("login", "assistant")}
                  >
                    Become an Assistant
                  </Button>
                </div>

                {/* Feature Tags */}
                <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-3">
                  <div className="px-4 py-2 bg-white/15 border border-white/20 rounded-full shadow-sm">
                    <span className="text-white font-medium">✓ Expert Assistants</span>
                  </div>
                  <div className="px-4 py-2 bg-white/15 border border-white/20 rounded-full shadow-sm">
                    <span className="text-white font-medium">✓ 24/7 Support</span>
                  </div>
                  <div className="px-4 py-2 bg-white/15 border border-white/20 rounded-full shadow-sm">
                    <span className="text-white font-medium">✓ Verified Tutors</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-6 sm:p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                      <div className="text-3xl font-bold">500+</div>
                      <div className="text-sm text-white/80">Active Students</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                      <div className="text-3xl font-bold">100+</div>
                      <div className="text-sm text-white/80">Expert Assistants</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                      <div className="text-3xl font-bold">98%</div>
                      <div className="text-sm text-white/80">Satisfaction</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                      <div className="text-3xl font-bold">Fast</div>
                      <div className="text-sm text-white/80">Instant matching</div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-white/10 border border-white/15 p-4 sm:p-5">
                    <div className="text-sm text-white/80">How it works</div>
                    <div className="mt-3 grid gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-white/15 border border-white/15 flex items-center justify-center font-bold">1</div>
                        <div className="text-white/90">Choose Student or Assistant</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-white/15 border border-white/15 flex items-center justify-center font-bold">2</div>
                        <div className="text-white/90">Get matched instantly</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-white/15 border border-white/15 flex items-center justify-center font-bold">3</div>
                        <div className="text-white/90">Start learning together</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-white to-[#8ec95a]/10">
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you need help or want to help others, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* First Card - Need Help */}
            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#8ec95a]/20 bg-white hover:scale-[1.02]">
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8ec95a]/20 to-[#8ec95a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative text-center pb-6 pt-8">
                <div className="relative w-24 h-24 bg-[#8ec95a] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-md"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-[#8ec95a] animate-ping opacity-20"></div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                  I need an assistant
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Connect with verified study assistants ready to help you excel in your academics
                </CardDescription>
              </CardHeader>
              <CardContent className="relative pt-0 pb-8">
                <Button
                  size="lg"
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                  onClick={() => openModal("login", "user")}
                >
                  Get Help Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 inline-block group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
                
                {/* Features List */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#8ec95a] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Instant matching with available assistants
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#8ec95a] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Track your learning progress
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#8ec95a] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure and verified platform
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second Card - Want to Help */}
            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#8ec95a]/20 bg-white hover:scale-[1.02]">
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8ec95a]/20 to-[#8ec95a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative text-center pb-6 pt-8">
                <div className="relative w-24 h-24 bg-[#8ec95a] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-md"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-[#8ec95a] animate-ping opacity-20"></div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                  I'm here to assist
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Share your knowledge and earn while helping fellow students achieve their goals
                </CardDescription>
              </CardHeader>
              <CardContent className="relative pt-0 pb-8">
                <Button
                  size="lg"
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                  onClick={() => openModal("login", "assistant")}
                >
                  Start Helping
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 inline-block group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
                
                {/* Features List */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#8ec95a] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Flexible scheduling options
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#8ec95a] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Build your teaching portfolio
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#8ec95a] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Earn Knowledge while you help
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 text-white" style={{ backgroundColor: "#8ec95a" }}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg text-white/85">Active Students</div>
            </div>
            <div className="p-6 transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl font-bold mb-2">100+</div>
              <div className="text-lg text-white/85">Expert Assistants</div>
            </div>
            <div className="p-6 transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl font-bold mb-2">98%</div>
              <div className="text-lg text-white/85">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
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
    </div>
  );
}
