import { createFolder } from "../create_folder/route";
import { listFiles } from "../list_files/route";
import { removeFile } from "../remove_file/route";

export async function POST(request: Request) {
  try {
    // Call the list api to check if folders exist (photos, docs, and signatures)
    const files = (await listFiles("")) as { id: string; name: string; mimeType: string }[];

    // Check if the folders exist
    const folderCheck = { photos: 0, docs: 0, signatures: 0 };
    // Count existence of folders
    files.forEach((file) => {
      if (file.name === "photos") {
        folderCheck.photos += 1;
      } else if (file.name === "docs") {
        folderCheck.docs += 1;
      } else if (file.name === "signatures") {
        folderCheck.signatures += 1;
      }
    });

    const idsToDelete: string[] = [];
    // Mark folders for deletion if there are duplicates
    while (folderCheck.photos > 1) {
      const id = files.find((file) => file.name === "photos")?.id;
      if (id) {
        idsToDelete.push(id);
      }
      folderCheck.photos -= 1;
    }
    while (folderCheck.docs > 1) {
      const id = files.find((file) => file.name === "docs")?.id;
      if (id) {
        idsToDelete.push(id);
      }
      folderCheck.docs -= 1;
    }
    while (folderCheck.signatures > 1) {
      const id = files.find((file) => file.name === "signatures")?.id;
      if (id) {
        idsToDelete.push(id);
      }
      folderCheck.signatures -= 1;
    }

    // Mark files for deletion
    files.forEach((file) => {
      if (file.mimeType !== "application/vnd.google-apps.folder") {
        idsToDelete.push(file.id);
      }
    });

    // Delete marked files
    idsToDelete.forEach(async (id) => {
      await removeFile(id);
    });

    // Create folders if they do not exist
    Object.keys(folderCheck).forEach(async (folder) => {
      if (folderCheck[folder as keyof typeof folderCheck] === 0) {
        await createFolder(folder);
      }
    });

    return Response.json({ status: true, message: "Folders created successfully" });
  } catch (error) {
    console.log(error);
    return Response.json({ status: false, message: "Error creating folders" }, { status: 500 });
  }
}
