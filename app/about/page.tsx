import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Lightbulb, Users, Rocket, BookOpen, Sparkles } from 'lucide-react';
import Navbar from '@/components/ui/navbar';

export default function AboutSection() {
  const stats = [
    { label: 'Tech Articles', value: '50+', icon: BookOpen },
    { label: 'Topics Covered', value: '15+', icon: Code2 },
    { label: 'Monthly Readers', value: '2+', icon: Users },
  ];

  const topics = [
    'Artificial Intelligence',
    'Web Development',
    'Machine Learning',
    'Next.js & React',
    'Healthcare Tech',
    '3D Graphics',
    'UI/UX Design',
    'Robotics'
  ];

  const mission = [
    {
      icon: Lightbulb,
      title: 'Simplify Complex Tech',
      description: 'Breaking down advanced technologies into digestible, actionable content that anyone can understand and apply.'
    },
    {
      icon: Rocket,
      title: 'Showcase Real Projects',
      description: 'Sharing authentic build experiences, complete with failures, iterations, and lessons learned along the way.'
    },
    {
      icon: Users,
      title: 'Bridge Theory & Practice',
      description: 'Connecting academic concepts with hands-on implementations to help readers build meaningful solutions.'
    }
  ];

  return (
    <>
     <Navbar/>
   
    <div className="min-h-screen bg-black text-white py-20 px-6">
        
      <div className="max-w-7xl mx-auto">
       
        <div className="text-center mb-16 space-y-4">
         
          <h1 className="text-5xl md:text-7xl font-bold">
            Where Innovation
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Meets Accessibility
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            A tech blog demystifying AI, web development, and emerging technologies through 
            real-world projects and student perspectives from India.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-blue-600 transition-all duration-300 hover:scale-105">
                <CardContent className="pt-8 pb-8 px-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-4 text-blue-500" />
                  <div className="text-3xl font-bold mb-2 text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          {/* What is TechDragon */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold mb-8 text-white">What is TechDragon?</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              TechDragon is a space where cutting-edge technology meets practical learning. 
              Born from a passion for making complex tech accessible, this blog focuses on the 
              intersection of artificial intelligence, modern web development, and real-world problem-solving.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              Unlike typical tech blogs that only share polished success stories, TechDragon embraces 
              the messy middle—the bugs, the failed attempts, the iterations that actually teach you 
              something. Here, you'll find honest documentation of building AI systems, web applications, 
              and innovative solutions from a student developer's perspective.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              Whether you're curious about implementing machine learning models, building sleek Next.js 
              applications, or exploring how technology can solve social challenges, TechDragon offers 
              tutorials, insights, and project walkthroughs that go beyond surface-level explanations.
            </p>
          </div>

          {/* What We Cover */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold mb-8 text-white">What We Cover</h2>
            <p className="text-gray-300 leading-relaxed text-lg mb-8">
              From AI-powered healthcare solutions to futuristic web interfaces, TechDragon explores 
              technologies that are shaping the future. Each article aims to bridge the gap between 
              theoretical knowledge and hands-on implementation.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {topics.map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors px-4 py-2 text-sm"
                >
                  {topic}
                </Badge>
              ))}
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              Special focus on projects that combine technical innovation with social impact—because 
              the best technology serves real human needs.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {mission.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 hover:border-blue-600 transition-all duration-300">
                  <CardHeader className="pb-8 pt-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl mb-4">{value.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Philosophy Section */}
        <Card className="bg-zinc-900 border-zinc-800 mb-24">
          <CardContent className="py-16 px-10 md:px-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="hidden md:block flex-shrink-0">
                <Sparkles className="w-20 h-20 text-blue-500" />
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white mb-6">Why TechDragon?</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Technology should inspire curiosity, not intimidation. TechDragon was created to show 
                  that building innovative solutions isn't reserved for Silicon Valley—it can happen 
                  anywhere, by anyone willing to learn and iterate.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg">
                  This blog documents real experiences from a high school student in India navigating 
                  the world of AI, web development, and tech entrepreneurship. Every tutorial, every 
                  project breakdown, and every lesson shared here comes from actual hands-on experience—the 
                  good, the bad, and the debugged.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg">
                  The goal? To inspire more young developers to take the leap, build fearlessly, and 
                  understand that every "failure" is just another step toward mastery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Join the Journey
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Subscribe to get tutorials, project breakdowns, and tech insights delivered to your inbox. 
              Let's build the future together.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe Now
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}