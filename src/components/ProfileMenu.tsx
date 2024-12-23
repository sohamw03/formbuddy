"use client";
import { useGlobal } from "@/drivers/GlobalContext";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import styles from "@/components/MainPanel.module.css";
import Link from "next/link";

export default function ProfileMenu() {
  // Global context
  const { user, logout, login } = useGlobal();

  return (
    <Dropdown>
      <DropdownTrigger style={{ position: "fixed", top: "1.5rem", right: "1.1rem" }}>
        {user.loggedIn ? <Avatar isBordered as="button" className="transition-transform" color="default" size="md" src={user.image} imgProps={{ className: styles.nonInteractive, style: { filter: "brightness(95%)", width: 48, height: 48, outlineWidth: "1px" } }} /> : <Avatar isBordered as="button" className="transition-transform" color="default" size="md" src="/icons/person_icon.svg" imgProps={{ className: styles.nonInteractive, style: { filter: "brightness(95%)", width: 48, height: 48, outlineWidth: "1px" } }} />}
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        {user.loggedIn ? (
          <DropdownItem textValue="profile" key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user.name.split(" ")[0]}</p>
          </DropdownItem>
        ) : (
          <DropdownItem textValue="login" key="login" onPress={login}>
            Log In
          </DropdownItem>
        )}
        <DropdownItem textValue="github" key="github" onPress={() => window.open("https://github.com/sohamw03/formbuddy")}>
          GitHub
        </DropdownItem>
        {user.loggedIn && (
          <DropdownItem textValue="logout" key="logout" color="danger" onPress={logout}>
            Log Out
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
