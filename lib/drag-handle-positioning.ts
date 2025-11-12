/**
 * Intelligent drag handle positioning utility
 * Ensures drag handles stay within editor container boundaries
 */

const HANDLE_WIDTH = 24 // pixels
const HANDLE_HEIGHT = 24 // pixels
const PADDING = 8 // pixels from container edges

export interface ContainerBounds {
  top: number
  left: number
  bottom: number
  right: number
  width: number
  height: number
}

/**
 * Get editor container bounds relative to viewport
 */
export const getEditorContainerBounds = (): ContainerBounds | null => {
  const editor = document.querySelector('.editor-content-wrapper')
  if (!editor) return null

  const rect = editor.getBoundingClientRect()
  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
    width: rect.width,
    height: rect.height,
  }
}

export interface ElementPosition {
  top: number
  left: number
}

/**
 * Constrain position within editor container bounds
 * Ensures handle stays within the editor and doesn't move outside during scroll
 */
export const constrainPositionToContainer = (
  position: ElementPosition,
  containerBounds: ContainerBounds,
  elementWidth: number = HANDLE_WIDTH,
  elementHeight: number = HANDLE_HEIGHT,
): ElementPosition => {
  return {
    // Clamp top position within container
    top: Math.max(
      containerBounds.top + PADDING,
      Math.min(position.top, containerBounds.bottom - elementHeight - PADDING),
    ),
    // Clamp left position within container
    left: Math.max(
      containerBounds.left + PADDING,
      Math.min(position.left, containerBounds.right - elementWidth - PADDING),
    ),
  }
}

/**
 * Calculate optimal position for drag handle relative to its block element
 * Stays within editor container bounds
 */
export const calculateOptimalDragHandlePosition = (
  elementRect: DOMRect,
  containerBounds: ContainerBounds,
): ElementPosition | null => {
  // Position handle to the left of the element, vertically centered
  const top = elementRect.top + elementRect.height / 2 - HANDLE_HEIGHT / 2
  const left = elementRect.left - HANDLE_WIDTH - 8 // 8px gap from element

  // Constrain within container
  const constrained = constrainPositionToContainer(
    { top, left },
    containerBounds,
    HANDLE_WIDTH,
    HANDLE_HEIGHT,
  )

  return constrained
}

/**
 * Check if an element is visible within the editor container
 */
export const isElementInContainer = (
  element: Element,
  containerBounds: ContainerBounds,
): boolean => {
  const rect = element.getBoundingClientRect()

  return (
    rect.bottom > containerBounds.top + PADDING &&
    rect.top < containerBounds.bottom - PADDING &&
    rect.right > containerBounds.left + PADDING &&
    rect.left < containerBounds.right - PADDING
  )
}

/**
 * Setup intelligent positioning for drag handles
 * This should be called once when the editor is mounted
 */
