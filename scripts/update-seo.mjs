import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const files = {
  'index.html': 'Discover the professional portfolio and curated resources of Benedictus Richard Ricardo (dictuzz). Exploring software engineering, data analytics, and digital optimization.',
  'resume/index.html': 'Professional resume of Benedictus Richard Ricardo. View my experience in tech support, data analysis, and software engineering, along with my technical skills and educational background.',
  'portfolio/index.html': 'Explore the technical portfolio of Benedictus Richard Ricardo. Featuring projects in web development, data analytics, and system optimization.',
  'resources/index.html': 'A comprehensive, curated directory of digital resources, software guides, and privacy tools compiled by Benedictus Richard Ricardo (dictuzz).'
};

for (const [file, desc] of Object.entries(files)) {
  let p = path.join(root, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`);
    content = content.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${desc}">`);
    fs.writeFileSync(p, content);
    console.log('Updated SEO for', file);
  }
}
