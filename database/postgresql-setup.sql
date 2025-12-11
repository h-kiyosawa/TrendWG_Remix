-- オフィスコンビニDX化アプリ用のPostgreSQLスキーマ

-- データベースの作成（管理者権限で実行）
-- CREATE DATABASE office_convenience_store;

-- 商品テーブル
-- image: 商品画像のパス（例: /images/products/onigiri-sake.jpg）
--        public/images/products/ フォルダに画像を配置
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    image TEXT,                      -- 画像パス（例: /images/products/onigiri-sake.jpg）
    description TEXT,
    category VARCHAR(100) DEFAULT 'food',
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- カート商品テーブル
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL DEFAULT 'default',
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- カテゴリテーブル
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 店舗設定テーブル
CREATE TABLE IF NOT EXISTS store_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- サンプルカテゴリデータの投入
INSERT INTO categories (name, icon, display_order) VALUES
    ('食品', '🍱', 1),
    ('飲み物', '🥤', 2),
    ('お菓子', '🍭', 3)
ON CONFLICT DO NOTHING;

-- サンプル商品データの投入
-- 画像パスは public/images/products/ 配下のファイルを参照
-- 実際の画像ファイルは別途配置する必要があります
-- 画像が存在しない場合は placeholder.svg が表示されます
INSERT INTO products (name, price, image, description, category, stock) VALUES
    ('おにぎり（鮭）', 120, '/images/products/onigiri-sake.jpg', '新鮮な鮭を使用したおにぎり', '食品', 20),
    ('おにぎり（梅）', 110, '/images/products/onigiri-ume.jpg', '定番の梅おにぎり', '食品', 25),
    ('サンドイッチ（ハム＆チーズ）', 180, '/images/products/sandwich-ham-cheese.jpg', 'ハムとチーズのサンドイッチ', '食品', 15),
    ('ペットボトル緑茶', 150, '/images/products/greentea.jpg', '500ml緑茶', '飲み物', 30),
    ('コーヒー（ブラック）', 130, '/images/products/coffee-black.jpg', '缶コーヒー（無糖）', '飲み物', 20),
    ('カップラーメン', 200, '/images/products/cup-ramen.jpg', 'チキン味カップラーメン', '食品', 12),
    ('野菜サラダ', 250, '/images/products/salad.jpg', 'フレッシュ野菜サラダ', '食品', 8),
    ('チョコレート', 100, '/images/products/chocolate.jpg', 'ミルクチョコレート', 'お菓子', 35),
    ('ポテトチップス', 120, '/images/products/potato-chips.jpg', 'うすしお味', 'お菓子', 25),
    ('ヨーグルト', 80, '/images/products/yogurt.jpg', 'プレーンヨーグルト', '食品', 18),
    ('バナナ', 90, '/images/products/banana.jpg', '1本', '食品', 22),
    ('アイスクリーム', 160, '/images/products/ice-cream.jpg', 'バニラアイス', 'お菓子', 10)
ON CONFLICT DO NOTHING;

-- 店舗設定データの投入
INSERT INTO store_settings (id, settings) VALUES (
    'default',
    '{
        "name": "Remixオフィスコンビニ",
        "description": "オフィス内のセルフサービス店舗です",
        "businessHours": {
            "open": "09:00",
            "close": "18:00",
            "timezone": "Asia/Tokyo"
        },
        "taxRate": 0.1,
        "currency": "JPY",
        "features": {
            "cartEnabled": true,
            "darkModeEnabled": true,
            "categoriesEnabled": true,
            "stockDisplayEnabled": true
        },
        "theme": {
            "primaryColor": "#f97316",
            "accentColor": "#ea580c"
        }
    }'
) ON CONFLICT (id) DO NOTHING;