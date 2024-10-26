import { getDriveClient } from "@/drivers/ConnectDrive";

export async function POST(request: Request) {
  const body = await request.json();
  const { id } = body;
  try {
    const response = (await downFile(id)) as Blob;
    const arrayBuffer = await response.arrayBuffer();
    const headers = new Headers();
    headers.set("Content-Type", response?.type! || "application/octet-stream");
    return new Response(arrayBuffer, { status: 200, statusText: "OK", headers });
  } catch (error) {
    console.log(error);
    return Response.json({ status: false, message: "Error fetching content." }, { status: 500 });
  }
}

export async function downFile(id: string): Promise<Blob | undefined> {
  const service = await getDriveClient();
  if (service) {
    try {
      const response = await service.files.get({
        fileId: id,
        alt: "media",
      });
      // console.log(response.data);
      return response.data as unknown as Blob;
    } catch (err) {
      console.log(err);
    }
  }
}
