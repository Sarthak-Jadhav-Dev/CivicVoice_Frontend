"use client";
import React from "react";
import { motion } from "motion/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { CivicNavbar } from "@/components/ui/civic-navbar";
import { Footer } from "@/components/ui/footer";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

export default function NotFound() {
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
        
        {/* 404 Content */}
        <div className="flex flex-col items-center justify-center text-center space-y-8 pt-24 pb-16">
          {/* 404 Number with Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              404
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4"
            >
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Oops! The page you&apos;re looking for seems to have wandered off. 
              Let&apos;s get you back to making your community better.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <button
              onClick={() => window.location.href = "/"}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Home className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              <span>Go Home</span>
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="group flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="pt-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Or try one of these helpful links:
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/join-us"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
              >
                Report an Issue
              </a>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <a
                href="/admin"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
              >
                Admin Portal
              </a>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <a
                href="/contact"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
              >
                Contact Support
              </a>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Floating Icons */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-1/4 left-1/4 opacity-20"
            >
              <Search className="h-8 w-8 text-blue-500" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-1/3 right-1/4 opacity-20"
            >
              <Home className="h-6 w-6 text-purple-500" />
            </motion.div>
          </motion.div>
        </div>
        
        <Footer />
      </motion.div>
    </AuroraBackground>
  );
}

