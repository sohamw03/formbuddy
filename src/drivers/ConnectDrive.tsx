"use client";
import { google } from "googleapis";
import { useGlobal } from "./GlobalContext";

export const getDriveClient = async () => {
  const { user } = useGlobal();
  // Create a new client instance with the access token
  const client = new google.auth.OAuth2({
    // Use the access token from Next-Auth
    credentials: { access_token: user.accessToken },
  });
  const drive = google.drive({
    version: "v3",
    auth: client,
  });

  return drive;
};
