import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              IoT Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Real-time monitoring and control of your IoT devices with advanced analytics and secure authentication.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Real-time Monitoring</h3>
                  <p className="text-gray-600">Live sensor data and device status updates</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Access</h3>
                  <p className="text-gray-600">Role-based authentication and authorization</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Advanced Analytics</h3>
                  <p className="text-gray-600">Comprehensive insights and reporting</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Forms */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <LoginForm key="login" onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm key="register" onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Info */}
      <div className="lg:hidden absolute bottom-4 left-4 right-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">IoT Dashboard</h2>
          <p className="text-sm text-gray-600">
            Real-time monitoring and control of your IoT devices
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth; 