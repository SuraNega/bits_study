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
        className="relative overflow-hidden bg-white"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-[#8fc95d]/20 rounded-full filter blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute top-12 -right-32 w-[30rem] h-[30rem] bg-[#8fc95d]/25 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-28 left-1/3 w-[34rem] h-[34rem] bg-[#8fc95d]/15 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative w-full">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
            <div className="grid items-center gap-12">
              <div className="text-center">
                {/* Main Heading */}
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 bg-white/70 backdrop-blur rounded-full border border-[#8fc95d]/30 shadow-sm animate-fade-in">
                  <span className="text-gray-900 font-semibold text-sm tracking-wide uppercase">
                    BITS Academic Excellence
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 animate-fade-in [animation-delay:120ms]">
                  Your study support,
                  powered by{" "}
                  <span className="text-[#8fc95d]">StudyCrew</span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:240ms]">
                  Connect with expert study assistants or become one.
                  <span className="block mt-2 text-gray-900 font-semibold">
                    Get the help you need or share your knowledge to assist others.
                  </span>
                </p>

                {/* Feature Tags */}
                <div className="mt-10 flex flex-wrap justify-center gap-3 animate-fade-in [animation-delay:360ms]">
                  <div className="px-4 py-2 bg-white border border-[#8fc95d]/30 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                    <span className="text-gray-900 font-medium">✓ Expert Assistants</span>
                  </div>
                  <div className="px-4 py-2 bg-white border border-[#8fc95d]/30 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                    <span className="text-gray-900 font-medium">✓ 24/7 Support</span>
                  </div>
                  <div className="px-4 py-2 bg-white border border-[#8fc95d]/30 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                    <span className="text-gray-900 font-medium">✓ Verified Tutors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-white to-[#8fc95d]/10">
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
            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#8fc95d]/20 bg-white hover:scale-[1.02]">
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8fc95d]/20 to-[#8fc95d]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative text-center pb-6 pt-8">
                <div className="relative w-24 h-24 bg-[#8fc95d] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
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
                  <div className="absolute inset-0 rounded-3xl bg-[#8fc95d] animate-ping opacity-20"></div>
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
                  className="w-full h-12 text-base font-semibold shadow-lg bg-[#8fc95d] text-white hover:bg-[#8fc95d] hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
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
                    <svg className="w-5 h-5 text-[#8fc95d] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Instant matching with available assistants
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#8fc95d] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Track your learning progress
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#8fc95d] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure and verified platform
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second Card - Want to Help */}
            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#8fc95d]/20 bg-white hover:scale-[1.02]">
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8fc95d]/20 to-[#8fc95d]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative text-center pb-6 pt-8">
                <div className="relative w-24 h-24 bg-[#8fc95d] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
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
                  <div className="absolute inset-0 rounded-3xl bg-[#8fc95d] animate-ping opacity-20"></div>
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
                  className="w-full h-12 text-base font-semibold shadow-lg bg-[#8fc95d] text-white hover:bg-[#8fc95d] hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                  onClick={() => openModal("login", "assistant")}
                >
                  Become an Assistant
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
                    <svg className="w-5 h-5 text-[#8fc95d] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Flexible scheduling options
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#8fc95d] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Build your teaching portfolio
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#8fc95d] mr-2" fill="currentColor" viewBox="0 0 20 20">
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
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 650ms ease-out forwards;
        }

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
