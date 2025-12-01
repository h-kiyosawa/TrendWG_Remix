# 🎓 React Router v7 初学者向けコーディングガイド

このドキュメントは、React Router v7を使った開発が**まったく初めての方**を対象としています。
「何から始めればいいかわからない」という方のために、基本的な概念から実際の画面作成まで、ステップバイステップで解説します。

## 📋 目次

1. [はじめに：このプロジェクトの構造を理解しよう](#はじめにこのプロジェクトの構造を理解しよう)
2. [基本概念：知っておくべき用語](#基本概念知っておくべき用語)
3. [ファイルの役割を理解しよう](#ファイルの役割を理解しよう)
4. [新しい画面（ページ）を作る方法](#新しい画面ページを作る方法)
5. [コンポーネントを作る方法](#コンポーネントを作る方法)
6. [スタイリング（見た目の装飾）](#スタイリング見た目の装飾)
7. [よく使うコードパターン集](#よく使うコードパターン集)
8. [コーディングルール・お作法](#コーディングルールお作法)
9. [よくあるエラーと解決方法](#よくあるエラーと解決方法)
10. [次のステップ](#次のステップ)

---

## 🏠 はじめに：このプロジェクトの構造を理解しよう

### プロジェクトを開いたら最初に見るべき場所

```
TrendWG_Remix/
├── app/                    ← ⭐ ここがメイン！コードを書く場所
│   ├── components/         ← 部品（ボタンやカードなど）
│   ├── routes/             ← 画面（ページ）
│   ├── root.tsx            ← アプリ全体の土台
│   └── app.css             ← 全体のスタイル
├── public/                 ← 画像などの静的ファイル
└── package.json            ← プロジェクトの設定ファイル
```

### 🔑 ポイント

- **コードを書くのは `app/` フォルダの中だけ**
- 新しい画面を作りたい → `app/routes/` に作る
- 再利用する部品を作りたい → `app/components/` に作る

---

## 📚 基本概念：知っておくべき用語

### コンポーネント（Component）とは？

画面を構成する「部品」のことです。レゴブロックのようなものと考えてください。

```
┌─────────────────────────────────────────┐
│  ヘッダー（コンポーネント）              │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────┐  ┌─────┐  ┌─────┐            │
│   │商品 │  │商品 │  │商品 │  ← 商品タイル│
│   │タイル│  │タイル│  │タイル│    コンポーネント
│   └─────┘  └─────┘  └─────┘            │
│                                         │
├─────────────────────────────────────────┤
│  フッター（コンポーネント）              │
└─────────────────────────────────────────┘
```

### JSX（ジェイエスエックス）とは？

JavaScriptの中にHTMLのような書き方ができる記法です。

```tsx
// これがJSX！HTMLっぽいけどJavaScriptの中に書ける
function MyButton() {
  return <button>クリックしてね</button>;
}
```

### Props（プロップス）とは？

コンポーネントに渡すデータのことです。「設定」や「オプション」と考えてください。

```tsx
// 名前を受け取って挨拶するコンポーネント
function Greeting({ name }) {
  return <p>こんにちは、{name}さん！</p>;
}

// 使う側
<Greeting name="田中" />  // → 「こんにちは、田中さん！」と表示
```

### State（ステート）とは？

コンポーネントが覚えておく「状態」のことです。

```tsx
// カウンターの例
function Counter() {
  const [count, setCount] = useState(0);  // countは現在の値、setCountは値を変える関数

  return (
    <div>
      <p>現在のカウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

---

## 📁 ファイルの役割を理解しよう

### `app/routes/home.tsx` - ホーム画面

```tsx
// home.tsx の構造
import type { Route } from "./+types/home";

// ① meta関数：ページのタイトルを設定
export function meta({}: Route.MetaArgs) {
  return [
    { title: "ページのタイトル" },                    // ブラウザのタブに表示
    { name: "description", content: "ページの説明" }, // 検索エンジン向け
  ];
}

// ② メインのコンポーネント：画面の内容
export default function Home() {
  return (
    <div>
      <h1>ようこそ！</h1>
      <p>ここに内容を書きます</p>
    </div>
  );
}
```

### `app/root.tsx` - アプリ全体の土台

すべてのページに共通する部分（HTMLの`<head>`など）を定義します。
**基本的に触らなくてOK**です。

### `app/routes.ts` - ルーティング設定

どのURLでどのページを表示するかを設定します。

```tsx
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),              // "/" でhome.tsxを表示
  route("about", "routes/about.tsx"),    // "/about" でabout.tsxを表示
] satisfies RouteConfig;
```

---

## 🖥️ 新しい画面（ページ）を作る方法

### Step 1: ファイルを作成

`app/routes/` フォルダに新しいファイルを作成します。

**例**: 「会社概要」ページを作る場合 → `app/routes/about.tsx`

### Step 2: 基本テンプレートをコピー

```tsx
// app/routes/about.tsx

import type { Route } from "./+types/about";

// ページのメタ情報（タイトルなど）
export function meta({}: Route.MetaArgs) {
  return [
    { title: "会社概要 - Remixオフィスコンビニ" },
    { name: "description", content: "私たちについて" },
  ];
}

// ページの内容
export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800">
        会社概要
      </h1>
      <p className="mt-4 text-gray-600">
        ここに会社の説明を書きます。
      </p>
    </div>
  );
}
```

### Step 3: ルーティングに追加

`app/routes.ts` にルートを追加します。

```tsx
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),  // ← この行を追加
] satisfies RouteConfig;
```

### Step 4: 動作確認

1. ターミナルで `npm run dev` を実行
2. ブラウザで `http://localhost:5173/about` にアクセス
3. 作成したページが表示されればOK！

---

## 🧩 コンポーネントを作る方法

### いつコンポーネントを作るべき？

- **同じUIを複数箇所で使う時** → コンポーネント化
- **コードが長くなってきた時** → 分割してコンポーネント化
- **特定の機能をまとめたい時** → コンポーネント化

### Step 1: ファイルを作成

`app/components/` フォルダに新しいファイルを作成します。

**命名ルール**: `PascalCase`（単語の先頭を大文字）で命名
- ✅ `ProductCard.tsx`
- ✅ `UserProfile.tsx`
- ❌ `product-card.tsx`
- ❌ `productcard.tsx`

### Step 2: コンポーネントを実装

**シンプルなコンポーネントの例（Props なし）**

```tsx
// app/components/Logo.tsx

export function Logo() {
  return (
    <div className="text-2xl font-bold text-orange-500">
      🛒 オフィスコンビニ
    </div>
  );
}
```

**Props を受け取るコンポーネントの例**

```tsx
// app/components/ProductCard.tsx

// ① 型定義：このコンポーネントが受け取るデータの形
interface ProductCardProps {
  name: string;        // 商品名（必須）
  price: number;       // 価格（必須）
  image?: string;      // 画像URL（任意、?をつける）
}

// ② コンポーネント本体
export function ProductCard({ name, price, image }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* 画像がある場合のみ表示 */}
      {image && (
        <img src={image} alt={name} className="w-full h-32 object-cover" />
      )}
      <h3 className="font-bold mt-2">{name}</h3>
      <p className="text-orange-500">¥{price.toLocaleString()}</p>
    </div>
  );
}
```

### Step 3: コンポーネントを使う

```tsx
// app/routes/home.tsx

import { ProductCard } from "../components/ProductCard";

export default function Home() {
  return (
    <div className="p-8">
      <h1>商品一覧</h1>
      
      {/* コンポーネントを使用 */}
      <ProductCard name="おにぎり" price={120} />
      <ProductCard name="お茶" price={150} image="/images/tea.jpg" />
    </div>
  );
}
```

---

## 🎨 スタイリング（見た目の装飾）

このプロジェクトでは **Tailwind CSS** を使用しています。
クラス名を書くだけでスタイルが適用される便利なCSSフレームワークです。

### 基本的な使い方

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  青い背景、白い文字、パディング16px、角丸
</div>
```

### よく使うクラス一覧

#### 📐 サイズ・余白

| クラス | 意味 | 例 |
|--------|------|-----|
| `w-full` | 幅100% | `<div className="w-full">` |
| `h-32` | 高さ128px | `<div className="h-32">` |
| `p-4` | 内側余白16px | `<div className="p-4">` |
| `m-4` | 外側余白16px | `<div className="m-4">` |
| `px-4` | 左右の内側余白 | `<div className="px-4">` |
| `py-2` | 上下の内側余白 | `<div className="py-2">` |
| `mt-4` | 上の外側余白 | `<div className="mt-4">` |

#### 🎨 色

| クラス | 意味 |
|--------|------|
| `bg-white` | 背景色：白 |
| `bg-gray-100` | 背景色：薄いグレー |
| `bg-orange-500` | 背景色：オレンジ |
| `text-gray-800` | 文字色：濃いグレー |
| `text-white` | 文字色：白 |
| `text-orange-500` | 文字色：オレンジ |

#### 📝 テキスト

| クラス | 意味 |
|--------|------|
| `text-sm` | 小さい文字 |
| `text-lg` | 大きい文字 |
| `text-xl` | より大きい文字 |
| `text-2xl` | さらに大きい文字 |
| `font-bold` | 太字 |
| `text-center` | 中央揃え |

#### 📦 レイアウト

| クラス | 意味 |
|--------|------|
| `flex` | フレックスボックス |
| `flex-col` | 縦方向に並べる |
| `items-center` | 縦方向中央揃え |
| `justify-center` | 横方向中央揃え |
| `justify-between` | 両端揃え |
| `gap-4` | 要素間の余白 |
| `grid` | グリッドレイアウト |
| `grid-cols-3` | 3列のグリッド |

#### 🔲 装飾

| クラス | 意味 |
|--------|------|
| `rounded` | 少し角丸 |
| `rounded-lg` | 大きめの角丸 |
| `rounded-full` | 完全な円形 |
| `shadow` | 影をつける |
| `shadow-lg` | 大きい影 |
| `border` | 枠線 |
| `border-gray-200` | グレーの枠線 |

### 実践例：カードコンポーネント

```tsx
<div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
  <img 
    src="/images/product.jpg" 
    alt="商品画像"
    className="w-full h-48 object-cover rounded-md"
  />
  <h3 className="text-xl font-bold mt-4 text-gray-800">
    商品名
  </h3>
  <p className="text-gray-600 mt-2">
    商品の説明文がここに入ります。
  </p>
  <div className="flex justify-between items-center mt-4">
    <span className="text-2xl font-bold text-orange-500">
      ¥1,200
    </span>
    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
      カートに追加
    </button>
  </div>
</div>
```

### レスポンシブデザイン

画面サイズによってスタイルを変えられます。

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 
    - スマホ: 1列
    - タブレット(md): 2列  
    - PC(lg): 3列
  */}
</div>
```

| プレフィックス | 画面幅 |
|---------------|--------|
| (なし) | すべて |
| `sm:` | 640px以上 |
| `md:` | 768px以上 |
| `lg:` | 1024px以上 |
| `xl:` | 1280px以上 |

---

## 📝 よく使うコードパターン集

### パターン1: ボタンクリックで何かする

```tsx
import { useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);

  const handleClick = () => {
    setLiked(!liked);  // true ↔ false を切り替え
  };

  return (
    <button 
      onClick={handleClick}
      className={`px-4 py-2 rounded ${liked ? 'bg-red-500' : 'bg-gray-300'}`}
    >
      {liked ? '❤️ いいね済み' : '🤍 いいね'}
    </button>
  );
}
```

### パターン2: リストを表示する

```tsx
export function ProductList() {
  const products = [
    { id: 1, name: "おにぎり", price: 120 },
    { id: 2, name: "お茶", price: 150 },
    { id: 3, name: "サンドイッチ", price: 280 },
  ];

  return (
    <ul className="space-y-2">
      {products.map((product) => (
        <li key={product.id} className="p-4 bg-white rounded shadow">
          {product.name} - ¥{product.price}
        </li>
      ))}
    </ul>
  );
}
```

### パターン3: 条件によって表示を変える

```tsx
export function UserStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>ログイン中です</p>
      ) : (
        <p>ログインしてください</p>
      )}
    </div>
  );
}
```

### パターン4: 入力フォーム

```tsx
import { useState } from "react";

export function SearchForm() {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // ページ遷移を防ぐ
    alert(`検索キーワード: ${keyword}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="検索..."
        className="border rounded px-4 py-2"
      />
      <button 
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        検索
      </button>
    </form>
  );
}
```

### パターン5: ローディング表示

```tsx
import { useState, useEffect } from "react";

export function DataLoader() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // データを取得（2秒後に完了する想定）
    setTimeout(() => {
      setData({ message: "データを取得しました！" });
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <div className="text-center p-8">読み込み中...</div>;
  }

  return <div>{data.message}</div>;
}
```

---

## ✅ コーディングルール・お作法

### ファイル・フォルダ命名規則

| 対象 | 命名規則 | 例 |
|------|---------|-----|
| コンポーネント | PascalCase | `ProductCard.tsx` |
| ページ（routes） | kebab-case または 短い名前 | `about.tsx`, `user-profile.tsx` |
| 関数 | camelCase | `handleClick`, `getUserData` |
| 変数 | camelCase | `isLoading`, `userName` |
| 定数 | UPPER_SNAKE_CASE | `MAX_COUNT`, `API_URL` |
| 型・インターフェース | PascalCase | `Product`, `UserProps` |

### コンポーネントの書き方

```tsx
// ✅ 良い例
export function ProductCard({ name, price }: ProductCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{price}</p>
    </div>
  );
}

// ❌ 悪い例（アロー関数でexport defaultは避ける）
export default ({ name, price }) => {
  return <div>{name}</div>;
};
```

### インポートの順序

```tsx
// 1. React関連
import { useState, useEffect } from "react";

// 2. 外部ライブラリ
import type { Route } from "./+types/home";

// 3. 自作コンポーネント
import { ProductCard } from "../components/ProductCard";

// 4. 型定義
import type { Product } from "../types/product";

// 5. スタイル・その他
import "../styles/custom.css";
```

### コメントの書き方

```tsx
// 単一行コメント

/**
 * 複数行コメント
 * 関数やコンポーネントの説明に使う
 */

{/* JSX内のコメント */}
<div>
  {/* これはコメントです */}
  <p>テキスト</p>
</div>
```

### 型定義のルール

```tsx
// インターフェースを使う（推奨）
interface ProductProps {
  name: string;
  price: number;
  description?: string;  // 任意のプロパティは ? をつける
}

// 配列の型
const products: Product[] = [];

// 関数の型
const handleClick = (id: number): void => {
  console.log(id);
};
```

---

## ❌ よくあるエラーと解決方法

### エラー1: `Cannot find module`

```
Cannot find module '../components/ProductCard'
```

**原因**: ファイルパスが間違っている

**解決方法**:
1. ファイル名のスペルを確認
2. フォルダ構造を確認
3. 大文字・小文字を確認（`ProductCard` ≠ `productCard`）

### エラー2: `Unexpected token '<'`

**原因**: ファイル拡張子が `.ts` になっている

**解決方法**: JSXを含むファイルは `.tsx` にする

### エラー3: `Objects are not valid as a React child`

```tsx
// ❌ エラーになる
const user = { name: "田中" };
return <div>{user}</div>;

// ✅ 正しい
return <div>{user.name}</div>;
```

**原因**: オブジェクトを直接表示しようとしている

**解決方法**: オブジェクトのプロパティを指定する

### エラー4: `Each child in a list should have a unique "key" prop`

```tsx
// ❌ エラーになる
{products.map((p) => <div>{p.name}</div>)}

// ✅ 正しい
{products.map((p) => <div key={p.id}>{p.name}</div>)}
```

**原因**: リストの各要素に `key` がない

**解決方法**: ユニークな `key` を追加する

### エラー5: `Too many re-renders`

```tsx
// ❌ 無限ループになる
function BadComponent() {
  const [count, setCount] = useState(0);
  setCount(count + 1);  // レンダリング中にsetStateを呼んでいる
  return <div>{count}</div>;
}

// ✅ 正しい（イベントハンドラ内で呼ぶ）
function GoodComponent() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

**原因**: レンダリング中に `setState` を呼んでいる

**解決方法**: `onClick` などのイベントハンドラ内で呼ぶ

---

## 🚀 次のステップ

### 1. まずはこれをやってみよう

- [ ] 新しいページを1つ作ってみる（`app/routes/test.tsx`）
- [ ] 簡単なコンポーネントを1つ作ってみる
- [ ] ボタンをクリックしたら数字が増えるカウンターを作る

### 2. 慣れてきたら

- [ ] 既存の `ProductTile.tsx` のコードを読んでみる
- [ ] `CartContext.tsx` で状態管理の仕組みを学ぶ
- [ ] APIからデータを取得する方法を学ぶ

### 3. 参考になるリソース

- [React 公式ドキュメント（日本語）](https://ja.react.dev/)
- [React Router 公式ドキュメント](https://reactrouter.com/)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)
- [TypeScript 入門](https://typescriptbook.jp/)

### 4. 困ったときは

1. **エラーメッセージをそのままGoogle検索**
2. **ChatGPTやCopilotに質問**
3. **チームメンバーに相談**

---

## 💡 おまけ：VS Code おすすめ拡張機能

| 拡張機能 | 用途 |
|---------|------|
| ES7+ React/Redux/React-Native snippets | コードの雛形を素早く入力 |
| Tailwind CSS IntelliSense | Tailwindクラスの補完 |
| Prettier | コードの自動整形 |
| ESLint | コードの問題を検出 |
| Error Lens | エラーを行に直接表示 |

### 便利なショートカット

| ショートカット | 機能 |
|--------------|------|
| `Ctrl + Space` | 補完候補を表示 |
| `Ctrl + /` | コメントアウト |
| `Ctrl + D` | 同じ単語を選択 |
| `Alt + ↑/↓` | 行を移動 |
| `Ctrl + Shift + P` | コマンドパレット |

---

**🎉 ここまで読んだあなたは、もうReact Routerの基礎は理解できています！**

あとは実際にコードを書いて、エラーにぶつかって、解決する。
その繰り返しでどんどん上達していきます。頑張ってください！

---

**最終更新**: 2025年12月1日
