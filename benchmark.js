const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push({ x: Math.random() * 1000, y: Math.random() * 1000, color: 'red' });
}

function original() {
    let count = 0;
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) count++;
        });
    });
    return count;
}

function optimized() {
    let count = 0;
    const len = particles.length;
    for (let i = 0; i < len; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < len; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) count++;
        }
    }
    return count;
}

const ITERATIONS = 10000;

console.time('original');
for (let i = 0; i < ITERATIONS; i++) {
    original();
}
console.timeEnd('original');

console.time('optimized');
for (let i = 0; i < ITERATIONS; i++) {
    optimized();
}
console.timeEnd('optimized');
