import {useCallback, useEffect, useMemo, useState} from 'react';
import {getNewsList} from './service';
import {appDebounce} from './utils';

export const useNewsList = () => {
  const [newsList, setNewList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isAllDataFetched, setIsAllDataFetched] = useState(false);
  const [searchedData, setSearchedData] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (!searchText.length) {
      setSearchedData(null);
    }
  }, [searchText]);

  const fetchNews = async () => {
    setIsLoading(true);
    const data = await getNewsList({page: currentPage});
    if (data.isSuccess) {
      setNewList(prev => [...prev, ...data.data]);
      setCurrentPage(prev => prev + 1);
      if (!data.data.length) {
        setIsAllDataFetched(true);
      }
    } else {
      setError(data.error as string);
    }
    setIsLoading(false);
  };

  const onEndReached = () => {
    if (!isAllDataFetched) {
      fetchNews();
    }
  };

  const filterData = useCallback(
    (text: string) => {
      const updatedData = newsList.filter(item =>
        item?.title?.toLowerCase().includes(text.toLowerCase()),
      );
      setSearchedData(updatedData);
    },
    [newsList],
  );

  const debouncedFilter = useMemo(
    () => appDebounce(filterData, 100),
    [filterData],
  );

  const handleChangeText = (text: string) => {
    setSearchText(text);
    debouncedFilter(text);
  };

  return {
    state: {
      newsList,
      error,
      isLoading,
      searchText,
      searchedData,
    },
    actions: {
      fetchNews,
      onEndReached,
      handleChangeText,
    },
  };
};
