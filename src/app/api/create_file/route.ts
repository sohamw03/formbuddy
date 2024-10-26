import { getDriveClient } from "@/drivers/ConnectDrive";
import { Readable } from "stream";

export async function POST(request: Request) {
  const formData = await request.formData();
  const { name, folder_id, content } = Object.fromEntries(formData) as {
    name: string;
    folder_id: string;
    content: File;
  };
  // Convert File object to a readable stream
  const arrayBuffer = await content.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const readableStream = new Readable();
  readableStream._read = () => {}; // No-op
  readableStream.push(buffer);
  readableStream.push(null); // End of stream

  const service = await getDriveClient();
  if (service) {
    const fileMetadata = {
      name: name,
      parents: [folder_id],
    };
    const media = {
      body: readableStream,
      mimeType: content.type,
    };
    try {
      const file = await service.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });
      console.log("File Id:", file.data.id);
      return Response.json({ id: file.data.id });
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }
}
