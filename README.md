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

## 🚀 環境構築・セットアップ

**完全な環境構築手順は：**

👉 **[詳細な環境構築ガイド (SETUP.md)](./SETUP.md)** をご覧ください

PostgreSQL、Docker、初期データ投入まで含めた完全な手順を初学者向けに説明しています。

## 🔀 開発ワークフロー（Git運用）

**Issue駆動型開発の手順は：**

👉 **[Git ワークフローガイド (docs/GIT_WORKFLOW.md)](./docs/GIT_WORKFLOW.md)** をご覧ください

TortoiseGit（GUI）とGit Bash（CLI）の両方の手順で、Issue作成からプルリクエストまでを説明しています。

## 🎓 コーディングガイド（初学者向け）

**React Router v7での画面作成・コーディング方法は：**

👉 **[React Router 初学者向けコーディングガイド (docs/REACT_ROUTER_GUIDE.md)](./docs/REACT_ROUTER_GUIDE.md)** をご覧ください

「何から始めればいいかわからない」という方のために、基本概念から実際の画面作成まで丁寧に解説しています。

### クイックスタート（開発経験者向け）

```bash
# リポジトリをクローン
git clone https://github.com/h-kiyosawa/TrendWG_Remix.git
cd TrendWG_Remix

# 依存関係をインストール
npm install

# PostgreSQL環境を起動（テーブルとサンプルデータが自動作成されます）
docker compose up -d postgres

# 開発サーバーを起動
npm run dev
```

💡 **注意**: 初回の `docker compose up -d postgres`
実行時に、`database/postgresql-setup.sql`
が自動実行され、テーブル作成とサンプルデータ投入が行われます。

## 🗂️ プロジェクト構成

```
TrendWG_Remix/
├── app/                          # React Router アプリケーション
│   ├── components/               # UIコンポーネント
│   ├── lib/                      # データベース抽象化レイヤー
│   ├── services/                 # ビジネスロジック
│   └── routes/                   # ページルーティング
├── database/                     # PostgreSQL関連
├── docker-compose.yml            # Docker環境設定
├── SETUP.md                     # 詳細環境構築ガイド
└── README.md                     # このファイル
```

- **`app/routes/`**: 各ページのコンポーネントを格納

## 🎨 技術スタック

| 技術                | 用途                         | 公式サイト                                            |
| ------------------- | ---------------------------- | ----------------------------------------------------- |
| **React Router v7** | ルーティング・フレームワーク | [react-router.com](https://reactrouter.com/)          |
| **TypeScript**      | 型安全な開発                 | [typescriptlang.org](https://www.typescriptlang.org/) |
| **Tailwind CSS**    | スタイリング                 | [tailwindcss.com](https://tailwindcss.com/)           |
| **Vite**            | ビルドツール・開発サーバー   | [vitejs.dev](https://vitejs.dev/)                     |

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

**開発者**: h-kiyosawa\
**ライセンス**: MIT\
**最終更新**: 2025年11月13日
