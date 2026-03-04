// app/routes/login-English.tsx

import type { Route } from "./+types/auth-English";

// ページのメタ情報（タイトルなど）
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Longin - Remix Office Convini Management System" },
        { name: "auth-Eng", content: "英語ログイン" },
    ];
}

// ページの内容
export default function AuthEng() {
    return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  {/* ヘッダー*/}
  <header className="bg-orange-500 dark:bg-orange-600 shadow-sm border-b border-orange-600 dark:border-orange-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-2xl font-bold text-white">
        Remixオフィスコンビニ
      </h1>
      <p className="text-sm text-orange-100 dark:text-orange-200 mt-1">
        Log-in/Sign-Up
      </p>
    </div>
  </header>

  {/* 認証ボタン */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="flex justify-center gap-16">
      {/* ログイン */}
      <button
        type="button"
        className="
          w-48 h-24
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg
          shadow-md
          hover:shadow-lg
          transition-shadow duration-200
          text-lg font-bold text-gray-900 dark:text-gray-100">
        Log in
      </button>

      {/* 新規アカウント作成 */}
      <button
        type="button"
        className="
          w-48 h-24
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg
          shadow-md
          hover:shadow-lg
          transition-shadow duration-200
          text-lg font-bold text-gray-900 dark:text-gray-100">
        Sign up
      </button>
    </div>
  </main>
</div>
    );
}
