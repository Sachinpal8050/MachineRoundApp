import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  AppState,
  TextInput,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import JobCard from './component/JjobCard';
import {getJobListingData} from './service/api';
import {JobPostType} from './types';
import {appDebounce} from './utils';

function App() {
  const [jobPostList, setJobPostList] = useState<JobPostType[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllFetched, setIsAllFetched] = useState(false);
  const [searchText, setSearchText] = useState('');
  const ref = useRef();
  const filterData = () => {
    const filtered = jobPostList?.filter(item =>
      item?.title?.toLowerCase().includes(searchText?.toLowerCase()),
    );
    setJobPostList(filtered);
  };

  const debounce = useMemo(() => {
    return appDebounce(3000, filterData);
  }, [jobPostList, searchText]);

  useEffect(() => {
    if (searchText) {
      debounce();
    }
  }, [searchText]);

  const fetchPostData = async () => {
    setIsLoading(true);
    const cont = new AbortController();
    ref.current = cont;

    const data = await getJobListingData(currPage, cont.signal);
    if (data.length === 0) {
      setIsAllFetched(true);
    }
    if (currPage == 1) {
      setJobPostList(data);
    } else {
      setJobPostList(prev => [...prev, ...data]);
    }
    setCurrPage(currPage + 1);
    setIsLoading(false);
  };

  useEffect(() => {
    const linstener = AppState.addEventListener('change', state => {
      if (state === 'background') {
        ref.current.abort();
      }
      if (state === 'active') {
        fetchPostData();
      }
    });

    fetchPostData();

    return () => {
      linstener.remove();
    };
  }, []);

  const onEndReached = async () => {
    if (!isAllFetched) {
      fetchPostData();
    }
  };

  const renderItem = ({item, index}: {item: JobPostType; index: number}) => {
    const {id, title, whatsapp_no, primary_details = {}} = item;
    return (
      <JobCard
        id={id}
        title={title}
        phoneNumber={whatsapp_no}
        salary={primary_details?.Salary}
        location={primary_details?.Place}
        key={index}
      />
    );
  };

  return (
    <View style={style.container}>
      <TextInput
        value={searchText}
        style={style.textInputStyle}
        onChangeText={text => setSearchText(text)}
      />
      <FlatList
        data={jobPostList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onEndReached={onEndReached}
        contentContainerStyle={style.listStyle}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size={'large'} /> : null
        }
      />
    </View>
  );
}

export default App;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#940fdb',
  },
  listStyle: {
    gap: 20,
  },
  textInputStyle: {
    borderWidth: 1,
  },
});
