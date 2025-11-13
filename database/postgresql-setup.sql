-- オフィスコンビニDX化アプリ用のPostgreSQLスキーマ

-- データベースの作成（管理者権限で実行）
-- CREATE DATABASE office_convenience_store;

-- 商品テーブル
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    image TEXT,
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
INSERT INTO products (name, price, image, description, category, stock) VALUES
    ('おにぎり（鮭）', 120, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍙 鮭%3C/text%3E%3C/svg%3E', '新鮮な鮭を使用したおにぎり', '食品', 20),
    ('おにぎり（梅）', 110, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍙 梅%3C/text%3E%3C/svg%3E', '定番の梅おにぎり', '食品', 25),
    ('サンドイッチ（ハム＆チーズ）', 180, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🥪 ハム%3C/text%3E%3C/svg%3E', 'ハムとチーズのサンドイッチ', '食品', 15),
    ('ペットボトル緑茶', 150, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍵 緑茶%3C/text%3E%3C/svg%3E', '500ml緑茶', '飲み物', 30),
    ('コーヒー（ブラック）', 130, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E☕ ブラック%3C/text%3E%3C/svg%3E', '缶コーヒー（無糖）', '飲み物', 20),
    ('カップラーメン', 200, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍜 ラーメン%3C/text%3E%3C/svg%3E', 'チキン味カップラーメン', '食品', 12),
    ('野菜サラダ', 250, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🥗 サラダ%3C/text%3E%3C/svg%3E', 'フレッシュ野菜サラダ', '食品', 8),
    ('チョコレート', 100, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍫 チョコ%3C/text%3E%3C/svg%3E', 'ミルクチョコレート', 'お菓子', 35),
    ('ポテトチップス', 120, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍟 チップス%3C/text%3E%3C/svg%3E', 'うすしお味', 'お菓子', 25),
    ('ヨーグルト', 80, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🥛 ヨーグルト%3C/text%3E%3C/svg%3E', 'プレーンヨーグルト', '食品', 18),
    ('バナナ', 90, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍌 バナナ%3C/text%3E%3C/svg%3E', '1本', '食品', 22),
    ('アイスクリーム', 160, 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E🍦 アイス%3C/text%3E%3C/svg%3E', 'バニラアイス', 'お菓子', 10)
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