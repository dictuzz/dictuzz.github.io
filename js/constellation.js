/**
 * CONSTELLATION MAIN
 * Initialize and orchestrate the constellation experience
 */

import { PhysicsEngine, PhysicsNode, PhysicsLink } from './physics-engine.js';
import { expandNode, collapseNode, fadeIn, startBreathing } from './animations.js';
import { initAccessibility, announce, prefersReducedMotion, expandClusterForDomain, collapseClusterForDomain } from './accessibility.js';
import { createLoadingOverlay, removeLoadingOverlay, createTooltip, showTooltipForNode, hideTooltip } from './polish.js';

let engine = null;
let canvas = null;
let ctx = null;
let expandedCluster = null;
let tooltip = null;

/**
 * Initialize constellation
 */
async function init() {
  // Show loading overlay
  const loader = createLoadingOverlay();
  
  // Check if reduced motion is preferred
  if (prefersReducedMotion()) {
    console.log('Reduced motion detected - using fallback layout');
    await removeLoadingOverlay();
    initFallbackExperience();
    return;
  }
  
  // Initialize accessibility first
  initAccessibility();
  
  // Setup canvas
  setupCanvas();
  
  // Initialize physics engine
  engine = new PhysicsEngine({
    gravity: 0.02,
    damping: 0.85,
    boundaryForce: 0.1
  });
  
  // Create physics nodes
  await createConstellationNodes();
  
  // Setup interactions
  setupInteractions();
  
  // Create tooltip
  tooltip = createTooltip();
  
  // Remove loading overlay
  await removeLoadingOverlay();
  
  // Start physics simulation
  engine.start();
  
  // Start ambient drift
  startAmbientDrift();
  
  // Render connection lines
  startConnectionRenderer();
  
  // Handle window resize
  window.addEventListener('resize', debounce(handleResize, 250));
  
  console.log('Constellation initialized');
}

/**
 * Setup canvas for connection lines
 */
function setupCanvas() {
  canvas = document.getElementById('constellation-canvas');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

/**
 * Create physics nodes for constellation
 */
async function createConstellationNodes() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // Identity core (fixed center)
  const identityElement = document.querySelector('.identity-core');
  const identityNode = new PhysicsNode('identity', centerX, centerY, 200, true);
  identityNode.element = identityElement;
  engine.addNode(identityNode);
  
  // Start breathing animation on avatar
  const avatarImg = identityElement.querySelector('.identity-avatar img');
  if (avatarImg) {
    startBreathing(avatarImg, 0.05);
  }
  
  // Domain nodes (orbital positions with variation to break symmetry)
  const domainElements = document.querySelectorAll('.domain-node');
  const angles = [
    30,   // Data Science - upper right
    150,  // Creative - lower right
    270   // Leadership - left
  ];
  
  domainElements.forEach((element, index) => {
    const domainId = element.dataset.domain;
    
    // Use predefined angles with slight randomization
    const baseAngle = angles[index % angles.length];
    const angleVariation = (Math.random() - 0.5) * 20; // ±10 degrees
    const angle = (baseAngle + angleVariation) * (Math.PI / 180);
    
    // Vary radius slightly to break perfect circle
    const baseRadius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
    const radiusVariation = (Math.random() - 0.5) * 40; // ±20px
    const radius = baseRadius + radiusVariation;
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    // Create physics node
    const node = new PhysicsNode(domainId, x, y, 100, false);
    node.element = element;
    engine.addNode(node);
    
    // Create link to identity core
    engine.addLink(new PhysicsLink(identityNode, node, 0.3, baseRadius));
    
    // Position element initially
    element.style.position = 'absolute';
    element.style.left = '0';
    element.style.top = '0';
    element.style.transform = `translate(${x}px, ${y}px)`;
    
    // Fade in with slight delay
    element.style.opacity = '0';
    setTimeout(() => fadeIn(element, 500), index * 100);
  });
}

/**
 * Setup mouse/keyboard interactions
 */
function setupInteractions() {
  const domainElements = document.querySelectorAll('.domain-node');
  
  domainElements.forEach(domainElement => {
    // Mouse hover: Expand cluster
    domainElement.addEventListener('mouseenter', () => {
      if (!prefersReducedMotion()) {
        expandNode(domainElement, 1.15);
      }
      expandCluster(domainElement);
    });
    
    domainElement.addEventListener('mouseleave', () => {
      if (!prefersReducedMotion()) {
        collapseNode(domainElement);
      }
      collapseCluster(domainElement);
    });
    
    // Listen for keyboard events (from accessibility.js)
    domainElement.addEventListener('cluster:expand', () => {
      expandCluster(domainElement);
    });
    
    domainElement.addEventListener('cluster:collapse', () => {
      collapseCluster(domainElement);
    });
  });
  
  // Content node interactions
  const contentNodes = document.querySelectorAll('.content-node');
  contentNodes.forEach(nodeElement => {
    nodeElement.addEventListener('mouseenter', () => {
      if (!prefersReducedMotion()) {
        expandNode(nodeElement, 1.3);
      }
      if (tooltip) {
        showTooltipForNode(nodeElement, tooltip);
      }
    });
    
    nodeElement.addEventListener('mouseleave', () => {
      if (!prefersReducedMotion()) {
        collapseNode(nodeElement);
      }
      if (tooltip) {
        hideTooltip(tooltip);
      }
    });
    
    // Keyboard focus events
    nodeElement.addEventListener('node:focus', () => {
      if (tooltip) {
        showTooltipForNode(nodeElement, tooltip);
      }
    });
    
    nodeElement.addEventListener('node:blur', () => {
      if (tooltip) {
        hideTooltip(tooltip);
      }
    });
  });
}

