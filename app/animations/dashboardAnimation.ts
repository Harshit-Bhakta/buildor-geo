// animations/dashboardAnimations.ts
export const pageFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease: "easeOut" },
};

export const cardFadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

// Container controls the staggering
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.25, // 👈 delay between cards
      delayChildren: 0.2,    // 👈 slight initial delay
    },
  },
};

// Cards slide in from LEFT
export const cardSlideFromLeft = {
  initial: {
    opacity: 0,
    x: -80,          // 👈 start from left
  },
  animate: {
    opacity: 1,
    x: 0,            // 👈 settle to position
    transition: {
      duration: 0.8, // 👈 slow & smooth
      ease: "easeOut",
    },
  },
};


// Smooth fade-in for map
export const mapFadeReveal = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1.4,     // 👈 slow & smooth
      ease: "easeOut",
      delay: 0.6,        // 👈 waits until cards start appearing
    },
  },
};


export const sidebarSlide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

