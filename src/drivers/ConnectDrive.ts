import { google } from "googleapis";
import { getSession } from "next-auth/react";

export const getDriveClient = async () => {
  const token = await getSession();
  if (!token) {
    return null;
  }
  const { accessToken } = token.user as { accessToken: string };
  // Create a new client instance with the access token
  const client = new google.auth.OAuth2({
    // Use the access token from Next-Auth
    credentials: { access_token: accessToken },
  });
  const drive = google.drive({
    version: "v3",
    auth: client,
  });

  return drive;
};
