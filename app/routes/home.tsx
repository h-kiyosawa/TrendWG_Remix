import type { Route } from "./+types/home";
import { OfficeConvenienceStore } from "../components/OfficeConvenienceStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Remixオフィスコンビニ" },
    { name: "description", content: "トレンドWGRemixチーム" },
  ];
}

export default function Home() {
  return <OfficeConvenienceStore />;
}
