export function meta() {
  return [
    { title: "管理者メニュー - Remixオフィスコンビニ" },
    { name: "description", content: "売上確認・商品管理" },
  ];
}

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-blue-600 dark:bg-blue-700 shadow-sm border-b border-blue-700 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                管理者メニュー
              </h1>
              <p className="text-sm text-blue-100 dark:text-blue-200 mt-1">
                売上確認・商品管理
              </p>
            </div>
            <a
              href="/"
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              ← トップに戻る
            </a>
          </div>
        </div>
      </header>

      {/* メニューグリッド */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 売上確認 */}
          <a
            href="/admin/sales"
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              売上確認
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              日別・商品別の売上をグラフで確認
            </p>
          </a>

          {/* 商品管理 */}
          <a
            href="/admin/products-manage"
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              商品管理
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              商品の追加・編集・在庫管理
            </p>
          </a>

          {/* カテゴリ管理 */}
          <a
            href="/admin/categories"
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-5xl mb-4">🏷️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              カテゴリ管理
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              商品カテゴリの追加・編集
            </p>
          </a>

          {/* 店舗設定 */}
          <a
            href="/admin/settings"
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-5xl mb-4">⚙️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              店舗設定
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              店舗名・営業時間などの設定
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
