import { useState } from "react";
import type { DailySalesSummary, ProductSalesSummary } from "../types/product";

// サンプル売上データ（実際にはAPIから取得）
const sampleDailySales: DailySalesSummary[] = [
  { saleDate: "2026-01-15", totalRevenue: 12500, totalItems: 45, transactionCount: 28 },
  { saleDate: "2026-01-14", totalRevenue: 15200, totalItems: 52, transactionCount: 35 },
  { saleDate: "2026-01-13", totalRevenue: 9800, totalItems: 38, transactionCount: 22 },
  { saleDate: "2026-01-12", totalRevenue: 11000, totalItems: 41, transactionCount: 25 },
  { saleDate: "2026-01-11", totalRevenue: 8500, totalItems: 32, transactionCount: 18 },
  { saleDate: "2026-01-10", totalRevenue: 14000, totalItems: 48, transactionCount: 32 },
  { saleDate: "2026-01-09", totalRevenue: 13200, totalItems: 46, transactionCount: 30 },
];

const sampleProductSales: ProductSalesSummary[] = [
  { productId: "1", productName: "おにぎり（鮭）", totalQuantity: 120, totalRevenue: 14400, saleCount: 85 },
  { productId: "2", productName: "ペットボトル緑茶", totalQuantity: 95, totalRevenue: 14250, saleCount: 78 },
  { productId: "3", productName: "サンドイッチ（ハム＆チーズ）", totalQuantity: 65, totalRevenue: 11700, saleCount: 52 },
  { productId: "4", productName: "コーヒー（ブラック）", totalQuantity: 80, totalRevenue: 10400, saleCount: 65 },
  { productId: "5", productName: "おにぎり（梅）", totalQuantity: 75, totalRevenue: 8250, saleCount: 60 },
];

export function meta() {
  return [
    { title: "売上確認 - Remixオフィスコンビニ" },
    { name: "description", content: "売上をグラフで確認" },
  ];
}

// シンプルな棒グラフコンポーネント
function BarChart({ data, maxValue }: { data: { label: string; value: number }[]; maxValue: number }) {
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-20 text-sm text-gray-600 dark:text-gray-400 text-right">
            {item.label}
          </div>
          <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-24 text-sm font-medium text-gray-900 dark:text-white text-right">
            ¥{item.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminSales() {
  const [dailySales, setDailySales] = useState<DailySalesSummary[]>(sampleDailySales);
  const [productSales, setProductSales] = useState<ProductSalesSummary[]>(sampleProductSales);
  const [viewMode, setViewMode] = useState<'daily' | 'product'>('daily');
  const [loading, setLoading] = useState(false);

  // 今日の売上
  const todaySales = dailySales[0];
  
  // 週間合計
  const weeklyTotal = dailySales.reduce((sum, day) => sum + day.totalRevenue, 0);
  const weeklyItems = dailySales.reduce((sum, day) => sum + day.totalItems, 0);

  // グラフデータの最大値
  const maxDailyValue = Math.max(...dailySales.map(d => d.totalRevenue));
  const maxProductValue = Math.max(...productSales.map(p => p.totalRevenue));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-blue-600 dark:bg-blue-700 shadow-sm border-b border-blue-700 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">📊 売上確認</h1>
              <p className="text-sm text-blue-100 dark:text-blue-200 mt-1">
                日別・商品別の売上をグラフで確認
              </p>
            </div>
            <a
              href="/admin"
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              ← 管理者メニューに戻る
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">本日の売上</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              ¥{todaySales?.totalRevenue.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {todaySales?.totalItems || 0}点 / {todaySales?.transactionCount || 0}件
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">週間売上</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              ¥{weeklyTotal.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {weeklyItems}点販売
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">1日平均</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              ¥{Math.round(weeklyTotal / dailySales.length).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              過去{dailySales.length}日間
            </div>
          </div>
        </div>

        {/* 表示切替タブ */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
          >
            📅 日別売上
          </button>
          <button
            onClick={() => setViewMode('product')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'product'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
          >
            📦 商品別売上
          </button>
        </div>

        {/* グラフエリア */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          {viewMode === 'daily' ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                日別売上推移
              </h2>
              <BarChart
                data={dailySales.map(d => ({
                  label: d.saleDate.slice(5), // MM-DD形式
                  value: d.totalRevenue,
                }))}
                maxValue={maxDailyValue}
              />
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                商品別売上ランキング
              </h2>
              <BarChart
                data={productSales.slice(0, 10).map(p => ({
                  label: p.productName.length > 8 ? p.productName.slice(0, 8) + '...' : p.productName,
                  value: p.totalRevenue,
                }))}
                maxValue={maxProductValue}
              />
            </>
          )}
        </div>

        {/* 詳細テーブル */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {viewMode === 'daily' ? '日別売上詳細' : '商品別売上詳細'}
          </h2>
          
          {viewMode === 'daily' ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">日付</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">売上</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">販売数</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">取引件数</th>
                </tr>
              </thead>
              <tbody>
                {dailySales.map((day, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{day.saleDate}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                      ¥{day.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      {day.totalItems}点
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      {day.transactionCount}件
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">商品名</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">売上</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">販売数</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">取引回数</th>
                </tr>
              </thead>
              <tbody>
                {productSales.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{product.productName}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                      ¥{product.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      {product.totalQuantity}点
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      {product.saleCount}回
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
