"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Github, Linkedin, Twitter, Send, MapPin } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulate form submission
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus(''), 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Drop me a line anytime',
      value: 'singhsarvagya260508@gmail.com',
      link: 'mailto:singhsarvagya260508@gmail.com'
    },
    {
      icon: Github,
      title: 'GitHub',
      description: 'Check out my projects',
      value: '@sarvagya-singh-pro',
      link: 'https://github.com'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      description: 'Let\'s connect professionally',
      value: 'sarvagya--singh',
      link: 'https://www.linkedin.com/in/sarvagya--singh/'
    },
    
  ];

  const reasons = [
    'Collaboration opportunities',
    'Guest post submissions',
    'Project consultations',
    'Speaking engagements',
    'General inquiries',
    'Feedback & suggestions'
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
         
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Let's Build
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Something Amazing
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Have a project idea? Want to collaborate? Or just want to say hi? 
            I'd love to hear from you. Fill out the form below or reach out through any of my social channels.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-24">
          {/* Contact Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-8 pt-8">
                <CardDescription className="text-gray-400 text-base">
                  I typically respond within 24-48 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-10">
                <div className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors resize-none"
                      placeholder="Tell me about your idea..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === 'sending'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {status === 'sending' ? (
                      'Sending...'
                    ) : status === 'success' ? (
                      '✓ Message Sent!'
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Location Card */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Location</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      India
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Remote collaborations welcome!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Card */}
            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-600/50">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Quick Response</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      I usually reply within 24-48 hours. 
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What I'm Open To */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-4 pt-6">
                <CardTitle className="text-white text-lg">Open to discuss</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex flex-wrap gap-2">
                  {reasons.map((reason, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-zinc-700 text-gray-400 text-xs"
                    >
                      {reason}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Other Ways to Connect</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <a
                  key={index}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-blue-600 transition-all duration-300 h-full hover:scale-105">
                    <CardContent className="pt-8 pb-8 text-center">
                      <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">{method.title}</h3>
                      <p className="text-gray-500 text-xs mb-3">{method.description}</p>
                      <p className="text-blue-400 text-sm font-medium">{method.value}</p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 px-10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-white font-semibold text-lg mb-3">Do you take on freelance work?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Occasionally! I'm selective about projects, but if it aligns with my interests in AI, 
                  web development, or social impact, let's talk.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-3">Can I contribute to the blog?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Absolutely! I welcome guest posts from fellow developers. Send me your pitch and 
                  writing samples.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-3">Available for speaking?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Yes! I'd love to speak at tech events, workshops, or podcasts about AI, student 
                  development, or my project experiences.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-3">How can I support your work?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Share articles you find helpful, follow on social media, and spread the word about 
                  TechDragon to fellow developers!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
    <Footer/>
    </>
  );
}