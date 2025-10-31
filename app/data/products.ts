import type { Product } from '../types/product';

// サンプル商品画像のプレースホルダー（実際の画像がない場合）
const placeholderImage = 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy="0.3em"%3E商品画像%3C/text%3E%3C/svg%3E';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'おにぎり（鮭）',
    price: 120,
    image: placeholderImage,
    description: '北海道産の鮭を使用したおにぎり'
  },
  {
    id: '2',
    name: 'おにぎり（梅）',
    price: 110,
    image: placeholderImage,
    description: '定番の梅おにぎり'
  },
  {
    id: '3',
    name: 'サンドイッチ（ハム＆チーズ）',
    price: 180,
    image: placeholderImage,
    description: 'ハムとチーズのサンドイッチ'
  },
  {
    id: '4',
    name: 'ペットボトル緑茶',
    price: 150,
    image: placeholderImage,
    description: '500ml緑茶'
  },
  {
    id: '5',
    name: 'コーヒー（ブラック）',
    price: 130,
    image: placeholderImage,
    description: '缶コーヒー（無糖）'
  },
  {
    id: '6',
    name: 'カップラーメン',
    price: 200,
    image: placeholderImage,
    description: 'しょうゆ味カップラーメン'
  },
  {
    id: '7',
    name: '野菜サラダ',
    price: 250,
    image: placeholderImage,
    description: '枝豆とレタスのサラダ'
  },
  {
    id: '8',
    name: 'チョコレート',
    price: 100,
    image: placeholderImage,
    description: 'ミルクチョコレート'
  },
  {
    id: '9',
    name: 'ポテトチップス',
    price: 120,
    image: placeholderImage,
    description: 'うすしお味'
  },
  {
    id: '10',
    name: 'ヨーグルト',
    price: 80,
    image: placeholderImage,
    description: 'プレーンヨーグルト'
  },
  {
    id: '11',
    name: 'バナナ',
    price: 90,
    image: placeholderImage,
    description: '1本'
  },
  {
    id: '12',
    name: 'アイスクリーム',
    price: 160,
    image: placeholderImage,
    description: 'バニラアイス'
  }
];