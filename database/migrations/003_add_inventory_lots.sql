-- 在庫ロット管理テーブルの追加
-- 賞味期限を在庫ロット単位で管理する

-- 在庫ロットテーブル
CREATE TABLE IF NOT EXISTS inventory_lots (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,           -- 現在の残数
    expiration_date DATE NOT NULL,                 -- 賞味期限
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 入荷日時
    lot_number VARCHAR(100),                       -- ロット番号（任意）
    status VARCHAR(20) DEFAULT 'active',           -- active / expired / disposed
    note TEXT,                                     -- 廃棄・調整時のメモ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_inventory_lots_product_id ON inventory_lots(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_lots_expiration_date ON inventory_lots(expiration_date);
CREATE INDEX IF NOT EXISTS idx_inventory_lots_status ON inventory_lots(status);

-- products テーブルから stock カラムを削除
-- （在庫数は inventory_lots の SUM(quantity) で取得する）
ALTER TABLE products DROP COLUMN IF EXISTS stock;

-- 商品別の有効在庫数を取得するビュー
CREATE OR REPLACE VIEW product_stock_summary AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    COALESCE(SUM(CASE WHEN il.status = 'active' THEN il.quantity ELSE 0 END), 0) AS total_stock,
    MIN(CASE WHEN il.status = 'active' AND il.quantity > 0 THEN il.expiration_date ELSE NULL END) AS nearest_expiration,
    COUNT(CASE WHEN il.status = 'active' AND il.quantity > 0 THEN 1 ELSE NULL END) AS active_lot_count
FROM products p
LEFT JOIN inventory_lots il ON p.id = il.product_id
GROUP BY p.id, p.name;

-- 期限切れロットを自動的に expired にするための関数（任意で定期実行）
CREATE OR REPLACE FUNCTION update_expired_lots() RETURNS void AS $$
BEGIN
    UPDATE inventory_lots
    SET status = 'expired', updated_at = CURRENT_TIMESTAMP
    WHERE status = 'active'
      AND expiration_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;
