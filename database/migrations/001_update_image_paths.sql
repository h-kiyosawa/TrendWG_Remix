-- 既存のproductsテーブルのimageカラムを画像パス形式に更新するマイグレーション
-- このスクリプトは既存のデータベースに対して実行してください

-- 商品画像パスの更新
UPDATE products SET image = '/images/products/onigiri-sake.jpg' WHERE name = 'おにぎり（鮭）';
UPDATE products SET image = '/images/products/onigiri-ume.jpg' WHERE name = 'おにぎり（梅）';
UPDATE products SET image = '/images/products/sandwich-ham-cheese.jpg' WHERE name = 'サンドイッチ（ハム＆チーズ）';
UPDATE products SET image = '/images/products/greentea.jpg' WHERE name = 'ペットボトル緑茶';
UPDATE products SET image = '/images/products/coffee-black.jpg' WHERE name = 'コーヒー（ブラック）';
UPDATE products SET image = '/images/products/cup-ramen.jpg' WHERE name = 'カップラーメン';
UPDATE products SET image = '/images/products/salad.jpg' WHERE name = '野菜サラダ';
UPDATE products SET image = '/images/products/chocolate.jpg' WHERE name = 'チョコレート';
UPDATE products SET image = '/images/products/potato-chips.jpg' WHERE name = 'ポテトチップス';
UPDATE products SET image = '/images/products/yogurt.jpg' WHERE name = 'ヨーグルト';
UPDATE products SET image = '/images/products/banana.jpg' WHERE name = 'バナナ';
UPDATE products SET image = '/images/products/ice-cream.jpg' WHERE name = 'アイスクリーム';

-- 追加商品があれば同様に更新
-- 画像がない商品はプレースホルダーを設定
UPDATE products SET image = '/images/products/placeholder.svg' WHERE image IS NULL OR image = '';

-- 確認用クエリ
SELECT id, name, image FROM products ORDER BY id;
