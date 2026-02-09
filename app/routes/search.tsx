import type { Route } from "./+types/search";
import { SearchScreen } from "../components/SearchScreen";

// ページのメタ情報（タイトルなど）
export function meta({}: Route.MetaArgs) {
    return [
        { title: "検索 - Remixオフィスコンビニ" },
        { name: "description", content: "商品を検索" },
    ];
}

// ページの内容
export default function Search() {
    return <SearchScreen/>;
}