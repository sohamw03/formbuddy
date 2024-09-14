"use client";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";

export default function ProfileMenu() {
  return (
    <Dropdown>
      <DropdownTrigger style={{ position: "fixed", top: 20, right: 20 }}>
        <Avatar isBordered as="button" className="transition-transform" color="secondary" name="Jason Hughes" size="sm" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem textValue="profile" key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">zoey@example.com</p>
        </DropdownItem>
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
        <DropdownItem textValue="logout" key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
