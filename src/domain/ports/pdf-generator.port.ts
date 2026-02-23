export interface PdfGeneratorPort {
  htmlToPdf(params: {
    html: string;
    headerTemplate?: string;
    footerTemplate?: string;
  }): Promise<Buffer>;
}
