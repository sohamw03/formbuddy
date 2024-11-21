import { getDriveClient } from "@/drivers/ConnectDrive";
import { type drive_v3 } from "@googleapis/drive";

export async function POST(request: Request) {
  try {
    const files = (await listFiles()) as drive_v3.Schema$File[];

    // Consolidate the files by adding the variants
    const consFiles = files?.map((file: drive_v3.Schema$File) => {
      // Files that do not have _r_1920x1080 in their name are considered the original file
      let variants: string[] = [];
      if (!file.name?.match(/_r_\d+x\d+\.(\w+)$/) && file.mimeType?.includes("image")) {
        variants = files.filter((f) => f.name?.includes(file.name?.split(".").slice(0, -1).join(".") as string) && f.name !== file.name && f.name?.match(/_r_\d+x\d+\.(\w+)$/)).map((f) => f.id as string);
      }
      const consFile = { ...file, variants };
      return consFile as File;
    });

    return Response.json({ status: true, files: consFiles });
  } catch (error) {
    console.log(error);
    return Response.json({ status: false, message: "Error listing files" }, { status: 500 });
  }
}

export async function listFiles() {
  const service = await getDriveClient();
  if (service) {
    try {
      const res = await service.files.list({
        spaces: `appDataFolder`,
        fields: "nextPageToken, files(id, name, mimeType, parents, thumbnailLink)",
        pageSize: 100,
      });
      // console.log(res.data.files);
      return res.data.files;
    } catch (error) {
      throw error;
    }
  }
}

type File = {
  name: string;
  id: string;
  mimeType: string;
  parents: string[];
  thumbnailLink: string;
  blobURL: string;
  variants: string[];
};

// {
//     "name": "Screenshot 2024-04-20 012248 [1663x923].png",
//     "id": "1hog0CcMNILN4Aqu7HGEeQXRk5bwtWJ63wsp4Xz_KSC4DObnQFQ",
//     "mimeType": "image/png",
//     "parents": [
//         "1ul4lEqw83_cNaPHZDJyPEviVYrR2X4TIbgYNuUREmpJTekdnyw"
//     ],
//     "thumbnailLink": "https://lh3.googleusercontent.com/drive-storage/AJQWtBOkFp6C8gQX2jPSdSeDfs7TTVzHbbTXrXeIpj1eZ894opWUB9mRfk1qtCTW4PEaeIGMVgHHfSaa64_p3wYdpfUBbYB9lp2Yw6JEB1Gm1od2pZLkJ6MHSqlCJemLLoop7bfZpdU=s220",
//     "blobURL": "blob:http://127.0.0.1:3000/801ba87d-aaa8-43d4-8ac6-1c3f68902055"
// }
