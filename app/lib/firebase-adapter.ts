import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  getDoc,
  updateDoc,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import type { DatabaseAdapter } from './database';
import type { Product, CartItem } from '../types/product';

export class FirebaseAdapter implements DatabaseAdapter {
  private productsCollection = collection(db, 'products');
  private cartItemsCollection = collection(db, 'cart_items');
  private categoriesCollection = collection(db, 'categories');
  private settingsCollection = collection(db, 'settings');

  async getProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(this.productsCollection);
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      return products;
    } catch (error) {
      console.error('商品の取得に失敗しました:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const productDoc = doc(db, 'products', id);
      const docSnap = await getDoc(productDoc);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error('商品の取得に失敗しました:', error);
      return null;
    }
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.productsCollection, {
        ...product,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('商品の作成に失敗しました:', error);
      throw error;
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const productDoc = doc(db, 'products', id);
      await updateDoc(productDoc, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('商品の更新に失敗しました:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const productDoc = doc(db, 'products', id);
      await deleteDoc(productDoc);
    } catch (error) {
      console.error('商品の削除に失敗しました:', error);
      throw error;
    }
  }

  async getCartItems(userId: string = 'default'): Promise<CartItem[]> {
    try {
      const q = query(this.cartItemsCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const cartItems: CartItem[] = [];
      
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const product = await this.getProductById(data.productId);
        
        if (product) {
          cartItems.push({
            product,
            quantity: data.quantity
          });
        }
      }
      
      return cartItems;
    } catch (error) {
      console.error('カートアイテムの取得に失敗しました:', error);
      return [];
    }
  }

  async addToCart(productId: string, quantity: number, userId: string = 'default'): Promise<void> {
    try {
      const cartItemId = `${userId}_${productId}`;
      const cartItemDoc = doc(db, 'cart_items', cartItemId);
      const docSnap = await getDoc(cartItemDoc);
      
      if (docSnap.exists()) {
        const currentQuantity = docSnap.data().quantity || 0;
        await updateDoc(cartItemDoc, {
          quantity: currentQuantity + quantity,
          updatedAt: new Date().toISOString()
        });
      } else {
        await setDoc(cartItemDoc, {
          userId,
          productId,
          quantity,
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('カートへの追加に失敗しました:', error);
      throw error;
    }
  }

  async updateCartItem(productId: string, quantity: number, userId: string = 'default'): Promise<void> {
    try {
      const cartItemId = `${userId}_${productId}`;
      const cartItemDoc = doc(db, 'cart_items', cartItemId);
      
      if (quantity <= 0) {
        await deleteDoc(cartItemDoc);
      } else {
        await updateDoc(cartItemDoc, {
          quantity,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('カートアイテムの更新に失敗しました:', error);
      throw error;
    }
  }

  async removeFromCart(productId: string, userId: string = 'default'): Promise<void> {
    try {
      const cartItemId = `${userId}_${productId}`;
      const cartItemDoc = doc(db, 'cart_items', cartItemId);
      await deleteDoc(cartItemDoc);
    } catch (error) {
      console.error('カートからの削除に失敗しました:', error);
      throw error;
    }
  }

  async clearCart(userId: string = 'default'): Promise<void> {
    try {
      const q = query(this.cartItemsCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('カートのクリアに失敗しました:', error);
      throw error;
    }
  }

  async getCategories(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(this.categoriesCollection);
      const categories: any[] = [];
      
      querySnapshot.forEach((doc) => {
        categories.push({ id: doc.id, ...doc.data() });
      });
      
      return categories;
    } catch (error) {
      console.error('カテゴリの取得に失敗しました:', error);
      return [];
    }
  }

  async getStoreSettings(): Promise<any> {
    try {
      const settingsDoc = doc(db, 'settings', 'store');
      const docSnap = await getDoc(settingsDoc);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return {};
    } catch (error) {
      console.error('店舗設定の取得に失敗しました:', error);
      return {};
    }
  }

  async updateStoreSettings(settings: any): Promise<void> {
    try {
      const settingsDoc = doc(db, 'settings', 'store');
      await setDoc(settingsDoc, {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('店舗設定の更新に失敗しました:', error);
      throw error;
    }
  }
}