import type { DocumentRepository } from '../../domain/ports/document-repository.port.js';
import type { FileStoragePort } from '../../domain/ports/file-storage.port.js';
import type { PdfGeneratorPort } from '../../domain/ports/pdf-generator.port.js';
import type { TemplateRendererPort } from '../../domain/ports/template-renderer.port.js';

export interface GenerateDocumentUseCaseInput {
  documentHolderId: string;
  createdBy: string;
  templateData: {
    title: string;
  };
}

export class GenerateDocumentUseCase {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly pdfGenerator: PdfGeneratorPort,
    private readonly templateRenderer: TemplateRendererPort,
    private readonly fileStorage: FileStoragePort,
    private readonly bucketName: string,
  ) {}
  async execute(input: GenerateDocumentUseCaseInput): Promise<object> {
    const keyName = `${input.documentHolderId}-${input.createdBy}.pdf`;

    const html = await this.templateRenderer.render(
      'document-testing.eta',
      input.templateData,
    );

    const pdfBuffer = await this.pdfGenerator.htmlToPdf({ html });

    await this.fileStorage.putObject({
      bucket: this.bucketName,
      key: keyName,
      body: pdfBuffer,
      contentType: 'application/pdf',
    });

    return this.documentRepository.create({
      holderId: input.documentHolderId,
      typeId: 1, //CAMBIAR
      keyName: keyName,
      categoryId: 1,
      createdBy: input.createdBy,
    });
  }
}
