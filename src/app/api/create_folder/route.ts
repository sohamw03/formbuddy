import { getDriveClient } from "@/drivers/ConnectDrive";

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;
  try {
    const folderId = await createFolder(name);
    return Response.json({ id: folderId });
  } catch (error) {
    console.log(error);
  }
}

export async function createFolder(name: string) {
  const service = await getDriveClient();
  if (service) {
    const fileMetadata = {
      name: name,
      mimeType: "application/vnd.google-apps.folder",
      parents: ["appDataFolder"],
    };
    try {
      const folder = await service.files.create({
        requestBody: fileMetadata,
        fields: "id",
      });
      console.log("Folder Id:", folder.data.id);
      return folder.data.id;
    } catch (error) {
      console.log(error);
    }
  }
}
