import { motion, useReducedMotion } from "framer-motion";
import React from "react";

export const PageFade: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.28, ease: "easeOut" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export const SectionFade: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.22, delay }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export const StaggerList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="show"
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: 0.06 } },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
};