/**
 * Expand cluster (show satellite nodes)
 */
function expandCluster(domainElement) {
  const clusterId = domainElement.getAttribute('aria-controls');
  const clusterContent = document.getElementById(clusterId);
  
  if (!clusterContent) return;
  if (expandedCluster === domainElement) return; // Already expanded
  
  // Collapse previous cluster if any
  if (expandedCluster && expandedCluster !== domainElement) {
    collapseCluster(expandedCluster);
  }
  
  expandedCluster = domainElement;
  
  // Show cluster content
  clusterContent.removeAttribute('hidden');
  
  // Get domain physics node
  const domainId = domainElement.dataset.domain;
  const domainNode = engine.findNode(domainId);
  
  if (!domainNode) return;
  
  // Position content nodes in orbit around domain
  const contentNodes = clusterContent.querySelectorAll('.content-node');
  const satelliteRadius = 120;
  
  contentNodes.forEach((nodeElement, index) => {
    const angle = (index / contentNodes.length) * Math.PI * 2 - Math.PI / 2;
    const x = domainNode.x + Math.cos(angle) * satelliteRadius;
    const y = domainNode.y + Math.sin(angle) * satelliteRadius;
    
    // Position element
    nodeElement.style.position = 'absolute';
    nodeElement.style.left = '0';
    nodeElement.style.top = '0';
    nodeElement.style.transform = `translate(${x}px, ${y}px)`;
    nodeElement.style.opacity = '0';
    
    // Animate in with stagger
    setTimeout(() => {
      fadeIn(nodeElement, 300);
    }, index * 50);
  });
}

/**
 * Collapse cluster (hide satellite nodes)
 */
function collapseCluster(domainElement) {
  const clusterId = domainElement.getAttribute('aria-controls');
  const clusterContent = document.getElementById(clusterId);
  
  if (!clusterContent) return;
  
  // Hide cluster content
  setTimeout(() => {
    clusterContent.setAttribute('hidden', '');
  }, 200);
  
  if (expandedCluster === domainElement) {
    expandedCluster = null;
  }
}

/**
 * Render connection lines on canvas with curves and gradients
 */
function renderConnections() {
  if (!ctx || !canvas) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Get identity node
  const identityNode = engine.findNode('identity');
  if (!identityNode) return;
  
  // Draw curved lines from identity to each domain
  engine.nodes.forEach(node => {
    if (node.id === 'identity') return;
    
    // Check if node is in viewport (culling)
    if (!isInViewport(node)) return;
    
    const opacity = expandedCluster && expandedCluster.dataset.domain === node.id ? 0.6 : 0.2;
    const color = expandedCluster && expandedCluster.dataset.domain === node.id 
      ? expandedCluster.dataset.color 
      : '#404654';
    
    // Create gradient along line
    const gradient = ctx.createLinearGradient(
      identityNode.x, identityNode.y,
      node.x, node.y
    );
    gradient.addColorStop(0, `rgba(64, 70, 84, ${opacity * 0.3})`);
    gradient.addColorStop(0.5, `rgba(64, 70, 84, ${opacity})`);
    gradient.addColorStop(1, hexToRgba(color, opacity));
    
    // Draw curved path
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Calculate curve control point (slight bow)
    const midX = (identityNode.x + node.x) / 2;
    const midY = (identityNode.y + node.y) / 2;
    const dx = node.x - identityNode.x;
    const dy = node.y - identityNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const bowAmount = distance * 0.1;
    
    // Perpendicular offset for curve
    const offsetX = -dy / distance * bowAmount;
    const offsetY = dx / distance * bowAmount;
    
    ctx.moveTo(identityNode.x, identityNode.y);
    ctx.quadraticCurveTo(
      midX + offsetX, midY + offsetY,
      node.x, node.y
    );
    ctx.stroke();
    
    // Add subtle glow on expanded cluster connections
    if (expandedCluster && expandedCluster.dataset.domain === node.id) {
      ctx.strokeStyle = hexToRgba(color, opacity * 0.3);
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });
}

/**
 * Check if node is in viewport (with margin)
 */
function isInViewport(node, margin = 100) {
  return node.x > -margin && 
         node.x < canvas.width + margin &&
         node.y > -margin && 
         node.y < canvas.height + margin;
}

/**
 * Convert hex color to rgba
 */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Start connection line renderer
 */
function startConnectionRenderer() {
  function render() {
    renderConnections();
    requestAnimationFrame(render);
  }
  render();
}

/**
 * Start ambient drift animation
 */
function startAmbientDrift() {
  function drift() {
    engine.addRandomImpulse();
    setTimeout(drift, 3000 + Math.random() * 4000);
  }
  
  setTimeout(drift, 3000);
}

/**
 * Handle window resize
 */
function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  engine.resize();
}

/**
 * Fallback experience (no physics/animations)
 */
function initFallbackExperience() {
  initAccessibility();
  
  // Simple accordion functionality
  const domainElements = document.querySelectorAll('.domain-node');
  domainElements.forEach(domain => {
    domain.addEventListener('click', () => {
      const clusterId = domain.getAttribute('aria-controls');
      const clusterContent = document.getElementById(clusterId);
      const isExpanded = domain.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        collapseClusterForDomain(domain);
      } else {
        expandClusterForDomain(domain);
      }
    });
  });
  
  console.log('Fallback experience initialized');
}

/**
 * Debounce utility
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Initialize on DOM ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
