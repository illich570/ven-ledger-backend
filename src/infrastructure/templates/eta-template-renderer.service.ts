import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Eta } from 'eta';

import { AppError } from '#infrastructure/app-error.js';

import type { TemplateRendererPort } from '../../domain/ports/template-renderer.port.js';

function resolveViewsDirectory(overridePath?: string): string {
  // Relative to this file — works in both tsx (src) and compiled (dist) if
  // the views folder lives alongside the JS output (which is the case when
  // the runner stage copies src/ into /app/src — see Dockerfile).
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

  // Fallbacks anchored to cwd so any working-directory convention works.
  const candidates: string[] = [
    ...(overridePath ? [path.resolve(overridePath)] : []),
    path.join(currentDirectory, 'views'),
    path.join(process.cwd(), 'src', 'infrastructure', 'templates', 'views'),
    path.join(process.cwd(), 'dist', 'infrastructure', 'templates', 'views'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new AppError(
    `Eta views directory not found. Tried:\n${candidates.map(c => `  - ${c}`).join('\n')}`,
    500,
  );
}

export class EtaTemplateRendererService implements TemplateRendererPort {
  private readonly eta: Eta;

  constructor(viewsDirectory?: string) {
    this.eta = new Eta({ views: resolveViewsDirectory(viewsDirectory) });
  }

  async render(
    templatePath: string,
    data: Record<string, unknown>,
  ): Promise<string> {
    const html = await this.eta.renderAsync(templatePath, data);
    if (!html) {
      throw new AppError('Failed to render document template', 500);
    }
    return html;
  }
}
