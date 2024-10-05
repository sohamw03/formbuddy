import { getDriveClient } from "@/drivers/ConnectDrive";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, content } = body;
  const service = await getDriveClient();
  if (service) {
    const fileMetadata = {
      name: name,
      parents: ["appDataFolder"],
    };
    const media = {
      body: content,
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
