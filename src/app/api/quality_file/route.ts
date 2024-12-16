import sharp from "sharp";
import { downFile } from "../down_file/route";
import { compressPDF } from "./pdf_compress";

export async function POST(request: Request) {
  const body = await request.json();
  const { id, quality } = body;

  const compressionQuality = Math.round(Math.max(0, Math.min(quality, 100)));

  try {
    const response = (await downFile(id)) as Blob;
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response?.type || "application/octet-stream";

    let processedArrayBuffer: ArrayBuffer;

    if (contentType === "application/pdf") {
      processedArrayBuffer = await compressPDF(arrayBuffer, compressionQuality);
    } else {
      // Handle image compression
      const processedBuffer = await sharp(arrayBuffer)
        .jpeg({
          quality: compressionQuality,
          chromaSubsampling: "4:4:4",
          trellisQuantisation: true,
          overshootDeringing: true,
          optimizeScans: true,
        })
        .toBuffer();
      processedArrayBuffer = (processedBuffer.buffer as ArrayBuffer).slice(
        processedBuffer.byteOffset,
        processedBuffer.byteOffset + processedBuffer.byteLength
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    return new Response(processedArrayBuffer, { status: 200, statusText: "OK", headers });
  } catch (error) {
    console.log(error);
    return Response.json({ status: false, message: "Error processing file." }, { status: 500 });
  }
}
