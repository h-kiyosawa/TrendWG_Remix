# 🚀 オフィスコンビニDXアプリ - ローカル環境構築ガイド

このドキュメントでは、オフィスコンビニDXアプリをローカル環境で開発・動作させるための環境構築手順を説明します。

## 📋 目次

1. [概要・目的](#概要目的)
2. [前提条件](#前提条件)
3. [環境構築手順](#環境構築手順)
4. [データベース設定](#データベース設定)
5. [アプリケーション起動](#アプリケーション起動)
6. [トラブルシューティング](#トラブルシューティング)

---

## 🎯 概要・目的

### このアプリは何？
オフィス内のコンビニエンスストアをデジタル化（DX化）するタブレット向けアプリです。
- 商品を画面上で選択
- カートに追加
- 購入手続きを完了

### なぜこの環境構築が必要？
- **フロントエンド**: React Router v7 でユーザーインターフェースを構築
- **バックエンド**: PostgreSQL でデータを管理
- **開発効率**: Docker で簡単にデータベース環境を構築
- **将来対応**: Firebase との切り替えも可能な設計

---

## ✅ 前提条件

以下のソフトウェアがインストールされている必要があります：

### 必須ソフトウェア
- **Node.js** (v18以上) - JavaScript実行環境
- **npm** (Node.jsに付属) - パッケージ管理
- **Docker Desktop** - コンテナ実行環境
- **Git** - バージョン管理

### インストール確認
ターミナル（PowerShell/コマンドプロンプト）で以下を実行：

```bash
# Node.jsのバージョン確認
node --version
# v18.0.0 以上が表示されればOK

# npmのバージョン確認
npm --version
# 9.0.0 以上が表示されればOK

# Dockerのバージョン確認
docker --version
# Docker version 20.0.0 以上が表示されればOK

# Gitのバージョン確認
git --version
# git version 2.30.0 以上が表示されればOK
```

---

## 🔧 環境構築手順

### Step 1: プロジェクトのクローン

```bash
# GitHubからプロジェクトをダウンロード
git clone https://github.com/h-kiyosawa/TrendWG_Remix.git

# プロジェクトディレクトリに移動
cd TrendWG_Remix
```

**何をしているか**: このコマンドで、GitHub上のプロジェクトコードを自分のパソコンにダウンロードしています。

### Step 2: 依存関係のインストール

```bash
# Node.jsの依存パッケージをインストール
npm install
```

**何をしているか**: `package.json`に記載された必要なライブラリ（React、TypeScript、PostgreSQLクライアントなど）をすべてダウンロード・インストールしています。

### Step 3: 環境変数の設定

```bash
# .envファイルを作成（すでに存在する場合はスキップ）
# 以下の内容で.envファイルを作成してください
```

`.env`ファイルの内容：
```env
# データベース設定
DATABASE_TYPE=postgresql
NODE_ENV=development

# PostgreSQL設定（ローカル開発用）
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=office_convenience_store
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

**何をしているか**: アプリケーションがどのデータベースに接続するかを設定しています。環境変数を使うことで、開発・本番環境で異なる設定を使い分けできます。

---

## 🗄️ データベース設定

### Step 4: PostgreSQLコンテナの起動

```bash
# Docker Desktopを起動してから以下を実行

# PostgreSQLコンテナを起動
docker compose up -d postgres

# 起動確認
docker compose ps
```

**何をしているか**: 
- PostgreSQLデータベースをDockerコンテナとして起動
- `-d`オプションでバックグラウンド実行
- `docker compose ps`で正常に起動しているか確認

### Step 5: データベース初期化

```bash
# PostgreSQLに初期データを投入
docker exec -i trend_remix_app-postgres-1 psql -U postgres -d office_convenience_store -c "
INSERT INTO categories (name, icon, display_order) VALUES 
('food', '🍱', 1), 
('drink', '🥤', 2), 
('snack', '🍭', 3) 
ON CONFLICT DO NOTHING;"

# 商品データの投入
docker exec -i trend_remix_app-postgres-1 psql -U postgres -d office_convenience_store -c "
INSERT INTO products (name, price, description, category, stock) VALUES 
('Onigiri Salmon', 120, 'Fresh salmon onigiri', 'food', 20),
('Onigiri Plum', 110, 'Classic plum onigiri', 'food', 25),
('Sandwich', 180, 'Ham and cheese sandwich', 'food', 15),
('Green Tea', 150, '500ml green tea', 'drink', 30),
('Coffee', 130, 'Black coffee can', 'drink', 20),
('Cup Noodle', 200, 'Chicken flavor cup noodle', 'food', 12),
('Salad', 250, 'Fresh vegetable salad', 'food', 8),
('Chocolate', 100, 'Milk chocolate', 'snack', 35),
('Potato Chips', 120, 'Light salt flavor', 'snack', 25),
('Yogurt', 80, 'Plain yogurt', 'food', 18) 
ON CONFLICT DO NOTHING;"
```

**何をしているか**: 
- アプリで表示する商品データとカテゴリデータをデータベースに登録
- `ON CONFLICT DO NOTHING`で重複データは無視

### Step 6: データ投入確認

```bash
# 投入されたデータを確認
docker exec -i trend_remix_app-postgres-1 psql -U postgres -d office_convenience_store -c "SELECT COUNT(*) FROM products;"

# 具体的な商品データを確認
docker exec -i trend_remix_app-postgres-1 psql -U postgres -d office_convenience_store -c "SELECT name, price, category FROM products LIMIT 5;"
```

**何をしているか**: データが正常に投入されているか確認しています。

---

## 🎮 アプリケーション起動

### Step 7: 開発サーバーの起動

```bash
# React Router開発サーバーを起動
npm run dev
```

成功すると以下のような表示が出ます：
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 8: アプリケーションの確認

ブラウザで http://localhost:5173/ にアクセスします。

**期待される表示**:
- ヘッダー: "Remixオフィスコンビニ"
- 商品グリッド: PostgreSQLから読み込んだ商品一覧
- カート機能: 商品の追加・削除

---

## 🛠️ pgAdmin（データベース管理ツール）の使用

### Optional: pgAdminの起動

データベースの中身を視覚的に確認したい場合：

```bash
# pgAdminコンテナを起動
docker compose up -d pgadmin

# ブラウザで http://localhost:5050 にアクセス
```

**pgAdmin ログイン情報**:
- Email: `admin@example.com`
- Password: `admin`

**サーバー接続設定**:
- Host: `postgres`
- Port: `5432`
- Database: `office_convenience_store`
- Username: `postgres`
- Password: `password`

---

## ❌ トラブルシューティング

### 問題 1: 「商品を読み込み中...」で止まる

**原因**: クライアントサイドからPostgreSQLに直接接続しようとしている

**解決策**: 
```bash
# サーバーサイドでのデータベース接続をテスト
npx tsx test-db.ts
```

### 問題 2: Docker関連エラー

**症状**: `docker compose` コマンドが失敗する

**解決策**:
1. Docker Desktopが起動しているか確認
2. Docker Desktopを再起動
3. 以下のコマンドでDockerの状態確認：
```bash
docker info
```

### 問題 3: PostgreSQL接続エラー

**症状**: `password authentication failed`

**解決策**:
1. `.env`ファイルの設定を確認
2. PostgreSQLコンテナを再起動：
```bash
docker compose restart postgres
```

### 問題 4: ポート衝突

**症状**: `port 5432/5173 already in use`

**解決策**:
```bash
# 使用中のポートを確認（Windows）
netstat -ano | findstr :5432
netstat -ano | findstr :5173

# 該当プロセスを終了するか、別のポートを使用
```

---

## 📚 次のステップ

環境構築が完了したら、以下の開発を進めることができます：

1. **ORM導入**: PrismaやDrizzleでデータベース操作を簡単に
2. **環境切り替え**: 開発/本番でFirebase/PostgreSQLを切り替え
3. **機能拡張**: 決済機能、在庫管理、ユーザー認証など

---

## 💡 よくある質問

**Q: なぜFirebaseとPostgreSQLの両方を使うの？**
A: 開発環境ではPostgreSQLで素早く開発し、本番環境ではFirebaseのスケーラビリティを活用するためです。

**Q: Dockerを使う理由は？**
A: PostgreSQLを自分のPCに直接インストールする必要がなく、環境を汚さずに開発できるためです。

**Q: React Router v7の特徴は？**
A: サーバーサイドレンダリング、型安全性、モダンなReact開発体験を提供します。

---

**🎉 環境構築完了！**

これでオフィスコンビニDXアプリの開発環境が整いました。質問や問題があれば、GitHubのIssuesでお知らせください。