export const setupDragHandlePositioning = (): (() => void) => {
  let resizeObserver: ResizeObserver | null = null
  let scrollListener: (() => void) | null = null
  let mutationObserver: MutationObserver | null = null
  let dragStartListener: ((e: DragEvent) => void) | null = null
  let dragEndListener: ((e: DragEvent) => void) | null = null

  const updateDragHandlePositions = () => {
    const containerBounds = getEditorContainerBounds()
    if (!containerBounds) return

    const dragHandles = document.querySelectorAll('[data-drag-handle]')

    for (const handle of Array.from(dragHandles)) {
      // Find the parent block element
      const blockElement = (handle as HTMLElement).parentElement

      if (blockElement) {
        const rect = blockElement.getBoundingClientRect()

        // Check if block is visible in container
        if (!isElementInContainer(blockElement, containerBounds)) {
          // Hide handle if block is outside container
          ;(handle as HTMLElement).style.opacity = '0'
          ;(handle as HTMLElement).style.pointerEvents = 'none'
          continue
        }

        const optimalPosition = calculateOptimalDragHandlePosition(
          rect,
          containerBounds,
        )

        if (optimalPosition) {
          // Use absolute positioning relative to viewport
          ;(handle as HTMLElement).style.position = 'fixed'
          ;(handle as HTMLElement).style.top = `${optimalPosition.top}px`
          ;(handle as HTMLElement).style.left = `${optimalPosition.left}px`
          ;(handle as HTMLElement).style.opacity = ''
          ;(handle as HTMLElement).style.pointerEvents = ''
        }
      }
    }
  }

  // Setup drag event listeners to prevent auto-scroll
  dragStartListener = (e: DragEvent) => {
    const editor = document.querySelector('.ProseMirror')
    if (editor && (e.target as HTMLElement).hasAttribute('data-drag-handle')) {
      editor.classList.add('dragging')
    }
  }

  dragEndListener = () => {
    const editor = document.querySelector('.ProseMirror')
    if (editor) {
      editor.classList.remove('dragging')
    }
  }

  // Setup ResizeObserver to track container changes
  resizeObserver = new ResizeObserver(() => {
    updateDragHandlePositions()
  })

  // Setup MutationObserver to track DOM changes
  mutationObserver = new MutationObserver(() => {
    updateDragHandlePositions()
  })

  // Observe the editor container
  const editor = document.querySelector('.editor-content-wrapper')
  const proseMirror = document.querySelector('.ProseMirror')

  if (editor) {
    resizeObserver.observe(editor)
    mutationObserver.observe(editor, {
      childList: true,
      subtree: true,
      attributes: false,
    })
  }

  // Add drag event listeners
  if (proseMirror) {
    proseMirror.addEventListener('dragstart', dragStartListener, true)
    proseMirror.addEventListener('dragend', dragEndListener, true)
  }

  // Setup scroll listener for both window and editor container
  scrollListener = () => {
    updateDragHandlePositions()
  }

  window.addEventListener('scroll', scrollListener, true)
  editor?.addEventListener('scroll', scrollListener, true)

  // Initial positioning
  requestAnimationFrame(updateDragHandlePositions)

  // Cleanup function
  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    if (mutationObserver) {
      mutationObserver.disconnect()
    }
    if (scrollListener) {
      window.removeEventListener('scroll', scrollListener, true)
      editor?.removeEventListener('scroll', scrollListener, true)
    }
    if (dragStartListener && proseMirror) {
      proseMirror.removeEventListener('dragstart', dragStartListener, true)
    }
    if (dragEndListener && proseMirror) {
      proseMirror.removeEventListener('dragend', dragEndListener, true)
    }
  }

  return cleanup
}

/**
 * Add CSS constraint classes for drag handle behavior
 */
export const applyDragHandleConstraints = (): void => {
  const style = document.createElement('style')
  style.id = 'drag-handle-constraints'
  style.textContent = `
    /* Drag handle positioning */
    [data-drag-handle] {
      position: fixed !important;
      z-index: 50;
      will-change: top, left;
      transition: opacity 0.2s ease;
      contain: layout style paint;
    }

    /* Prevent content auto-scroll during dragging */
    .ProseMirror.dragging {
      overflow: hidden !important;
      cursor: grabbing !important;
    }

    /* Disable text selection during drag */
    .ProseMirror.dragging * {
      user-select: none !important;
    }

    /* Editor container constraints */
    .editor-content-wrapper {
      position: relative;
      overflow: visible;
    }

    /* Make sure editor has proper scrolling container */
    .ProseMirror {
      overflow-y: auto;
      overflow-x: hidden;
      max-height: inherit;
    }

    /* Hide drag handle when element is being dragged */
    .ProseMirror [data-drag-handle-dragging="true"] {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    /* Visual feedback for draggable blocks */
    .ProseMirror [data-drag-handle]:hover {
      cursor: grab;
    }

    .ProseMirror [data-drag-handle]:active {
      cursor: grabbing;
    }
  `

  // Only add if not already present
  const existingStyle = document.getElementById('drag-handle-constraints')
  if (existingStyle) {
    existingStyle.remove()
  }
  document.head.appendChild(style)
}
