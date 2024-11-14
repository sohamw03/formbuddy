import { getDriveClient } from "@/drivers/ConnectDrive";

export async function POST(request: Request) {
  const body = await request.json();
  const { id } = body;
  try {
    const response = await getFile(id);
    return Response.json({ status: true, data: response?.data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ status: false, message: "Error fetching content." }, { status: 500 });
  }
}

export async function getFile(id: string) {
  const service = await getDriveClient();
  if (service) {
    try {
      const response = await service.files.get({
        fileId: id,
      });
      // console.log(response.data);
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}
