"use client";
import React from "react";
import { motion } from "motion/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { CivicNavbar } from "@/components/ui/civic-navbar";
import { Footer } from "@/components/ui/footer";
import { 
  Smartphone, 
  Download, 
  QrCode, 
  Star, 
  Users, 
  MessageSquare,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function JoinUsPage() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 min-h-screen"
      >
        <CivicNavbar variant="home" />
        
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center text-center space-y-12 pt-24 pb-16 max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Smartphone className="h-12 w-12 text-blue-600" />
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
                Join CivicVoice
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Download our mobile app and become part of the community making a difference. 
              Report issues, track progress, and help build a better tomorrow.
            </p>
          </motion.div>

          {/* QR Code and Download Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center w-full"
          >
            {/* QR Code Section */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
                >
                  {/* Sample QR Code - Replace with actual QR code */}
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-400 dark:text-gray-500" />
                  </div>
                </motion.div>
                
                {/* Floating Animation */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg"
                >
                  <Download className="h-6 w-6" />
                </motion.div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Scan to Download
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Point your camera at the QR code
                </p>
              </div>
            </div>

            {/* Download Buttons Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Download From
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Get the CivicVoice app on your preferred platform
                </p>
              </div>

              {/* Download Buttons */}
              <div className="space-y-4">
                {/* Play Store Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center space-x-4 bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <span className="text-black font-bold text-sm">▶</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs opacity-80">GET IT ON</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto" />
                </motion.button>

                {/* App Store Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center space-x-4 bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">🍎</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto" />
                </motion.button>
              </div>

              {/* Coming Soon Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
                <Star className="h-4 w-4" />
                <span>Coming Soon</span>
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 w-full pt-12"
          >
            {[
              {
                icon: MessageSquare,
                title: "Report Issues",
                description: "Easily report civic problems in your community with photos and location"
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Join thousands of citizens working together to improve their neighborhoods"
              },
              {
                icon: CheckCircle,
                title: "Track Progress",
                description: "Follow up on reported issues and see real-time updates from authorities"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.2, duration: 0.6 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-center space-y-4 pt-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ready to Make a Difference?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join the CivicVoice community today and help create positive change in your neighborhood. 
              Every voice matters, every report counts.
            </p>
          </motion.div>
        </div>
        
        <Footer />
      </motion.div>
    </AuroraBackground>
  );
}
