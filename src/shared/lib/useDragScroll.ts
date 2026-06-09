import { useEffect, useRef } from 'react'

const DRAG_THRESHOLD = 6

/**
 * Makes a scrollable element pannable by grabbing and dragging (both axes),
 * while keeping native wheel scroll. A click that follows a real drag is
 * swallowed so child controls don't fire after a pan.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let down = false
    let dragged = false
    let startX = 0
    let startY = 0
    let startLeft = 0
    let startTop = 0

    const onPointerDown = (event: PointerEvent) => {
      // Mouse only; touch devices keep native scrolling.
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      down = true
      dragged = false
      startX = event.clientX
      startY = event.clientY
      startLeft = el.scrollLeft
      startTop = el.scrollTop
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!down) return
      const dx = event.clientX - startX
      const dy = event.clientY - startY
      if (!dragged && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      if (!dragged) {
        dragged = true
        el.setPointerCapture(event.pointerId)
        el.classList.add('cursor-grabbing')
      }
      el.scrollLeft = startLeft - dx
      el.scrollTop = startTop - dy
    }

    const onPointerUp = () => {
      down = false
      el.classList.remove('cursor-grabbing')
    }

    const onClickCapture = (event: MouseEvent) => {
      if (dragged) {
        event.stopPropagation()
        event.preventDefault()
        dragged = false
      }
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    el.addEventListener('click', onClickCapture, true)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('click', onClickCapture, true)
    }
  }, [])

  return ref
}
