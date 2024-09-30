"use client";
import Link from "next/link";
import GoogleLoginButton from "./GoogleLoginButton";
import { useGlobal } from "@/drivers/GlobalContext";

export default function SidePanel() {
  const { user } = useGlobal();
  return (
    <aside>
      <h1>
        <Link href={"/"}>FormBuddy</Link>
      </h1>
      <ul>
        <li>
          <Link href={"/photos"}>Photos</Link>
        </li>
        <li>
          <Link href={"/docs"}>Docs</Link>
        </li>
        <li>
          <Link href={"/sign"}>Signatures</Link>
        </li>
      </ul>
      {user.loggedIn === false && <GoogleLoginButton />}
    </aside>
  );
}
