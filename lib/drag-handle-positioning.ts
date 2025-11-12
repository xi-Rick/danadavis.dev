/**
 * Intelligent drag handle positioning utility
 * Ensures drag handles stay within viewport boundaries and don't scroll off-screen
 */

const HANDLE_WIDTH = 24 // pixels
const HANDLE_HEIGHT = 24 // pixels
const PADDING = 8 // pixels from viewport edges

export interface ViewportBounds {
  top: number
  left: number
  bottom: number
  right: number
  width: number
  height: number
}

/**
 * Get current viewport bounds
 */
export const getViewportBounds = (): ViewportBounds => {
  return {
    top: 0,
    left: 0,
    bottom: window.innerHeight,
    right: window.innerWidth,
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export interface ElementPosition {
  top: number
  left: number
}

/**
 * Constrain position within viewport bounds
 * Ensures element stays visible and doesn't scroll off-screen
 */
export const constrainPositionToViewport = (
  position: ElementPosition,
  elementWidth: number = HANDLE_WIDTH,
  elementHeight: number = HANDLE_HEIGHT,
): ElementPosition => {
  const viewport = getViewportBounds()

  return {
    // Clamp top position
    top: Math.max(
      PADDING,
      Math.min(position.top, viewport.height - elementHeight - PADDING),
    ),
    // Clamp left position
    left: Math.max(
      PADDING,
      Math.min(position.left, viewport.width - elementWidth - PADDING),
    ),
  }
}

/**
 * Calculate optimal position for drag handle to avoid going off-screen
 * Takes into account the element being dragged and viewport bounds
 */
export const calculateOptimalDragHandlePosition = (
  elementRect: DOMRect,
  viewportOffset: { x: number; y: number } = { x: -32, y: 0 },
): ElementPosition => {
  const top = elementRect.top + elementRect.height / 2 - HANDLE_HEIGHT / 2
  const left = elementRect.left + viewportOffset.x

  // Constrain within viewport
  const constrained = constrainPositionToViewport(
    { top, left },
    HANDLE_WIDTH,
    HANDLE_HEIGHT,
  )

  return constrained
}

/**
 * Check if an element is visible within the viewport
 */
export const isElementInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect()
  const viewport = getViewportBounds()

  return (
    rect.bottom > PADDING &&
    rect.top < viewport.height - PADDING &&
    rect.right > PADDING &&
    rect.left < viewport.width - PADDING
  )
}

/**
 * Setup intelligent positioning for drag handles
 * This should be called once when the editor is mounted
 */
export const setupDragHandlePositioning = (): (() => void) => {
  let resizeObserver: ResizeObserver | null = null
  let scrollListener: (() => void) | null = null

  const updateDragHandlePositions = () => {
    const dragHandles = document.querySelectorAll('.drag-handle')

    for (const handle of Array.from(dragHandles)) {
      const elementBeingDragged = handle.closest('.ProseMirror [data-drag]')

      if (elementBeingDragged) {
        const rect = elementBeingDragged.getBoundingClientRect()
        const optimalPosition = calculateOptimalDragHandlePosition(rect)

        // Apply constrained position with transform for better performance
        ;(handle as HTMLElement).style.transform =
          `translate(${optimalPosition.left}px, ${optimalPosition.top}px)`
      }
    }
  }

  // Setup ResizeObserver to track viewport changes
  resizeObserver = new ResizeObserver(() => {
    updateDragHandlePositions()
  })

  // Observe the editor container
  const editor = document.querySelector('.ProseMirror')
  if (editor) {
    resizeObserver.observe(editor)
  }

  // Setup scroll listener
  scrollListener = () => {
    updateDragHandlePositions()
  }

  window.addEventListener('scroll', scrollListener, true)

  // Cleanup function
  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    if (scrollListener) {
      window.removeEventListener('scroll', scrollListener, true)
    }
  }

  return cleanup
}

/**
 * Add CSS constraint classes to prevent drag handle overflow
 */
export const applyDragHandleConstraints = (): void => {
  const style = document.createElement('style')
  style.id = 'drag-handle-constraints'
  style.textContent = `
    .drag-handle {
      /* Prevent scrolling off viewport */
      position: fixed;
      will-change: transform;
      /* Ensure handle is always renderable */
      contain: layout style paint;
    }

    /* Hide handle if it goes too far off-screen */
    .drag-handle[data-hidden="true"] {
      opacity: 0;
      pointer-events: none;
    }

    /* Prevent handle from blocking interaction with editor */
    .ProseMirror {
      overflow: visible;
    }
  `

  // Only add if not already present
  if (!document.getElementById('drag-handle-constraints')) {
    document.head.appendChild(style)
  }
}
