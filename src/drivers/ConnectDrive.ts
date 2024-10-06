import { google } from "googleapis";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export const getDriveClient = async () => {
  try {
    const session = await auth();
    if (!session) {
      return null;
    }
    const { accessToken } = session.user as { accessToken: string };
    // Create a new client instance with the access token
    const client = new google.auth.OAuth2({
      // Use the access token from Next-Auth
      credentials: { access_token: accessToken, refresh_token: ""},
    });

    const service = google.drive({
      version: "v3",
      auth: client,
    });

    return service;
  } catch (error) {
    console.log(error);
    return null;
  }
};
