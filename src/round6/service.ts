export const getNewsList = async ({page}: {page: number}) => {
  try {
    const response = await fetch(
      `https://testapi.getlokalapp.com/common/jobs?page=${page}`,
    );
    const data = await response.json();
    return {
      isSuccess: true,
      data: data.results,
    };
  } catch (err) {
    return {
      isSuccess: false,
      error: err,
    };
  }
};
