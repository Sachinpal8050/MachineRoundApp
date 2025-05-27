import React, {useEffect, useState} from 'react';
import {getItem, removeItem, setItem} from './store';

const ProductContext = React.createContext<{
  addedProducts: any;
  handleProductAddRemove: any;
  resetProductData: any;
}>({
  addedProducts: [],
  handleProductAddRemove: () => {},
  resetProductData: () => {},
});

type AddedProductType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const ProductProvider = ({children}: {children: any}) => {
  const [addedProducts, setAddedProducts] = useState<AddedProductType[]>([]);
  useEffect(() => {
    (async () => {
      const data = await getItem('cart');
      if (data) {
        setAddedProducts(JSON.parse(data));
      }
    })();
  }, []);
  const handleProductAddRemove = async (product: AddedProductType) => {
    const itemDetails = addedProducts.find(item => item.id === product.id);
    if (itemDetails) {
      if (product.quantity === 0) {
        const updatedData = addedProducts.filter(
          item => item.id !== product.id,
        );
        setAddedProducts(updatedData);
        await setItem('cart', JSON.stringify(updatedData));
      } else {
        setAddedProducts(prev =>
          prev.map(item => {
            if (item.id === product.id) {
              return {...product};
            }
            return item;
          }),
        );
        await removeItem('cart');
      }
    } else {
      const updatedData = [...addedProducts, product];
      setAddedProducts(updatedData);
      await setItem('cart', JSON.stringify(updatedData));
    }
  };

  const resetProductData = () => {
    setAddedProducts([]);
  };
  return (
    <ProductContext.Provider
      value={{addedProducts, handleProductAddRemove, resetProductData}}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

export const useAddedProductInfo = () => {
  const ctx = React.useContext(ProductContext);
  if (!ctx) {
    throw new Error('useAddedProductInfo must be used within ProductProvider');
  }
  return ctx;
};
