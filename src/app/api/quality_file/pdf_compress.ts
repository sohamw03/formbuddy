import { CompressionLevel, CompressPDFJob, CompressPDFParams, CompressPDFResult, MimeType, PDFServices, ServicePrincipalCredentials } from "@adobe/pdfservices-node-sdk";
import { Readable } from "stream";

export async function compressPDF(fileBuffer: ArrayBuffer, quality: number): Promise<ArrayBuffer> {
  try {
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID!,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET!,
    });

    const pdfServices = new PDFServices({ credentials });

    // Convert ArrayBuffer to Readable stream
    const readStream = Readable.from(Buffer.from(fileBuffer));

    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF,
    });

    // Determine compression level based on quality (reversed)
    let compressionLevel;
    if (quality <= 33) {
      compressionLevel = CompressionLevel.LOW;
    } else if (quality <= 66) {
      compressionLevel = CompressionLevel.MEDIUM;
    } else {
      compressionLevel = CompressionLevel.HIGH;
    }

    const params = new CompressPDFParams({ compressionLevel });
    const job = new CompressPDFJob({ inputAsset, params });

    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: CompressPDFResult,
    });

    if (!pdfServicesResponse.result) {
      throw new Error('PDF compression result is null');
    }
    const resultAsset = pdfServicesResponse.result.asset;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });

    // Convert stream to ArrayBuffer
    const chunks: Buffer[] = [];
    for await (const chunk of streamAsset.readStream) {
      if (typeof chunk === 'string') {
        chunks.push(Buffer.from(chunk));
      } else {
        chunks.push(chunk);
      }
    }

    return Buffer.concat(chunks).buffer;
  } catch (error) {
    console.error('PDF compression error:', error);
    throw error;
  }
}
