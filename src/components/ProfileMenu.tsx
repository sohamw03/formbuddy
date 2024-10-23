"use client";
import { useGlobal } from "@/drivers/GlobalContext";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";

export default function ProfileMenu() {
  // Global context
  const { user, logout, login } = useGlobal();

  return (
    <Dropdown>
      <DropdownTrigger style={{ position: "fixed", top: "2rem", right: "2rem" }}>{user.loggedIn ? <Avatar isBordered as="button" className="transition-transform" color="default" size="md" src={user.image} imgProps={{ style: { filter: "brightness(95%)", width: 48, height: 48 } }} /> : <Avatar isBordered as="button" className="transition-transform" color="default" size="md" src="/icons/person_icon.svg" imgProps={{ style: { filter: "brightness(95%)", width: 48, height: 48 } }} />}</DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        {user.loggedIn ? (
          <DropdownItem textValue="profile" key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user.name.split(" ")[0]}</p>
          </DropdownItem>
        ) : (
          <DropdownItem textValue="login" key="login" onClick={login}>
            Log In
          </DropdownItem>
        )}
        <DropdownItem textValue="settings" key="settings">
          My Settings
        </DropdownItem>
        <DropdownItem textValue="team_settings" key="team_settings">
          Team Settings
        </DropdownItem>
        <DropdownItem textValue="analytics" key="analytics">
          Analytics
        </DropdownItem>
        <DropdownItem textValue="system" key="system">
          System
        </DropdownItem>
        <DropdownItem textValue="configurations" key="configurations">
          Configurations
        </DropdownItem>
        <DropdownItem textValue="help_and_feedback" key="help_and_feedback">
          Help & Feedback
        </DropdownItem>
        {user.loggedIn && (
          <DropdownItem textValue="logout" key="logout" color="danger" onClick={logout}>
            Log Out
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
