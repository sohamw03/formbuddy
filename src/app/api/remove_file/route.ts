import { getDriveClient } from "@/drivers/ConnectDrive";

export async function POST(request: Request) {
  const body = await request.json();
  const { id } = body;
  const service = await getDriveClient();
  if (service) {
    try {
      const response = await service.files.delete({
        fileId: id,
      });
      return Response.json(response);
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }
}
