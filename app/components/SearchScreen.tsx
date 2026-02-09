/**
 * 検索画面のレイアウト（Tailwind CSS）
 * - 入力欄、検索ボタン、結果表示領域（ダミー）
 * - レイアウトのみ：イベントやAPI処理などは未実装
 */
export function SearchScreen() {
  return (
    <div className="min-h-dvh bg-slate-50 flex items-center justify-center p-6">
      {/* パネル（最大幅 約半分） */}
      <section
        className="
          w-full md:w-1/2 max-w-[720px]
          bg-white border border-slate-200 rounded-xl
          shadow-sm
          p-5 md:p-6
        "
        aria-labelledby="search-heading"
      >
        <h1
          id="search-heading"
          className="text-lg md:text-xl font-semibold text-slate-900 mb-4"
        >
          検索
        </h1>

        {/* 入力＋ボタン行 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 md:gap-3 mb-4">
          <label
            htmlFor="search-input"
            className="text-xs font-medium text-slate-600 md:col-span-2"
          >
            キーワード
          </label>

          <input
            id="search-input"
            type="text"
            placeholder="商品名・キーワードを入力"
            aria-label="検索キーワード"
            className="
              w-full h-10 px-3
              text-sm
              rounded-md
              border border-slate-300
              outline-none
              focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
              placeholder:text-slate-400
              bg-white
            "
          />

          <button
            type="button"
            aria-label="検索ボタン"
            className="
              h-10 px-4
              inline-flex items-center justify-center
              rounded-md
              text-sm font-semibold
              text-white
              bg-blue-600 hover:bg-blue-600/90
              active:bg-blue-700
              border border-blue-600
              shadow-sm
              transition
            "
          >
            検索
          </button>
        </div>

        {/* 結果表示領域（プレースホルダー） */}
        <div
          className="
            mt-2
            min-h-[200px]
            rounded-lg
            border border-dashed border-slate-300
            bg-slate-50
            p-4
          "
          aria-live="polite"
          aria-busy="false"
        >
          <p className="text-sm text-slate-500">
            検索結果がここに表示されます
          </p>
        </div>
      </section>
    </div>
  );
}