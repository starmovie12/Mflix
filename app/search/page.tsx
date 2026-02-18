import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for movies, TV shows, and people on MFLIX.",
};

export default function SearchPage() {
  return <SearchClient />;
}
