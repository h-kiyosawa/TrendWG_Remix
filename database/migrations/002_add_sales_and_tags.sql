-- 売上管理とタグ管理のためのスキーマ追加

-- 売上テーブル
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,  -- 商品削除時にも記録を残すため
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL,         -- 販売時点の価格
    total_price INTEGER NOT NULL,        -- 合計金額
    sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255) DEFAULT 'default',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品タグテーブル（商品に複数のタグを付けられる）
CREATE TABLE IF NOT EXISTS product_tags (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, tag_name)
);

-- カテゴリマスターテーブルの更新（既存テーブルにデータ追加）
INSERT INTO categories (name, icon, display_order) VALUES
    ('パン', '🍞', 4),
    ('飲料', '🥤', 5),
    ('おにぎり', '🍙', 6),
    ('弁当', '🍱', 7),
    ('デザート', '🍰', 8),
    ('その他', '📦', 99)
ON CONFLICT DO NOTHING;

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON sales(sold_at);
CREATE INDEX IF NOT EXISTS idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag_name ON product_tags(tag_name);

-- 日次売上集計用ビュー
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
    DATE(sold_at) as sale_date,
    SUM(total_price) as total_revenue,
    SUM(quantity) as total_items,
    COUNT(DISTINCT id) as transaction_count
FROM sales
GROUP BY DATE(sold_at)
ORDER BY sale_date DESC;

-- 商品別売上集計用ビュー
CREATE OR REPLACE VIEW product_sales_summary AS
SELECT 
    product_id,
    product_name,
    SUM(quantity) as total_quantity,
    SUM(total_price) as total_revenue,
    COUNT(*) as sale_count
FROM sales
GROUP BY product_id, product_name
ORDER BY total_revenue DESC;
