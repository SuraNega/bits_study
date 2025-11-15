import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { ScrollArea } from '@/components/ui/scroll-area';

export default function AboutPage() {
  return (
    <ScrollArea className="py-12 h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">About StudyCrew</h1>
        
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At StudyCrew, we believe that learning is better together. Our mission is to connect students with knowledgeable peers who can provide academic support, foster collaborative learning environments, and make education more accessible to everyone.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">For Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get personalized help with your coursework, understand difficult concepts, and improve your grades with support from fellow students who've been there.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Find help for any subject</li>
                  <li>• Connect with knowledgeable peers</li>
                  <li>• Learn at your own pace</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">For Tutors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Share your knowledge, help others succeed, and strengthen your own understanding by teaching what you know.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Help others while learning</li>
                  <li>• Build teaching experience</li>
                  <li>• Join a community of learners</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              StudyCrew was founded by a group of students who understood the challenges of academic life. We noticed that some concepts become clearer when explained by peers who recently mastered them themselves. What started as a small study group has grown into a platform connecting thousands of students across the country.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, we're proud to support a diverse community of learners helping each other succeed academically and beyond.
            </p>
          </section>
        </div>
      </div>
    </ScrollArea>
  );
}
