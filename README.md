# オフィスコンビニDX化アプリ 🛒

タブレット上で商品を選択し、購入手続きができるオフィスコンビニのDX化アプリです。
React Router v7とTypeScriptを使用して開発されたモダンなWebアプリケーションです。

![タブレット向けデザイン](https://img.shields.io/badge/Device-Tablet%20Optimized-orange)
![React Router](https://img.shields.io/badge/React%20Router-v7-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Styled-38bdf8)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ed)

## 📖 クイックスタート

**初学者の方・詳細な環境構築手順が必要な方は：**

👉 **[詳細な環境構築ガイド (SETUP.md)](./SETUP.md)** をご覧ください

PostgreSQL、Docker、初期データ投入まで含めた完全な手順を初学者向けに説明しています。

## 🚀 機能

- **商品タイル表示**: 12種類のサンプル商品をタイル状に表示
- **カート機能**: 商品をカートに追加・削除・数量調整
- **カートダイアログ**: カート内容の詳細確認と管理
- **購入機能**: モックの購入処理（実際の決済なし）
- **レスポンシブデザイン**: タブレット・スマートフォン対応
- **ダークモード対応**: システム設定に連動した自動切り替え
- **アクセシビリティ**: キーボードナビゲーション・スクリーンリーダー対応

## � 前提条件

このプロジェクトを実行するには、以下がインストールされている必要があります：

- **Node.js** (v18.0.0以上推奨)
  - [Node.js公式サイト](https://nodejs.org/)からダウンロード・インストール
- **npm** (Node.jsと一緒にインストールされます)
- **Git** (リポジトリをクローンするため)
  - [Git公式サイト](https://git-scm.com/)からダウンロード・インストール

## 🛠️ プロジェクトのセットアップ

### 1. リポジトリのクローン

まず、このプロジェクトをローカル環境にクローンします：

```bash
# GitHubからプロジェクトをクローン
git clone https://github.com/h-kiyosawa/TrendWG_Remix.git

# プロジェクトディレクトリに移動
cd TrendWG_Remix
```

### 2. 依存関係のインストール

プロジェクトに必要なパッケージをインストールします：

```bash
# npmを使用して依存関係をインストール
npm install
```

💡 **初学者向け説明**: `npm install`は`package.json`に記載された全ての依存関係を自動でダウンロード・インストールします。

### 3. 開発サーバーの起動

開発環境でアプリケーションを起動します：

```bash
# 開発サーバーを起動
npm run dev
```

成功すると、以下のようなメッセージが表示されます：
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. アプリケーションの確認

ブラウザで `http://localhost:5173/` にアクセスすると、オフィスコンビニアプリが表示されます。

## 🗂️ ファイル構成

```
TrendWG_Remix/
├── app/                          # アプリケーションのメインコード
│   ├── components/               # 再利用可能なコンポーネント
│   │   ├── CartButton.tsx        # カートボタン（右下の固定ボタン）
│   │   ├── CartDialog.tsx        # カート内容を表示するダイアログ
│   │   ├── OfficeConvenienceStore.tsx  # メイン画面のコンポーネント
│   │   └── ProductTile.tsx       # 商品タイル（個別商品の表示）
│   ├── contexts/                 # React Contextによる状態管理
│   │   └── CartContext.tsx       # カートの状態管理
│   ├── data/                     # データ定義
│   │   └── products.ts           # サンプル商品データ
│   ├── routes/                   # ページルーティング
│   │   └── home.tsx              # ホームページ
│   ├── types/                    # TypeScript型定義
│   │   └── product.ts            # 商品・カート関連の型定義
│   ├── app.css                   # グローバルスタイル
│   ├── root.tsx                  # アプリケーションのルート
│   └── routes.ts                 # ルート設定
├── public/                       # 静的ファイル
│   └── favicon.ico               # ファビコン
├── package.json                  # プロジェクト設定・依存関係
├── tsconfig.json                 # TypeScript設定
├── vite.config.ts               # Vite（ビルドツール）設定
├── react-router.config.ts       # React Router設定
└── README.md                     # このファイル
```

### 📁 主要ディレクトリの説明

- **`app/components/`**: 画面を構成する部品（コンポーネント）を格納
- **`app/contexts/`**: アプリ全体で共有する状態（カート情報など）を管理
- **`app/data/`**: アプリで使用するデータ（商品情報など）を定義
- **`app/types/`**: TypeScriptの型定義を格納
- **`app/routes/`**: 各ページのコンポーネントを格納

## 🎨 技術スタック

| 技術 | 用途 | 公式サイト |
|------|------|------------|
| **React Router v7** | ルーティング・フレームワーク | [react-router.com](https://reactrouter.com/) |
| **TypeScript** | 型安全な開発 | [typescriptlang.org](https://www.typescriptlang.org/) |
| **Tailwind CSS** | スタイリング | [tailwindcss.com](https://tailwindcss.com/) |
| **Vite** | ビルドツール・開発サーバー | [vitejs.dev](https://vitejs.dev/) |

## 📱 使用方法

1. **商品選択**: 商品タイルの「+」ボタンをクリックしてカートに追加
2. **カート確認**: 右下のオレンジのカートボタンをクリック
3. **数量調整**: カートダイアログ内の「+」「-」ボタンで数量を調整
4. **商品削除**: ゴミ箱アイコンで個別商品を削除
5. **購入**: 「購入する」ボタンで購入手続き（モック機能）

## ⚡ 技術スタック

### フロントエンド
- **React Router v7**: モダンなフルスタックReactフレームワーク
- **TypeScript**: 型安全性を提供するJavaScriptの拡張
- **Tailwind CSS**: ユーティリティファーストのCSSフレームワーク
- **Vite**: 高速な開発サーバーとビルドツール

### バックエンド・データベース
- **PostgreSQL**: 本格的なリレーショナルデータベース
- **Firebase**: クラウドベースのNoSQLデータベース（本番環境用）
- **Docker**: PostgreSQL環境のコンテナ化
- **pgAdmin**: PostgreSQL管理ツール

### 開発環境
- **Docker Compose**: 複数コンテナの管理
- **ESLint + Prettier**: コード品質とフォーマットの統一
- **Hot Module Replacement**: 開発時の自動リロード

### データベース戦略
このプロジェクトでは**ハイブリッド戦略**を採用：
- **開発環境**: PostgreSQL（Docker）で高速開発
- **本番環境**: Firebase Firestoreでスケーラブル運用
- **抽象化レイヤー**: データベース切り替えが簡単

## 🔥 Firebase Emulator Suite の使用

このプロジェクトはFirebase Emulator Suiteを使用してローカル開発ができます。

### 前提条件

- **Java** (JDK 11以上): Firestore Emulatorの実行に必要
  - [OpenJDK](https://openjdk.org/) または [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) をインストール

### Firebase Emulatorの起動

```bash
# Firebase Emulatorを起動
npm run firebase:emulators

# または、FirestoreとAuthのみ起動
npm run firebase:emulators:ui
```

### テストデータの投入

Firebase Emulatorにテストデータを投入する方法：

```bash
# 1. Firebase Emulatorを起動（別ターミナル）
npm run firebase:emulators

# 2. テストデータを投入
npm run firebase:seed

# データをリセットして再投入
npm run firebase:reset
```

### 投入されるテストデータ

- **商品データ**: 12種類の商品（おにぎり、サンドイッチ、飲み物、お菓子など）
- **カテゴリデータ**: 食品、飲み物、お菓子の3カテゴリ
- **店舗設定**: 営業時間、税率、テーマカラーなど

### Firebase Emulator UI

Emulatorの管理画面で データの確認・編集ができます：

- **Emulator UI**: http://localhost:4000
- **Firestore**: http://localhost:8080
- **Auth**: http://localhost:9099

### 手動でのデータ追加

Emulator UI（http://localhost:4000）から手動でデータを追加することも可能です：

1. **Firestore Database** をクリック
2. **Start collection** で新しいコレクションを作成
3. Document ID と Field を入力してデータを追加

### 開発時の注意事項

- Emulatorのデータは永続化されません（再起動時にリセット）
- `npm run firebase:seed` でいつでもテストデータを再投入可能
- 本番環境では実際のFirebaseプロジェクトに接続されます

## 🏗️ 本番ビルド

本番環境用にビルドする場合：

```bash
# 本番用ビルドを作成
npm run build

# ビルドしたアプリを起動
npm start
```

## 🤝 開発に参加する

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/新機能名`)
3. 変更をコミット (`git commit -am '新機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/新機能名`)
5. プルリクエストを作成

## ❓ トラブルシューティング

### よくある問題と解決方法

**Q: `npm install`でエラーが出る**
```bash
# npmキャッシュをクリア
npm cache clean --force
# 再度インストール
npm install
```

**Q: 開発サーバーが起動しない**
- Node.jsのバージョンを確認（v18以上推奨）
- ポート5173が既に使用されていないか確認

**Q: ブラウザで真っ白な画面が表示される**
- ブラウザの開発者ツール（F12）でエラーを確認
- `npm run dev`でエラーメッセージがないか確認

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/h-kiyosawa/TrendWG_Remix/issues)でお気軽にお問い合わせください。

---

**開発者**: h-kiyosawa  
**ライセンス**: MIT  
**最終更新**: 2025年11月13日
