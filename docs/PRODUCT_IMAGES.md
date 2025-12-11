# 商品画像管理ガイド

このドキュメントでは、オフィスコンビニアプリの商品画像を管理する方法について説明します。

---

## 📁 画像ファイルの配置場所

商品画像は以下のフォルダに配置します：

```
public/images/products/
```

このフォルダに配置した画像は、アプリから `/images/products/ファイル名`
のパスでアクセスできます。

---

## 🖼️ 画像ファイルの仕様

| 項目               | 推奨値                 | 備考                     |
| ------------------ | ---------------------- | ------------------------ |
| **形式**           | JPG, PNG, WebP         | WebPは最も軽量           |
| **サイズ**         | 200x200px ～ 400x400px | タブレット表示に最適     |
| **アスペクト比**   | 1:1（正方形）          | カード表示で崩れない     |
| **ファイルサイズ** | 100KB以下              | ページ読み込み速度のため |
| **命名規則**       | 英数字とハイフンのみ   | 日本語は避ける           |

### 📝 ファイル名の例

```
✅ 良い例:
onigiri-sake.jpg
coffee-black.png
sandwich-ham-cheese.webp

❌ 避けるべき例:
おにぎり鮭.jpg       # 日本語
Onigiri Sake.jpg    # スペース
onigiri_sake.JPG    # 大文字拡張子
```

---

## 🗄️ データベースへの登録

商品テーブル（`products`）の `image` カラムに画像のパスを保存します。

### テーブル構造

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    image TEXT,              -- 画像パス（例: /images/products/onigiri-sake.jpg）
    description TEXT,
    category VARCHAR(100),
    stock INTEGER DEFAULT 0
);
```

### 新規商品の登録

```sql
INSERT INTO products (name, price, image, description, category, stock)
VALUES (
    '新商品名',
    150,
    '/images/products/new-product.jpg',
    '商品の説明',
    '食品',
    10
);
```

### 既存商品の画像更新

```sql
UPDATE products
SET image = '/images/products/new-image.jpg'
WHERE id = 1;
```

---

## 🔄 チーム間での画像共有

### 方針: Git で直接管理

商品画像は **Git リポジトリで直接管理** します。これにより：

- ✅ `git pull` するだけで全員が最新の画像を取得できる
- ✅ 画像の変更履歴が追跡できる
- ✅ 特別なツールやサービスが不要

### 画像を追加する流れ

```mermaid
graph LR
    A[画像を用意] --> B[フォルダに配置]
    B --> C[DBに登録]
    C --> D[Git コミット]
    D --> E[Git プッシュ]
    E --> F[チームが pull で取得]
```

### 具体的な手順

#### 1. 画像ファイルを準備

```bash
# 画像を正方形にリサイズ（オプション：ImageMagickを使用）
magick convert original.jpg -resize 300x300^ -gravity center -extent 300x300 product.jpg
```

#### 2. フォルダに配置

```
public/images/products/new-product.jpg
```

#### 3. データベースに登録

pgAdmin または psql で実行：

```sql
INSERT INTO products (name, price, image, description, category, stock)
VALUES ('新商品', 200, '/images/products/new-product.jpg', '説明', '食品', 10);
```

#### 4. Git でコミット＆プッシュ

**TortoiseGit の場合：**

1. プロジェクトフォルダを右クリック
2. **TortoiseGit** → **Add** で画像を追加
3. **TortoiseGit** → **Commit** でコミット
4. **TortoiseGit** → **Push** でプッシュ

**Git Bash の場合：**

```bash
git add public/images/products/new-product.jpg
git commit -m "feat: 新商品の画像を追加"
git push
```

#### 5. 他のメンバーが取得

```bash
git pull origin main
```

---

## ⚠️ 注意事項

### ファイルサイズの制限

Git で大きなファイルを管理するとリポジトリが重くなります。

- 🟢 **推奨**: 100KB 以下
- 🟡 **許容**: 100KB ～ 500KB
- 🔴 **避ける**: 1MB 以上

1MB 以上の画像が多い場合は、**Git LFS** の導入を検討してください。

### プレースホルダー画像

画像がまだない商品には、プレースホルダー画像を使用できます：

```sql
-- 画像がない場合はプレースホルダーを設定
UPDATE products
SET image = '/images/products/placeholder.svg'
WHERE image IS NULL;
```

アプリ側でも画像のフォールバック処理を実装することを推奨：

```typescript
// React コンポーネントでの例
<img
    src={product.image || "/images/products/placeholder.svg"}
    alt={product.name}
    onError={(e) => {
        e.currentTarget.src = "/images/products/placeholder.svg";
    }}
/>;
```

---

## 🛠️ マイグレーション

既存のデータベースを画像パス形式に更新する場合：

```bash
# pgAdmin または psql で実行
\i database/migrations/001_update_image_paths.sql
```

または、Docker コンテナを再作成してデータを初期化：

```bash
docker-compose down -v
docker-compose up -d
```

---

## 📋 チェックリスト

新しい商品画像を追加する際のチェックリスト：

- [ ] 画像を正方形（1:1）にトリミングした
- [ ] ファイルサイズが100KB以下
- [ ] ファイル名は英数字とハイフンのみ
- [ ] `public/images/products/` に配置した
- [ ] データベースの `image` カラムにパスを登録した
- [ ] Git にコミット＆プッシュした
- [ ] ブラウザで画像が表示されることを確認した
