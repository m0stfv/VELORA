import { motion } from 'framer-motion';

/**
 * Wraps children and fades + rises them into view as they enter the viewport.
 * delay: stagger multiple ScrollReveals for a cascading effect.
 * direction: 'up' | 'none' controls whether it rises while fading in.
 */
export default function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }) {
  const offset = direction === 'up' ? 24 : 0;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
