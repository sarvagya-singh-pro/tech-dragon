"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation'
const cardVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function BlogCard({ title, summary, date, uid }) {
  const router = useRouter()
  return (
    <motion.div
      variants={cardVariants}
      onClick={()=>{router.push(`/articles/${uid}`)}}
      className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl cursor-pointer space-y-6 transition-all duration-300 hover:border-blue-600 hover:scale-[1.02] group"
    >
      {/* Category and Date */}
      <div className="flex items-center justify-between gap-4">
      
        <span className="text-sm text-gray-500">{date}</span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 leading-tight">
        {title}
      </h3>

      {/* Summary */}
      <p className="text-gray-400 leading-relaxed text-base">
        {summary}
      </p>

      {/* Read More Link */}
      <div className="flex items-center gap-2 text-blue-400 font-medium pt-2 group-hover:gap-3 transition-all duration-300">
        Read More
        <ArrowRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
}

export { BlogCard };