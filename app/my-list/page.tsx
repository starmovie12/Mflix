import type { Metadata } from "next";
import MyListClient from "./MyListClient";

export const metadata: Metadata = {
  title: "My List",
  description: "Your personal watchlist on MFLIX. All the titles you've saved in one place.",
};

export default function MyListPage() {
  return <MyListClient />;
}
