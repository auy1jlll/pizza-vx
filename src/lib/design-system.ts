// Design System - Typography & Color Tokens
// Based on the UI/UX guide for rapid development

// lib/design-system.ts - Comprehensive Design System
export const designSystem = {
  // Display - Hero headlines (36px/40px)
  display: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight',
  
  // H1 - Page titles (30px/36px)
  h1: 'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight',
  
  // H2 - Section headers (24px/32px)
  h2: 'text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed',
  
  // H3 - Card titles (20px/28px)
  h3: 'text-xl md:text-2xl font-bold leading-relaxed',
  
  // Body - Default text (16px/24px)
  body: 'text-base leading-relaxed',
  
  // Body Large - Important text (18px/28px)
  bodyLarge: 'text-lg leading-relaxed',
  
  // Small - Secondary text (14px/20px)
  small: 'text-sm leading-relaxed',
  
  // Tiny - Captions (12px/16px)
  tiny: 'text-xs leading-normal'
};

export const colors = {
  // Primary Brand Colors
  primary: {
    50: 'from-orange-400 to-red-500',
    100: 'bg-orange-500',
    200: 'bg-orange-600',
    300: 'text-orange-300',
    400: 'text-orange-400',
    500: 'text-orange-500',
    gradient: 'bg-gradient-to-r from-orange-500 to-red-600'
  },
  
  // Secondary Brand Colors
  secondary: {
    50: 'from-green-400 to-emerald-500',
    100: 'bg-green-500',
    200: 'bg-green-600',
    300: 'text-green-300',
    400: 'text-green-400',
    500: 'text-green-500',
    gradient: 'bg-gradient-to-r from-green-500 to-emerald-600'
  },
  
  // Success (Green)
  success: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-300',
    icon: 'text-green-400'
  },
  
  // Warning (Amber)
  warning: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    icon: 'text-amber-400'
  },
  
  // Error (Red)
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    text: 'text-red-300',
    icon: 'text-red-400'
  },
  
  // Neutral Grays
  neutral: {
    white: 'text-white',
    100: 'text-white/90',
    200: 'text-white/80',
    300: 'text-white/70',
    400: 'text-white/60',
    500: 'text-white/50',
    600: 'text-white/40',
    700: 'text-white/30',
    800: 'text-white/20',
    900: 'text-white/10'
  }
};

export const spacing = {
  // Tight spacing (4px)
  tight: 'space-y-1',
  
  // Small spacing (8px)
  small: 'space-y-2',
  
  // Medium spacing (16px)
  medium: 'space-y-4',
  
  // Large spacing (24px)
  large: 'space-y-6',
  
  // Section spacing (32px)
  section: 'space-y-8',
  
  // Hero spacing (48px)
  hero: 'space-y-12'
};

export const glassMorphism = {
  // Light glass
  light: 'bg-white/5 backdrop-blur-xl border border-white/10',
  
  // Medium glass
  medium: 'bg-white/10 backdrop-blur-xl border border-white/20',
  
  // Heavy glass
  heavy: 'bg-white/15 backdrop-blur-xl border border-white/30',
  
  // Interactive glass
  interactive: 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300'
};

export const animations = {
  // Hover scale
  hoverScale: 'hover:scale-105 transition-transform duration-300',
  
  // Hover scale small
  hoverScaleSmall: 'hover:scale-[1.02] transition-transform duration-300',
  
  // Fade in
  fadeIn: 'animate-in fade-in-0 slide-in-from-bottom-4',
  
  // Staggered animation helper
  staggered: (index: number) => ({
    animationDelay: `${index * 0.1}s`,
    animationFillMode: 'both' as const
  }),
  
  // Enhanced micro-animations
  shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
  
  // Floating animation
  float: 'animate-[float_6s_ease-in-out_infinite]',
  
  // Pulse glow
  pulseGlow: 'animate-pulse shadow-lg',
  
  // Rotate on hover
  rotateHover: 'group-hover:rotate-12 transition-transform duration-300',
  
  // Slide in from directions
  slideInLeft: 'animate-in slide-in-from-left-4 fade-in-0',
  slideInRight: 'animate-in slide-in-from-right-4 fade-in-0',
  slideInUp: 'animate-in slide-in-from-bottom-4 fade-in-0',
  slideInDown: 'animate-in slide-in-from-top-4 fade-in-0',
  
  // Bounce in
  bounceIn: 'animate-in zoom-in-50 fade-in-0',
  
  // Magnetic hover effect
  magnetic: 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300',
  
  // Text gradient animation
  textGradientShift: 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse'
};

