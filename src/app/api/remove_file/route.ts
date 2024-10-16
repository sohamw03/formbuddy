import { getDriveClient } from "@/drivers/ConnectDrive";

export async function POST(request: Request) {
  const body = await request.json();
  const { id } = body;
  try {
    const response = await removeFile(id);
    return Response.json({ status: true, message: "File removed successfully" });
  } catch (error) {
    console.log(error);
    return Response.json({ status: false, message: "Error removing file" }, { status: 500 });
  }
}

export async function removeFile(id: string) {
  const service = await getDriveClient();
  if (service) {
    try {
      const response = await service.files.delete({
        fileId: id,
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}
