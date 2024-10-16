// Residence: Backend
import { google } from "googleapis";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export const getDriveClient = async () => {
  try {
    const session = await auth();
    if (!session) {
      return null;
    }
    const { accessToken, refreshToken, expiresAt } = session.user as { accessToken: string; refreshToken: string; expiresAt: number };
    // Create a new client instance with the access token
    const client = new google.auth.OAuth2({
      // Use the access token from Next-Auth
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      credentials: { access_token: accessToken, refresh_token: refreshToken, expiry_date: expiresAt },
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
