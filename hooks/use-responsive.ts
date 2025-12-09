import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

// Helper function to get initial values (consistent for SSR)
function getInitialValues() {
  if (typeof window === "undefined") {
    return { isMobile: false, isTablet: false }
  }
  const width = window.innerWidth
  return {
    isMobile: width < MOBILE_BREAKPOINT,
    isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
  }
}

export function useResponsive() {
  // Use lazy initializer to ensure consistent SSR/client rendering
  // This prevents hydration mismatches and hook count issues
  // Calling getInitialValues() twice is safe since it's synchronous and both calls happen in the same render
  const [isMobile, setIsMobile] = React.useState<boolean>(() => getInitialValues().isMobile)
  const [isTablet, setIsTablet] = React.useState<boolean>(() => getInitialValues().isTablet)

  React.useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const updateSizes = () => {
      const width = window.innerWidth
      setIsMobile(width < MOBILE_BREAKPOINT)
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }

    // Initial update (in case window size changed between render and effect)
    updateSizes()

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const mqlTablet = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      updateSizes()
    }
    
    mql.addEventListener("change", onChange)
    mqlTablet.addEventListener("change", onChange)
    
    return () => {
      mql.removeEventListener("change", onChange)
      mqlTablet.removeEventListener("change", onChange)
    }
  }, [])

  // Memoize return value to ensure consistent object reference
  return React.useMemo(() => ({
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  }), [isMobile, isTablet])
}
