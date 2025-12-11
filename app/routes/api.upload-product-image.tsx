import type { Route } from "./+types/api.upload-product-image";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { DatabaseFactory } from "../lib/database";

// 日本語商品名→英語ファイル名のマッピング
const productNameMapping: Record<string, string> = {
  'おにぎり（鮭）': 'onigiri-sake',
  'おにぎり（梅）': 'onigiri-ume',
  'サンドイッチ（ハム＆チーズ）': 'sandwich-ham-cheese',
  'ペットボトル緑茶': 'greentea',
  'コーヒー（ブラック）': 'coffee-black',
  'カップラーメン': 'cup-ramen',
  '野菜サラダ': 'salad',
  'チョコレート': 'chocolate',
  'ポテトチップス': 'potato-chips',
  'ヨーグルト': 'yogurt',
  'バナナ': 'banana',
  'アイスクリーム': 'ice-cream',
};

// ファイル名を安全な形式に変換
function sanitizeFileName(name: string, productId: string): string {
  // マッピングがあればそれを使用
  if (productNameMapping[name]) {
    return productNameMapping[name];
  }
  
  // 英数字のみの場合はそのまま変換
  const sanitized = name
    .toLowerCase()
    .replace(/[（(]/g, '-')
    .replace(/[）)]/g, '')
    .replace(/[&＆]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // 変換結果が空の場合はproduct-{id}を使用
  return sanitized || `product-${productId}`;
}

// 拡張子を取得
function getExtension(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return mimeToExt[mimeType] || '.jpg';
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const productId = formData.get('productId') as string | null;
    const productName = formData.get('productName') as string | null;

    if (!imageFile || !productId || !productName) {
      return Response.json(
        { error: '画像、商品ID、商品名が必要です' },
        { status: 400 }
      );
    }

    // ファイルサイズチェック（1MB）
    if (imageFile.size > 1024 * 1024) {
      return Response.json(
        { error: 'ファイルサイズは1MB以下にしてください' },
        { status: 400 }
      );
    }

    // 画像形式チェック
    if (!imageFile.type.startsWith('image/')) {
      return Response.json(
        { error: '画像ファイルを選択してください' },
        { status: 400 }
      );
    }

    // ファイル名を生成
    const safeName = sanitizeFileName(productName, productId);
    const extension = getExtension(imageFile.type);
    const fileName = `${safeName}${extension}`;

    // 保存先ディレクトリ
    const uploadDir = join(process.cwd(), 'public', 'images', 'products');
    
    // ディレクトリがなければ作成
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // ファイルを保存
    const filePath = join(uploadDir, fileName);
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // データベースの画像パスを更新
    const imagePath = `/images/products/${fileName}`;
    try {
      const db = await DatabaseFactory.create();
      await db.updateProduct(productId, { image: imagePath });
    } catch (dbError) {
      console.error('データベース更新エラー:', dbError);
      // ファイルは保存されているので、パスだけ返す
    }

    return Response.json({
      success: true,
      imagePath,
      fileName,
    });

  } catch (error) {
    console.error('画像アップロードエラー:', error);
    return Response.json(
      { error: '画像のアップロードに失敗しました' },
      { status: 500 }
    );
  }
}