export const components = {
  // Button variants
  button: {
    primary: `${colors.primary.gradient} hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-2xl transition-all duration-300 ${animations.hoverScale} shadow-lg hover:shadow-orange-500/25`,
    secondary: `${colors.secondary.gradient} hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-300 ${animations.hoverScale} shadow-lg hover:shadow-green-500/25`,
    glass: `${glassMorphism.interactive} text-white font-semibold rounded-2xl ${animations.hoverScale} shadow-lg`,
    shimmer: `group/btn relative overflow-hidden rounded-2xl ${colors.primary.gradient} hover:from-orange-600 hover:to-red-700 text-white font-semibold transition-all duration-300 ${animations.hoverScale} shadow-lg hover:shadow-orange-500/25`,
    magnetic: `${colors.primary.gradient} hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-2xl transition-all duration-300 ${animations.magnetic} shadow-lg hover:shadow-orange-500/25`
  },
  
  // Card variants
  card: {
    glass: `${glassMorphism.light} rounded-3xl overflow-hidden ${animations.hoverScaleSmall} shadow-2xl hover:shadow-white/10`,
    featured: `${glassMorphism.medium} rounded-3xl overflow-hidden ${animations.hoverScale} shadow-2xl hover:shadow-white/20`,
    interactive: `group relative overflow-hidden rounded-3xl ${glassMorphism.light} hover:border-white/30 transition-all duration-500 ${animations.hoverScaleSmall} shadow-2xl hover:shadow-white/10`,
    floating: `group relative overflow-hidden rounded-3xl ${glassMorphism.light} hover:border-white/30 transition-all duration-500 ${animations.hoverScaleSmall} ${animations.float} shadow-2xl hover:shadow-white/10`,
    magnetic: `group relative overflow-hidden rounded-3xl ${glassMorphism.light} hover:border-white/30 transition-all duration-500 ${animations.magnetic} shadow-2xl hover:shadow-white/10`
  },
  
  // Badge variants
  badge: {
    primary: `inline-flex items-center px-4 py-2 rounded-xl ${colors.primary.gradient}/20 backdrop-blur-sm border border-orange-500/30 ${colors.primary[300]} font-medium shadow-lg ${animations.hoverScale}`,
    secondary: `inline-flex items-center px-4 py-2 rounded-xl ${colors.success.bg} backdrop-blur-sm ${colors.success.border} ${colors.success.text} font-medium shadow-lg ${animations.hoverScale}`,
    neutral: `inline-flex items-center px-4 py-2 rounded-xl ${glassMorphism.medium} ${colors.neutral[100]} font-medium shadow-lg ${animations.hoverScale}`,
    floating: `inline-flex items-center px-6 py-3 rounded-full ${glassMorphism.medium} ${colors.neutral[100]} font-medium shadow-xl ${animations.hoverScale} ${animations.float}`,
    pulse: `inline-flex items-center px-4 py-2 rounded-xl ${colors.primary.gradient}/20 backdrop-blur-sm border border-orange-500/30 ${colors.primary[300]} font-medium shadow-lg ${animations.pulseGlow}`
  },
  
  // Icon variants
  icon: {
    floating: `text-6xl opacity-20 group-hover:opacity-40 transition-all duration-500 ${animations.rotateHover} group-hover:scale-110`,
    badge: `w-12 h-12 rounded-2xl ${colors.primary.gradient}/20 backdrop-blur-sm border border-orange-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`,
    interactive: `w-16 h-16 rounded-2xl ${colors.primary.gradient} flex items-center justify-center shadow-lg ${animations.hoverScale} group-hover:shadow-orange-500/25`
  },
  
  // Input variants
  input: {
    glass: `w-full px-4 py-3 rounded-xl ${glassMorphism.medium} text-white placeholder-white/60 border-0 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300`,
    floating: `w-full px-4 py-3 rounded-xl ${glassMorphism.medium} text-white placeholder-white/60 border-0 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 focus:scale-[1.02]`
  }
};

// Mobile-First Responsive Utilities
export const responsive = {
  // Container sizes
  container: {
    mobile: 'px-4 mx-auto max-w-sm',
    tablet: 'px-6 mx-auto max-w-2xl md:max-w-4xl',
    desktop: 'px-8 mx-auto max-w-6xl lg:max-w-7xl'
  },
  
  // Grid systems
  grid: {
    mobile: 'grid grid-cols-1 gap-4',
    tablet: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    desktop: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8',
    auto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'
  },
  
  // Spacing scales
  spacing: {
    mobile: 'py-8 px-4',
    tablet: 'py-12 px-6',
    desktop: 'py-16 px-8'
  },
  
  // Text sizes with mobile-first approach
  text: {
    display: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
    hero: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    title: 'text-2xl sm:text-3xl md:text-4xl',
    subtitle: 'text-lg sm:text-xl md:text-2xl',
    body: 'text-base sm:text-lg',
    small: 'text-sm sm:text-base'
  },
  
  // Button sizes
  button: {
    mobile: 'px-4 py-2 text-sm',
    tablet: 'px-6 py-3 text-base',
    desktop: 'px-8 py-4 text-lg'
  }
};
