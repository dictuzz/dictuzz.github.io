/**
 * CONSTELLATION LOADING & POLISH
 * Loading states, tooltips, and visual refinements
 */

/**
 * Create loading overlay
 */
export function createLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'constellation-loader';
  overlay.innerHTML = `
    <div class="loader-content">
      <div class="loader-spinner"></div>
      <p class="loader-text">Initializing constellation...</p>
    </div>
  `;
  
  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Remove loading overlay
 */
export async function removeLoadingOverlay() {
  const overlay = document.querySelector('.constellation-loader');
  if (!overlay) return;
  
  // Fade out
  overlay.style.opacity = '0';
  
  // Remove after transition
  setTimeout(() => {
    overlay.remove();
  }, 500);
}

/**
 * Create tooltip element
 */
export function createTooltip() {
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tooltip);
  return tooltip;
}

/**
 * Show tooltip for node
 */
export function showTooltipForNode(nodeElement, tooltip) {
  const title = nodeElement.querySelector('.node-title')?.textContent || '';
  const metadata = nodeElement.querySelector('.node-metadata')?.textContent || '';
  const nodeType = nodeElement.dataset.type || 'link';
  
  // Build tooltip content
  tooltip.innerHTML = `
    <h4>${title}</h4>
    <p class="tooltip-meta">${metadata}</p>
    <span class="tooltip-type">${nodeType}</span>
  `;
  
  // Position tooltip relative to node
  const rect = nodeElement.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  
  // Determine best position (prefer right, then left, then bottom)
  let left, top;
  const margin = 16;
  
  // Try right
  if (rect.right + tooltipRect.width + margin < window.innerWidth) {
    left = rect.right + margin;
    top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
  }
  // Try left
  else if (rect.left - tooltipRect.width - margin > 0) {
    left = rect.left - tooltipRect.width - margin;
    top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
  }
  // Bottom
  else {
    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    top = rect.bottom + margin;
  }
  
  // Ensure tooltip stays in viewport
  left = Math.max(margin, Math.min(window.innerWidth - tooltipRect.width - margin, left));
  top = Math.max(margin, Math.min(window.innerHeight - tooltipRect.height - margin, top));
  
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  tooltip.classList.add('visible');
  tooltip.setAttribute('aria-hidden', 'false');
}

/**
 * Hide tooltip
 */
export function hideTooltip(tooltip) {
  tooltip.classList.remove('visible');
  tooltip.setAttribute('aria-hidden', 'true');
}

/**
 * Add subtle particle effect on node hover (optional enhancement)
 */
export function createParticle(x, y, color) {
  const particle = document.createElement('div');
  particle.className = 'hover-particle';
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.background = color;
  document.body.appendChild(particle);
  
  // Animate and remove
  setTimeout(() => particle.remove(), 1000);
}
