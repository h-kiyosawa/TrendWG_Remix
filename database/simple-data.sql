-- Simple data insertion for PostgreSQL

-- Insert sample categories
INSERT INTO categories (name, icon, display_order) VALUES
    ('食品', '🍱', 1),
    ('飲み物', '🥤', 2),
    ('お菓子', '🍭', 3)
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, price, description, category, stock) VALUES
    ('おにぎり（鮭）', 120, '新鮮な鮭を使用したおにぎり', '食品', 20),
    ('おにぎり（梅）', 110, '定番の梅おにぎり', '食品', 25),
    ('サンドイッチ', 180, 'ハムとチーズのサンドイッチ', '食品', 15),
    ('緑茶', 150, '500ml緑茶', '飲み物', 30),
    ('コーヒー', 130, '缶コーヒー（無糖）', '飲み物', 20),
    ('カップラーメン', 200, 'チキン味カップラーメン', '食品', 12),
    ('野菜サラダ', 250, 'フレッシュ野菜サラダ', '食品', 8),
    ('チョコレート', 100, 'ミルクチョコレート', 'お菓子', 35),
    ('ポテトチップス', 120, 'うすしお味', 'お菓子', 25),
    ('ヨーグルト', 80, 'プレーンヨーグルト', '食品', 18)
ON CONFLICT DO NOTHING;