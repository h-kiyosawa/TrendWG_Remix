export function meta() {
  return [
    { title: "Remixオフィスコンビニ" },
    { name: "description", content: "オフィスコンビニDX化アプリ" },
  ];
}

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Remixオフィスコンビニ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            オフィス内セルフサービス店舗
          </p>
        </div>

        {/* メニューボタン */}
        <div className="space-y-4">
          {/* お買い物ボタン */}
          <a
            href="/shop"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-4xl mb-2">🛒</div>
            <div className="text-xl font-bold">お買い物</div>
            <div className="text-sm text-orange-100 mt-1">商品を選んでカートに追加</div>
          </a>

          {/* 管理者メニューボタン */}
          <a
            href="/admin"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-4xl mb-2">⚙️</div>
            <div className="text-xl font-bold">管理者メニュー</div>
            <div className="text-sm text-blue-100 mt-1">売上・商品管理</div>
          </a>
        </div>

        {/* フッター */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2026 Remix Office Convenience Store</p>
        </div>
      </div>
    </div>
  );
}
