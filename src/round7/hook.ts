import {useCallback, useMemo, useState} from 'react';
import {getRecipes} from './service';
import {appDebounce} from '../round6/utils';

const cache = new Map();
const delay: number = 3000;
const CACHE_SIZE: number = 3;
export const useAutoSearch = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async (query: string) => {
    if (!query.length) {
      setSearchData([]);
      setLoader(false);
      return;
    }
    if (cache.has(query)) {
      setSearchData(cache.get(query));
      setLoader(false);
      return;
    }
    const data = await getRecipes({query});
    if (data.isSuccess) {
      if (cache.size > CACHE_SIZE) {
        cache.delete(cache.keys().next().value);
      }
      cache.set(query, data.data);
      setSearchData(data.data);
    } else {
      setError(data.error as string);
    }
    setLoader(false);
  }, []);

  const debounce = useMemo(() => {
    return appDebounce(fetchData, delay);
  }, [fetchData]);

  const handleChangeText = (text: string) => {
    if (!loader && searchQuery.length < text.length) {
      setLoader(true);
    }
    if (!text.length) {
      setSearchData([]);
      setLoader(false);
    }
    setSearchQuery(text);
    debounce(text);
  };

  return {
    state: {
      loader,
      searchData,
      error,
      searchQuery,
    },
    action: {
      handleChangeText,
    },
  };
};
