import { getDriveClient } from "@/drivers/ConnectDrive";

export async function POST() {
  const service = await getDriveClient();
  if (service) {
    const fileMetadata = {
      name: "config.json",
      parents: ["appDataFolder"],
    };
    const media = {
      mimeType: "application/json",
      body: "Hello World",
    };
    try {
      const res = await service.files.list({
        spaces: "appDataFolder",
        fields: "nextPageToken, files(id, name)",
        pageSize: 100,
      });
      (res.data.files as Array<object>).forEach(function (file: any) {
        console.log("Found file:", file.name, file.id);
      });
      return Response.json({ files: res.data.files });
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }
}
