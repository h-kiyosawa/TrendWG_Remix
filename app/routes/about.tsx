// app/routes/about.tsx

import type { Route } from "./+types/about";

import { SellManagementScreen } from "../components/SellManagementScreen";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "販売者管理画面" },
        { name: "description", content: "トレンドWGRemixチーム" },
    ];
}

export default function Home() {
    return <SellManagementScreen />;
}