import sharp from "sharp";
import { downFile } from "../down_file/route";

export async function POST(request: Request) {
  const body = await request.json();
  const { id, quality } = body;

  const imageQuality = Math.round(Math.max(0, Math.min(quality, 100)));

  try {
    const response = (await downFile(id)) as Blob;
    const arrayBuffer = await response.arrayBuffer();

    const processedBuffer = await sharp(arrayBuffer)
      .jpeg({
        quality: imageQuality,
        chromaSubsampling: "4:4:4",
        trellisQuantisation: true,
        overshootDeringing: true,
        optimizeScans: true,
      })
      .toBuffer();
    const processedArrayBuffer = processedBuffer.buffer.slice(processedBuffer.byteOffset, processedBuffer.byteOffset + processedBuffer.byteLength);

    const headers = new Headers();
    headers.set("Content-Type", response?.type! || "application/octet-stream");
    return new Response(processedArrayBuffer, { status: 200, statusText: "OK", headers });
  } catch (error) {
    console.log(error);
    return Response.json({ status: false, message: "Error fetching content." }, { status: 500 });
  }
}
