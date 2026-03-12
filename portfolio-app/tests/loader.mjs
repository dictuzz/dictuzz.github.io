import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

export async function resolve(specifier, context, nextResolve) {
  // Resolve `@/` paths to relative paths from the project root and add `.ts` extension
  if (specifier.startsWith('@/')) {
    const relativePath = specifier.replace(/^@\//, './');
    const absolutePath = path.resolve(projectRoot, relativePath) + '.ts';
    const newSpecifier = 'file://' + absolutePath;
    return nextResolve(newSpecifier, context);
  }

  // Handle local relative imports that omit the `.ts` extension
  if (specifier.startsWith('.') && !specifier.endsWith('.ts') && !specifier.endsWith('.tsx') && !specifier.endsWith('.js')) {
    try {
      return await nextResolve(specifier + '.ts', context);
    } catch (e) {
      // Fallback
    }
  }

  return nextResolve(specifier, context);
}
