import React from 'react';
import CategoryCards from '../components/home/CategoryCards';
import { motion } from 'motion/react';

export default function InternalSite() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen py-12"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-[#8B0000] uppercase tracking-tight mb-4">Internal Portal</h2>
          <div className="w-24 h-1 bg-ip-red mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access our comprehensive range of services and product categories. Explore specialized solutions tailored for your needs.
          </p>
        </div>
        
        <CategoryCards />
      </div>
    </motion.div>
  );
}
