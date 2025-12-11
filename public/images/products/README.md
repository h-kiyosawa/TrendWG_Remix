# 商品画像フォルダ

このフォルダには商品の画像ファイルを配置します。

## 🔄 拡張子の自動検出

アプリは画像の拡張子を **自動検出** します。以下の順で探索されます：
1. `.jpg`
2. `.jpeg`
3. `.webp`
4. `.png`
5. `.gif`

そのため、**どの形式で画像を追加しても自動的に表示されます**。

## 📁 ファイル構成

```
public/images/products/
├── README.md           # このファイル
├── placeholder.svg     # 画像がない場合に表示されるプレースホルダー
├── onigiri-sake.jpg    # おにぎり（鮭）※ .webp, .png でも可
├── onigiri-ume.webp    # おにぎり（梅）
├── sandwich-ham-cheese.jpg  # サンドイッチ
├── greentea.jpg        # ペットボトル緑茶
├── coffee-black.jpg    # コーヒー（ブラック）
├── cup-ramen.jpg       # カップラーメン
├── salad.jpg           # 野菜サラダ
├── chocolate.jpg       # チョコレート
├── potato-chips.jpg    # ポテトチップス
├── yogurt.jpg          # ヨーグルト
├── banana.jpg          # バナナ
└── ice-cream.jpg       # アイスクリーム
```

## 🖼️ 画像ファイルの仕様

| 項目               | 推奨値                                     |
| ------------------ | ------------------------------------------ |
| **形式**           | JPG, PNG, WebP                             |
| **サイズ**         | 200x200px ～ 400x400px                     |
| **アスペクト比**   | 1:1（正方形）                              |
| **ファイルサイズ** | 100KB以下推奨                              |
| **命名規則**       | 英数字・ハイフン（例: `onigiri-sake.jpg`） |

## 📥 画像の追加方法

1. **画像ファイルを用意**
   - 正方形にトリミング
   - 適切なサイズにリサイズ
   - ファイル名は英数字・ハイフンのみ使用

2. **このフォルダに配置**
   ```
   public/images/products/新しい商品.jpg
   ```

3. **データベースに登録**
   - 商品データの `image` カラムにパスを設定
   ```sql
   INSERT INTO products (name, price, image, ...) VALUES
   ('新しい商品', 100, '/images/products/新しい商品.jpg', ...);
   ```

4. **Gitにコミット**
   ```bash
   git add public/images/products/新しい商品.jpg
   git commit -m "feat: 新しい商品の画像を追加"
   git push
   ```

## 🔄 チーム間での画像共有

画像ファイルは **Git で管理**
されるため、以下の手順で自動的にチーム全員に共有されます：

1. 画像を追加した人がコミット＆プッシュ
2. 他のメンバーが `git pull` で取得

```bash
# 最新の画像を取得
git pull origin main
```

## ⚠️ 注意事項

- **大きすぎる画像は避ける**：1MB以上の画像はリポジトリを圧迫します
- **日本語ファイル名は避ける**：パスの問題を防ぐため英数字を使用
- **プレースホルダーを活用**：画像がまだない商品は `placeholder.svg` を参照

## 🔧 画像がない場合の対処

アプリ側で画像が存在しない場合は、自動的にプレースホルダー画像が表示されるよう実装することを推奨します。

```typescript
// 例：画像のフォールバック処理
const imageUrl = product.image || "/images/products/placeholder.svg";
```
