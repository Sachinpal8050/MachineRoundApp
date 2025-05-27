export const getProducts = async () => {
  return await fetch('https://fakestoreapi.com/products').then(res =>
    res.json(),
  );
};
