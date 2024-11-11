import { downFile } from "../down_file/route";
import sharp from "sharp";

export async function POST(request: Request) {
  const body = await request.json();
  const { id, crop } = body;
  try {
    const response = (await downFile(id)) as Blob;
    const arrayBuffer = await response.arrayBuffer();

    const croppedBuffer = await sharp(arrayBuffer)
      .extract({
        width: Math.floor(crop.width),
        height: Math.floor(crop.height),
        left: Math.floor(crop.x),
        top: Math.floor(crop.y),
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
