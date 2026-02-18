import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Account & Settings",
  description: "Manage your MFLIX account settings, preferences, and profile.",
};

export default function AccountPage() {
  return <AccountClient />;
}
