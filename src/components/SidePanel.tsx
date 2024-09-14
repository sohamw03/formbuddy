import Link from "next/link";

export default function SidePanel() {
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
    </aside>
  );
}
