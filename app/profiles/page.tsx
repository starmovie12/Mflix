import type { Metadata } from "next";
import ProfilesClient from "./ProfilesClient";

export const metadata: Metadata = {
  title: "Who's Watching?",
  description: "Select your MFLIX profile to continue.",
};

export default function ProfilesPage() {
  return <ProfilesClient />;
}
