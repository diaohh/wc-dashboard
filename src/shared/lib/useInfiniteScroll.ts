import { useEffect, useRef } from 'react'

/**
 * Returns a ref for a sentinel element; when it scrolls into view and `enabled`
 * is true, `onLoadMore` fires. Pass a referentially stable callback (e.g. React
 * Query's `fetchNextPage`) so the observer isn't re-created each render.
 */
export function useInfiniteScroll<T extends Element = HTMLDivElement>(
  onLoadMore: () => void,
  enabled: boolean,
) {
  const sentinelRef = useRef<T | null>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin: '200px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [onLoadMore, enabled])

  return sentinelRef
}
