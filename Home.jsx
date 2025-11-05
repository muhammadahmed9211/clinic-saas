import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Shield, Clock, CreditCard, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description: 'Book appointments with top doctors in just a few clicks',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access our platform anytime, anywhere',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected',
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Pay via EasyPaisa, JazzCash, or Credit Card',
    },
  ];
  
  const benefits = [
    'No waiting in long queues',
    'Choose from certified doctors',
    'Instant appointment confirmation',
    'Secure online payments',
    'SMS & Email reminders',
    'Digital medical records',
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Your Health, Our Priority
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                Book appointments with top doctors, manage your health records, and pay securely - all in one place.
              </p>
              <div className="flex gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="ghost" className="text-white border-2 border-white hover:bg-white hover:text-primary-600">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white bg-opacity-10 rounded-lg">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Easy Booking</p>
                      <p className="text-sm text-primary-100">Book in 2 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white bg-opacity-10 rounded-lg">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold">100% Secure</p>
                      <p className="text-sm text-primary-100">Bank-level security</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white bg-opacity-10 rounded-lg">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Easy Payments</p>
                      <p className="text-sm text-primary-100">Multiple options</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Ahmed Clinic?
            </h2>
            <p className="text-xl text-gray-600">
              Modern healthcare management made simple
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything You Need in One Place
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive platform makes managing your health easier than ever.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/register">
                  <Button size="lg">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-primary-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Create Account</h4>
                    <p className="text-primary-100">Sign up in less than 2 minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Choose Doctor</h4>
                    <p className="text-primary-100">Browse and select your preferred doctor</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Book & Pay</h4>
                    <p className="text-primary-100">Confirm appointment and pay securely</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Take Control of Your Health Today
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of patients who trust Ahmed Clinic for their healthcare needs
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;