export interface TemplateRendererPort {
  render(template: string, data: Record<string, unknown>): Promise<string>;
}
