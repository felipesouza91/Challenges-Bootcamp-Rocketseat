import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storage = await AsyncStorage.getItem('productsCart');
      if (storage !== null) {
        setProducts(JSON.parse(storage));
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      setProducts(state =>
        state.map(item => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        }),
      );
      await AsyncStorage.setItem('productsCart', JSON.stringify(products));
    },
    [products],
  );
  const addToCart = useCallback(
    async (product: Product) => {
      const productExists = products.find(item => item.id === product.id);

      productExists
        ? await increment(product.id)
        : setProducts([...products, { ...product, quantity: 1 }]);

      await AsyncStorage.setItem('productsCart', JSON.stringify(products));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      setProducts(state =>
        state
          .map(item => {
            if (item.id === id) {
              return {
                ...item,
                quantity: item.quantity > 1 ? item.quantity - 1 : 0,
              };
            }
            return item;
          })
          .filter(item => item.quantity > 0),
      );
      await AsyncStorage.setItem('productsCart', JSON.stringify(products));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
