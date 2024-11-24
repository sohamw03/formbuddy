import sharp from "sharp";
import { downFile } from "../down_file/route";

export async function POST(request: Request) {
  const body = await request.json();
  const { id, crop } = body;
  try {
    const response = (await downFile(id)) as Blob;
    const arrayBuffer = await response.arrayBuffer();

    const croppedBuffer = await sharp(arrayBuffer)
      .extract({
        width: Math.round(crop.width),
        height: Math.round(crop.height),
        left: Math.round(crop.x),
        top: Math.round(crop.y),
      })
      .toBuffer();
    const croppedArrayBuffer = croppedBuffer.buffer.slice(croppedBuffer.byteOffset, croppedBuffer.byteOffset + croppedBuffer.byteLength);

    const headers = new Headers();
    headers.set("Content-Type", response?.type! || "application/octet-stream");
    return new Response(croppedArrayBuffer, { status: 200, statusText: "OK", headers });
  } catch (error) {
    console.log(error);
    return Response.json({ status: false, message: "Error fetching content." }, { status: 500 });
  }
}
