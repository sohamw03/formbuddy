import { auth } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await auth();

  return Response.json({ session });
}
