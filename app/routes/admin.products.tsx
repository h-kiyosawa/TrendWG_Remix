import type { Route } from "./+types/admin.products";
import { ProductImageEditor } from "../components/ProductImageEditor";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "商品画像管理 - Remixオフィスコンビニ" },
    { name: "description", content: "商品画像の追加・変更" },
  ];
}

export default function AdminProducts() {
  return <ProductImageEditor />;
}
