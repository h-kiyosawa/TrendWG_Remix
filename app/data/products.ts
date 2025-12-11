import type { Product } from '../types/product';

// プレースホルダー画像パス
const placeholderImage = '/images/products/placeholder.svg';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'おにぎり（鮭）',
    price: 120,
    image: '/images/products/onigiri-sake',  // 拡張子なし - 自動検出
    description: '北海道産の鮭を使用したおにぎり'
  },
  {
    id: '2',
    name: 'おにぎり（梅）',
    price: 110,
    image: '/images/products/onigiri-ume',  // 拡張子なし - 自動検出
    description: '定番の梅おにぎり'
  },
  {
    id: '3',
    name: 'サンドイッチ（ハム＆チーズ）',
    price: 180,
    image: '/images/products/sandwich-ham-cheese',
    description: 'ハムとチーズのサンドイッチ'
  },
  {
    id: '4',
    name: 'ペットボトル緑茶',
    price: 150,
    image: '/images/products/greentea',
    description: '500ml緑茶'
  },
  {
    id: '5',
    name: 'コーヒー（ブラック）',
    price: 130,
    image: '/images/products/coffee-black',
    description: '缶コーヒー（無糖）'
  },
  {
    id: '6',
    name: 'カップラーメン',
    price: 200,
    image: '/images/products/cup-ramen',
    description: 'しょうゆ味カップラーメン'
  },
  {
    id: '7',
    name: '野菜サラダ',
    price: 250,
    image: '/images/products/salad',
    description: '枝豆とレタスのサラダ'
  },
  {
    id: '8',
    name: 'チョコレート',
    price: 100,
    image: '/images/products/chocolate',
    description: 'ミルクチョコレート'
  },
  {
    id: '9',
    name: 'ポテトチップス',
    price: 120,
    image: '/images/products/potato-chips',
    description: 'うすしお味'
  },
  {
    id: '10',
    name: 'ヨーグルト',
    price: 80,
    image: '/images/products/yogurt',
    description: 'プレーンヨーグルト'
  },
  {
    id: '11',
    name: 'バナナ',
    price: 90,
    image: '/images/products/banana',
    description: '1本'
  },
  {
    id: '12',
    name: 'アイスクリーム',
    price: 160,
    image: '/images/products/ice-cream',
    description: 'バニラアイス'
  }
];