/**
 * ACCESSIBILITY
 * Keyboard navigation, ARIA announcements, screen reader support
 */

let currentFocusedCluster = null;
let currentFocusedNode = null;

/**
 * Initialize ARIA live region
 */
export function initAriaLiveRegion() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.className = 'sr-only';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.appendChild(region);
  }
}

/**
 * Announce message to screen readers
 */
export function announce(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = message;
  }
}

/**
 * Initialize keyboard navigation for domains
 */
export function initKeyboardNav() {
  const domainNodes = document.querySelectorAll('.domain-node');
  
  domainNodes.forEach((domain, index) => {
    // Enter/Space: Expand cluster
    domain.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCluster(domain);
      }
      
      // Arrow keys: Navigate between domains
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = domainNodes[(index + 1) % domainNodes.length];
        next.focus();
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = domainNodes[(index - 1 + domainNodes.length) % domainNodes.length];
        prev.focus();
      }
      
      // Escape: Collapse current cluster
      if (e.key === 'Escape') {
        collapseCurrentCluster();
      }
    });
    
    // Focus: Expand cluster (like hover)
    domain.addEventListener('focus', () => {
      expandClusterForDomain(domain);
    });
    
    // Blur: Collapse cluster if focus leaves domain entirely
    domain.addEventListener('blur', (e) => {
      // Check if focus is moving to a node within this cluster
      setTimeout(() => {
        const clusterContent = domain.nextElementSibling;
        if (clusterContent && !clusterContent.contains(document.activeElement)) {
          if (currentFocusedCluster === domain) {
            collapseClusterForDomain(domain);
          }
        }
      }, 0);
    });
  });
  
  // Skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    });
  }
}

/**
 * Toggle cluster expansion (keyboard)
 */
function toggleCluster(domainNode) {
  const isExpanded = domainNode.getAttribute('aria-expanded') === 'true';
  
  if (isExpanded) {
    collapseClusterForDomain(domainNode);
  } else {
    expandClusterForDomain(domainNode);
  }
}

/**
 * Expand cluster for domain
 */
export function expandClusterForDomain(domainNode) {
  const clusterId = domainNode.getAttribute('aria-controls');
  const clusterContent = document.getElementById(clusterId);
  
  if (!clusterContent) return;
  
  // Update ARIA
  domainNode.setAttribute('aria-expanded', 'true');
  clusterContent.removeAttribute('hidden');
  
  // Get cluster info
  const domainLabel = domainNode.querySelector('.domain-label').textContent;
  const nodeCount = clusterContent.querySelectorAll('.content-node').length;
  
  // Announce to screen readers
  announce(`${domainLabel} expanded. ${nodeCount} link${nodeCount !== 1 ? 's' : ''} available. Press Escape to collapse.`);
  
  currentFocusedCluster = domainNode;
  
  // Dispatch custom event for visual layer
  domainNode.dispatchEvent(new CustomEvent('cluster:expand', { 
    bubbles: true,
    detail: { domainId: domainNode.dataset.domain }
  }));
}

/**
 * Collapse cluster for domain
 */
export function collapseClusterForDomain(domainNode) {
  const clusterId = domainNode.getAttribute('aria-controls');
  const clusterContent = document.getElementById(clusterId);
  
  if (!clusterContent) return;
  
  // Update ARIA
  domainNode.setAttribute('aria-expanded', 'false');
  clusterContent.setAttribute('hidden', '');
  
  // Announce to screen readers
  const domainLabel = domainNode.querySelector('.domain-label').textContent;
  announce(`${domainLabel} collapsed.`);
  
  if (currentFocusedCluster === domainNode) {
    currentFocusedCluster = null;
  }
  
  // Dispatch custom event for visual layer
  domainNode.dispatchEvent(new CustomEvent('cluster:collapse', { 
    bubbles: true,
    detail: { domainId: domainNode.dataset.domain }
  }));
}

/**
 * Collapse current focused cluster
 */
function collapseCurrentCluster() {
  if (currentFocusedCluster) {
    collapseClusterForDomain(currentFocusedCluster);
    currentFocusedCluster.focus();
  }
}

/**
 * Initialize content node keyboard support
 */
export function initNodeKeyboardNav() {
  const contentNodes = document.querySelectorAll('.content-node');
  
  contentNodes.forEach(node => {
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        // Find parent domain and collapse
        const domainNode = node.closest('li').querySelector('.domain-node');
        if (domainNode) {
          collapseClusterForDomain(domainNode);
          domainNode.focus();
        }
      }
    });
    
    // On focus, announce node details
    node.addEventListener('focus', () => {
      const title = node.querySelector('.node-title')?.textContent || '';
      const metadata = node.querySelector('.node-metadata')?.textContent || '';
      
      currentFocusedNode = node;
      announce(`${title}. ${metadata}. Press Enter to open.`);
      
      // Dispatch event for tooltip
      node.dispatchEvent(new CustomEvent('node:focus', { 
        bubbles: true 
      }));
    });
    
    node.addEventListener('blur', () => {
      if (currentFocusedNode === node) {
        currentFocusedNode = null;
      }
      
      node.dispatchEvent(new CustomEvent('node:blur', { 
        bubbles: true 
      }));
    });
  });
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize all accessibility features
 */
export function initAccessibility() {
  initAriaLiveRegion();
  initKeyboardNav();
  initNodeKeyboardNav();
  
  // Announce page ready
  setTimeout(() => {
    announce('Constellation loaded. Use Tab to navigate between categories, Enter to expand, Escape to collapse.');
  }, 1000);
}
