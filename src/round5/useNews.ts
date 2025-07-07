import {useState} from 'react';
import {NEWS_DATA} from './data';
import {NewsType} from './types';

export const useNews = () => {
  const [news, setNews] = useState(NEWS_DATA.newsList);
  const [filters] = useState(NEWS_DATA.filters);
  const [selectedFilter, setSelectedFilter] = useState<NewsType>('All');

  const onSelectFilter = (selected: NewsType) => {
    setSelectedFilter(selected);
    if (selected === 'All') {
      setNews([...NEWS_DATA.newsList]);
    } else {
      setNews(NEWS_DATA.newsList.filter(item => item.newType === selected));
    }
  };

  return {
    state: {
      news,
      filters,
      selectedFilter,
    },
    action: {
      onSelectFilter,
    },
  };
};
