"use client";

import { FADE_IN_ANIMATION_VARIANTS } from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

const PageTransitionWrapper = ({ children }: PageTransitionWrapperProps) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={pathname}
        initial='hidden'
        animate='show'
        exit='hidden'
        variants={FADE_IN_ANIMATION_VARIANTS}
        transition={{ duration: 0.4, ease: "easeInOut" }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionWrapper;
