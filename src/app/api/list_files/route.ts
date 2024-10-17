import { getDriveClient } from "@/drivers/ConnectDrive";

export async function POST(request: Request) {
  const { folder } = await request.json();
  try {
    const files = await listFiles(folder);
    return Response.json({ status: true, files: files });
  } catch (error) {
    console.log(error);
    return Response.json({ status: false, message: "Error listing files" }, { status: 500 });
  }
}

export async function listFiles(folder: string) {
  if (folder === undefined || folder === "") folder = "";
  else folder = "/" + folder;

  const service = await getDriveClient();
  if (service) {
    try {
      const res = await service.files.list({
        spaces: `appDataFolder`,
        fields: "nextPageToken, files(id, name, mimeType, parents)",
        pageSize: 100,
      });
      console.log(res.data.files);
      return res.data.files;
    } catch (error) {
      throw error;
    }
  }
}
