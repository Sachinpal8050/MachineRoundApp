export const getRecipes = async ({query}: {query: string}) => {
  console.log('apicalll-->>>>', query);
  try {
    const response = await fetch(
      `https://dummyjson.com/recipes/search?q=${query}`,
    );
    const data = await response.json();
    return {
      isSuccess: true,
      data: data.recipes,
    };
  } catch (err) {
    return {
      isSuccess: false,
      error: err,
    };
  }
};
