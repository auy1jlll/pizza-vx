// Performance Enhancement: Dynamic Loading System for Admin Modules
'use client';

import { lazy, Suspense, ComponentType, LazyExoticComponent } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Loading component for suspense fallbacks
const ModuleLoading = ({ message = 'Loading module...' }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

// Error fallback component
const ModuleError = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center max-w-md">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Module Failed to Load</h3>
      <p className="text-gray-600 mb-4">
        {error.message || 'An unexpected error occurred while loading this module.'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Lazy load admin modules with performance tracking
const createLazyModule = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  moduleName: string
): LazyExoticComponent<T> => {
  console.log(`[LazyLoad] Creating lazy module: ${moduleName}`);
  
  return lazy(async () => {
    const startTime = performance.now();
    console.log(`[LazyLoad] Loading module: ${moduleName}`);
    
    try {
      const module = await importFn();
      const loadTime = performance.now() - startTime;
      
      console.log(`[LazyLoad] ✅ Module loaded: ${moduleName} (${Math.round(loadTime)}ms)`);
      
      // Track performance metrics
      if (typeof window !== 'undefined' && 'performance' in window) {
        performance.mark(`module-${moduleName}-loaded`);
        performance.measure(
          `module-${moduleName}-load-time`,
          `module-${moduleName}-start`,
          `module-${moduleName}-loaded`
        );
      }
      
      return module;
    } catch (error) {
      const loadTime = performance.now() - startTime;
      console.error(`[LazyLoad] ❌ Module failed: ${moduleName} (${Math.round(loadTime)}ms)`, error);
      throw error;
    }
  });
};

// HOC for wrapping lazy modules with error boundary and suspense
export const withLazyLoading = <T extends ComponentType<any>>(
  LazyComponent: LazyExoticComponent<T>,
  moduleName: string,
  loadingMessage?: string
) => {
  const WrappedComponent = (props: any) => (
    <ErrorBoundary
      FallbackComponent={ModuleError}
      onError={(error: Error) => {
        console.error(`[LazyLoad] Error in ${moduleName}:`, error);
        // In production, you might want to send this to error tracking
      }}
      onReset={() => {
        console.log(`[LazyLoad] Resetting ${moduleName}`);
        window.location.reload(); // Simple reset strategy
      }}
    >
      <Suspense fallback={<ModuleLoading message={loadingMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `LazyLoaded(${moduleName})`;
  return WrappedComponent;
};

// Pre-defined lazy admin modules (using dynamic imports for existing components)
export const LazyAdminModules = {
  // Example: These would be actual admin components when they exist
  // For now, these are placeholder imports that can be replaced with real components
  
  // Placeholder for demonstration - replace with actual component paths
  Dashboard: withLazyLoading(
    createLazyModule(
      () => Promise.resolve({ default: () => <div>Admin Dashboard Component</div> }),
      'Dashboard'
    ),
    'Dashboard',
    'Loading dashboard...'
  ),

  Settings: withLazyLoading(
    createLazyModule(
      () => Promise.resolve({ default: () => <div>Settings Component</div> }),
      'Settings'
    ),
    'Settings',
    'Loading settings...'
  ),

  OrderManagement: withLazyLoading(
    createLazyModule(
      () => Promise.resolve({ default: () => <div>Order Management Component</div> }),
      'OrderManagement'
    ),
    'OrderManagement',
    'Loading order management...'
  )
};

// Module preloader for better UX
export class ModulePreloader {
  private static preloadedModules = new Set<string>();
  
  // Preload a module on hover or focus
  static preload(moduleName: keyof typeof LazyAdminModules): void {
    if (this.preloadedModules.has(moduleName)) {
      return; // Already preloaded
    }

    console.log(`[LazyLoad] Preloading module: ${moduleName}`);
    
    try {
      // Trigger the lazy import without rendering
      const LazyComponent = LazyAdminModules[moduleName];
      if (LazyComponent) {
        // Access the lazy component to trigger import
        const componentType = (LazyComponent as any).type;
        if (componentType && typeof componentType._init === 'function') {
          componentType._init();
        }
      }
      
      this.preloadedModules.add(moduleName);
      console.log(`[LazyLoad] ✅ Module preloaded: ${moduleName}`);
    } catch (error) {
      console.error(`[LazyLoad] ❌ Preload failed: ${moduleName}`, error);
    }
  }

  // Preload multiple modules
  static preloadMultiple(moduleNames: Array<keyof typeof LazyAdminModules>): void {
    moduleNames.forEach(name => this.preload(name));
  }

  // Get preload status
  static isPreloaded(moduleName: keyof typeof LazyAdminModules): boolean {
    return this.preloadedModules.has(moduleName);
  }

  // Clear preload cache
  static clearCache(): void {
    this.preloadedModules.clear();
    console.log('[LazyLoad] Preload cache cleared');
  }
}

// Hook for preloading modules on hover
export const useModulePreloader = () => {
  const preloadOnHover = (moduleName: keyof typeof LazyAdminModules) => ({
    onMouseEnter: () => ModulePreloader.preload(moduleName),
    onFocus: () => ModulePreloader.preload(moduleName)
  });

  const preloadOnIntersection = (
    moduleName: keyof typeof LazyAdminModules,
    options?: IntersectionObserverInit
  ) => {
    return (element: HTMLElement | null) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              ModulePreloader.preload(moduleName);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, ...options }
      );

      observer.observe(element);
    };
  };

  return {
    preloadOnHover,
    preloadOnIntersection,
    preload: ModulePreloader.preload,
    isPreloaded: ModulePreloader.isPreloaded
  };
};

// Performance monitoring utilities
export const LazyLoadMetrics = {
  // Get all lazy load performance entries
  getMetrics(): PerformanceEntry[] {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return [];
    }

    return performance.getEntriesByType('measure')
      .filter(entry => entry.name.includes('module-'))
      .sort((a, b) => b.duration - a.duration);
  },

  // Get summary statistics
  getSummary(): {
    totalModules: number;
    averageLoadTime: number;
    slowestModule: string | null;
    fastestModule: string | null;
  } {
    const metrics = this.getMetrics();
    
    if (metrics.length === 0) {
      return {
        totalModules: 0,
        averageLoadTime: 0,
        slowestModule: null,
        fastestModule: null
      };
    }

    const durations = metrics.map(m => m.duration);
    const averageLoadTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    const slowest = metrics.reduce((prev, curr) => 
      prev.duration > curr.duration ? prev : curr
    );
    
    const fastest = metrics.reduce((prev, curr) => 
      prev.duration < curr.duration ? prev : curr
    );

    return {
      totalModules: metrics.length,
      averageLoadTime: Math.round(averageLoadTime),
      slowestModule: slowest.name.replace('module-', '').replace('-load-time', ''),
      fastestModule: fastest.name.replace('module-', '').replace('-load-time', '')
    };
  },

  // Log performance summary
  logSummary(): void {
    const summary = this.getSummary();
    console.group('[LazyLoad] Performance Summary');
    console.log(`Total Modules Loaded: ${summary.totalModules}`);
    console.log(`Average Load Time: ${summary.averageLoadTime}ms`);
    console.log(`Slowest Module: ${summary.slowestModule}`);
    console.log(`Fastest Module: ${summary.fastestModule}`);
    console.groupEnd();
  }
};
