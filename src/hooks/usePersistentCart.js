import { useEffect, useState } from 'react';
import { sanitizeCart } from '../utils/cart.js';

export function usePersistentCart(storageKey) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(storageKey);
      if (!storedCart) {
        return;
      }

      setCart(sanitizeCart(JSON.parse(storedCart)));
    } catch (error) {
      console.error('Não foi possível carregar o carrinho salvo.', error);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Não foi possível salvar o carrinho no navegador.', error);
    }
  }, [cart, storageKey]);

  return [cart, setCart];
}
