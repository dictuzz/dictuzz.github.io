import { projects } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.featured-work');
    if (!board) return;

    // Clear existing static content if any (optional, or just append)
    board.innerHTML = '';

    projects.forEach((project, index) => {
        const card = document.createElement('article');
        card.className = 'experience';
        card.id = project.id;

        // Staggered positioning for the "Investigation Board" look
        // We can keep the random/staggered look via CSS nth-child, 
        // OR we can bake some random positions here if we wanted.
        // For now, we'll rely on the CSS grid/absolute positioning or just let them flow.

        card.innerHTML = `
            <div class="experience-content">
                <span class="experience-year">${project.year}</span>
                <h2 class="experience-title">${project.title}</h2>
                <span class="experience-category">${project.category}</span>
                <p class="experience-desc">${project.description}</p>
                
                <div class="experience-stats">
                    ${project.stats.map(stat => `<span class="stat-item">${stat}</span>`).join('')}
                </div>
            </div>
            <div class="experience-visual">
                <!-- Placeholder if image missing -->
                <div class="visual-placeholder" style="background-image: url('${project.image}'); background-size: cover; background-position: center;"></div>
            </div>
        `;

        board.appendChild(card);
    });

    // Re-trigger interactions/animations after loading
    if (window.initProofAnimations) window.initProofAnimations();
    if (window.initProofInteractions) window.initProofInteractions();
});
