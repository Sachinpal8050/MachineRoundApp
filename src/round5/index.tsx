import React, {useState, useCallback} from 'react';
import {
  TextInput,
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';

// In-memory cache
const cache = new Map<string, any[]>();

// Debounce function
function debounce<T extends (...args: any[]) => void>(func: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Highlight matched text
function highlightMatch(text: string, query: string) {
  const regex = new RegExp(`(${query})`, 'i');
  let reg = new RegExp(`(${query})`, 'i');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <Text key={index} style={{color: 'orange', fontWeight: 'bold'}}>
        {part}
      </Text>
    ) : (
      <Text key={index}>{part}</Text>
    ),
  );
}

export default function Round5() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (cache.has(q)) {
        setResults(cache.get(q)!);
      } else {
        const res = await fetch(`https://dummyjson.com/recipes/search?q=${q}`);
        const data = await res.json();
        cache.set(q, data.recipes);
        setResults(data.recipes);
      }
    } catch (err) {
      setError('Failed to fetch suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchData, 500), []);

  const handleChange = (text: string) => {
    setQuery(text);
    debouncedFetch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={handleChange}
        placeholder="Search for recipes..."
        style={styles.input}
      />

      {loading && <ActivityIndicator style={{marginTop: 10}} />}
      {error !== '' && <Text style={styles.error}>{"error"}</Text>}

      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Pressable style={styles.item}>
            {highlightMatch(item.name, query)}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
});
