/**
 * ANIMATIONS
 * WAAPI wrappers for consistent motion
 */

// Easing curves
export const easings = {
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  out: 'cubic-bezier(0.23, 1, 0.32, 1)',
  inOut: 'cubic-bezier(0.45, 0, 0.55, 1)'
};

// Durations (Fibonacci sequence)
export const durations = {
  fast: 100,
  normal: 200,
  slow: 300,
  slowest: 500,
  slowest2: 800
};

/**
 * Expand node scale
 */
export async function expandNode(element, scale = 1.3) {
  const animation = element.animate(
    [
      { transform: element.style.transform || 'translate(0, 0) scale(1)' },
      { transform: `${element.style.transform.replace(/scale\([^)]*\)/, '')} scale(${scale})`.trim() }
    ],
    {
      duration: durations.normal,
      easing: easings.spring,
      fill: 'forwards'
    }
  );
  
  return animation.finished;
}

/**
 * Collapse node back to normal scale
 */
export async function collapseNode(element) {
  const animation = element.animate(
    [
      { transform: element.style.transform },
      { transform: element.style.transform.replace(/scale\([^)]*\)/, 'scale(1)') }
    ],
    {
      duration: durations.normal,
      easing: easings.out,
      fill: 'forwards'
    }
  );
  
  return animation.finished;
}

/**
 * Fade in element
 */
export async function fadeIn(element, duration = durations.normal) {
  const animation = element.animate(
    [
      { opacity: 0 },
      { opacity: 1 }
    ],
    {
      duration,
      easing: easings.out,
      fill: 'forwards'
    }
  );
  
  return animation.finished;
}

/**
 * Fade out element
 */
export async function fadeOut(element, duration = durations.normal) {
  const animation = element.animate(
    [
      { opacity: 1 },
      { opacity: 0 }
    ],
    {
      duration,
      easing: easings.out,
      fill: 'forwards'
    }
  );
  
  return animation.finished;
}

/**
 * Slide element from position
 */
export async function slideFrom(element, fromX, fromY, duration = durations.slow) {
  const currentTransform = element.style.transform || 'translate(0, 0)';
  
  const animation = element.animate(
    [
      { transform: `translate(${fromX}px, ${fromY}px)`, opacity: 0 },
      { transform: currentTransform, opacity: 1 }
    ],
    {
      duration,
      easing: easings.spring,
      fill: 'forwards'
    }
  );
  
  return animation.finished;
}

/**
 * Pulse animation (breathing effect)
 */
export function startBreathing(element, scaleRange = 0.05) {
  const animation = element.animate(
    [
      { transform: 'scale(1)' },
      { transform: `scale(${1 + scaleRange})` },
      { transform: 'scale(1)' }
    ],
    {
      duration: 8000,
      easing: 'ease-in-out',
      iterations: Infinity
    }
  );
  
  return animation;
}

/**
 * Tooltip appearance with direction
 */
export async function showTooltip(element, direction = 'top') {
  const offsets = {
    top: { x: 0, y: -10 },
    bottom: { x: 0, y: 10 },
    left: { x: -10, y: 0 },
    right: { x: 10, y: 0 }
  };
  
  const offset = offsets[direction] || offsets.top;
  
  const animation = element.animate(
    [
      { 
        opacity: 0, 
        transform: `translate(${offset.x}px, ${offset.y}px) scale(0.9)` 
      },
      { 
        opacity: 1, 
        transform: 'translate(0, 0) scale(1)' 
      }
    ],
    {
      duration: durations.slow,
      easing: easings.spring,
      fill: 'forwards'
    }
  );
  
  return animation.finished;
}

/**
 * Tooltip hide
 */
export async function hideTooltip(element) {
  const animation = element.animate(
    [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.9)' }
    ],
    {
      duration: durations.fast,
      easing: easings.out,
      fill: 'forwards'
    }
  );
  
  return animation.finished;
}
