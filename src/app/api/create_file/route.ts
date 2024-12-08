import { getDriveClient } from "@/drivers/ConnectDrive";
import { Readable } from "stream";
import sharp from "sharp";

export async function POST(request: Request) {
  const formData = await request.formData();
  const { name, folder_id, content, is_reso_variant, is_qual_variant, quality } = Object.fromEntries(formData) as {
    name: string;
    folder_id: string;
    content: File;
    is_reso_variant: string;
    is_qual_variant: string;
    quality?: string;
  };

  // Convert File object to a readable stream
  const arrayBuffer = await content.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);
  const readableStream = new Readable();
  readableStream._read = () => {}; // No-op
  readableStream.push(buffer);
  readableStream.push(null); // End of stream

  // Deconflict file name with different resolution naming system; there shouldn't be _r_1920x1080 at the end of the file name
  let deconName = name;
  if (name.match(/(_r_\d+x\d+|_q_\d+)\.(\w+)$/)) {
    deconName = name.split(/(_r_|_q_)/)[0] + "." + name.split(".").pop();
  }

  if (is_qual_variant === "true" && quality) {
    deconName = deconName.split(".")[0] + `_q_${quality}.` + deconName.split(".").pop();
  } else if (is_reso_variant === "true") {
    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;
    deconName = deconName.split(".")[0] + `_r_${width}x${height}.` + deconName.split(".").pop();
  }

  const service = await getDriveClient();
  if (service) {
    const fileMetadata = {
      name: deconName,
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

      return Response.json({ id: file.data.id });
    } catch (err) {
      throw err;
    }
  }
}
