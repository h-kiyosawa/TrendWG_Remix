import { OfficeConvenienceStore } from "../components/OfficeConvenienceStore";

export function meta() {
  return [
    { title: "お買い物 - Remixオフィスコンビニ" },
    { name: "description", content: "商品を選んでカートに追加" },
  ];
}

export default function Shop() {
  return <OfficeConvenienceStore />;
}
