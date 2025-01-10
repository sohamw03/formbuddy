import { downFile } from "../down_file/route";

export async function POST(request: Request) {
  const body = await request.json();
  const { id, format } = body;
  try {
    const response = (await downFile(id)) as Blob;
    const arrayBuffer = await response.arrayBuffer();

    // TODO: Implement image format conversion
    
    const headers = new Headers();
    headers.set("Content-Type", response?.type! || "application/octet-stream");
    return new Response("croppedArrayBuffer", { status: 200, statusText: "OK", headers });
  } catch (error) {
    console.log(error);
    return Response.json({ status: false, message: "Error fetching content." }, { status: 500 });
  }
}
