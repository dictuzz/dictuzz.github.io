/**
 * PHYSICS ENGINE
 * Custom force-directed graph simulation
 */

export class PhysicsNode {
  constructor(id, x, y, mass, fixed = false) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = 0; // velocity x
    this.vy = 0; // velocity y
    this.mass = mass;
    this.fixed = fixed;
    this.element = null; // DOM reference
  }
  
  applyForce(fx, fy) {
    if (this.fixed) return;
    this.vx += fx / this.mass;
    this.vy += fy / this.mass;
  }
  
  update(damping = 0.85) {
    if (this.fixed) return;
    
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    
    // Apply damping
    this.vx *= damping;
    this.vy *= damping;
    
    // Stop if velocity is tiny (optimization)
    if (Math.abs(this.vx) < 0.01) this.vx = 0;
    if (Math.abs(this.vy) < 0.01) this.vy = 0;
  }
}

export class PhysicsLink {
  constructor(source, target, strength = 0.3, restLength = 100) {
    this.source = source;
    this.target = target;
    this.strength = strength;
    this.restLength = restLength;
  }
}

export class PhysicsEngine {
  constructor(config = {}) {
    this.nodes = [];
    this.links = [];
    this.gravity = config.gravity || 0.02;
    this.damping = config.damping || 0.85;
    this.boundaryForce = config.boundaryForce || 0.1;
    this.running = false;
    this.rafId = null;
  }
  
  addNode(node) {
    this.nodes.push(node);
    return node;
  }
  
  addLink(link) {
    this.links.push(link);
    return link;
  }
  
  findNode(id) {
    return this.nodes.find(n => n.id === id);
  }
  
  tick() {
    // Apply spring forces along links
    this.links.forEach(link => {
      const dx = link.target.x - link.source.x;
      const dy = link.target.y - link.source.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Spring force: F = k * (distance - restLength)
      const force = (distance - link.restLength) * link.strength;
      
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      
      link.source.applyForce(fx, fy);
      link.target.applyForce(-fx, -fy);
    });
    
    // Apply boundary repulsion
    const margin = 80;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.nodes.forEach(node => {
      if (node.fixed) return;
      
      // Left boundary
      if (node.x < margin) {
        node.applyForce((margin - node.x) * this.boundaryForce, 0);
      }
      // Right boundary
      if (node.x > width - margin) {
        node.applyForce((width - margin - node.x) * this.boundaryForce, 0);
      }
      // Top boundary
      if (node.y < margin) {
        node.applyForce(0, (margin - node.y) * this.boundaryForce);
      }
      // Bottom boundary
      if (node.y > height - margin) {
        node.applyForce(0, (height - margin - node.y) * this.boundaryForce);
      }
    });
    
    // Node collision (prevent overlap)
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeA = this.nodes[i];
        const nodeB = this.nodes[j];
        
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDistance = 60; // Minimum separation
        
        if (distance < minDistance) {
          const force = (minDistance - distance) * 0.05;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          nodeA.applyForce(-fx, -fy);
          nodeB.applyForce(fx, fy);
        }
      }
    }
    
    // Update all node positions
    this.nodes.forEach(node => node.update(this.damping));
    
    // Update DOM positions
    this.updateDOM();
  }
  
  updateDOM() {
    this.nodes.forEach(node => {
      if (node.element) {
        node.element.style.transform = `translate(${node.x}px, ${node.y}px)`;
      }
    });
  }
  
  start() {
    if (this.running) return;
    this.running = true;
    
    const animate = () => {
      if (!this.running) return;
      
      this.tick();
      this.rafId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  // Add random impulse for ambient drift
  addRandomImpulse() {
    if (this.nodes.length === 0) return;
    
    const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    if (randomNode.fixed) return;
    
    const angle = Math.random() * Math.PI * 2;
    const force = 0.5;
    
    randomNode.applyForce(
      Math.cos(angle) * force,
      Math.sin(angle) * force
    );
  }
  
  // Resize handler
  resize() {
    // Re-center identity core
    const centerNode = this.findNode('identity');
    if (centerNode) {
      centerNode.x = window.innerWidth / 2;
      centerNode.y = window.innerHeight / 2;
    }
    
    // Ensure all nodes are within new bounds
    this.nodes.forEach(node => {
      node.x = Math.max(80, Math.min(window.innerWidth - 80, node.x));
      node.y = Math.max(80, Math.min(window.innerHeight - 80, node.y));
    });
  }
}
