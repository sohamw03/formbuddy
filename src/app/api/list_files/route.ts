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
      console.log(res.data.files);
      return Response.json({ files: res.data.files });
    } catch (err) {
      console.error(err);
      return Response.json({ error: `Error: ${err}` }, { status: 500 });
    }
  }
}
