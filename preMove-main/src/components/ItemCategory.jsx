import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import colors from '../theme/colors';
import LinearGradient from 'react-native-linear-gradient';

export default function ItemCategory({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(0); // ✅ default All

  // ✅ Backend se categories fetch karna
  useEffect(() => {
    fetch('http://192.168.0.155:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        // "All" ko manually prepend kar do
        const allOption = { id: 0, sub_category_name: 'All' };
        setCategories([allOption, ...data]);
      })
      .catch(err => console.error('❌ Error fetching categories:', err));
  }, []);

  const handleSelect = id => {
    setSelected(id);
    if (onSelect) onSelect(id); // ✅ parent ko selected id bhejna
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => handleSelect(cat.id)}
            style={{ borderRadius: 20, overflow: 'hidden' }}
          >
            {selected === cat.id ? (
              <LinearGradient
                colors={['#03B5A7', '#0189D5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.categoryBox}
              >
                <Text style={[styles.categoryText, styles.activeText]}>
                  {cat.sub_category_name}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.categoryBox}>
                <Text style={styles.categoryText}>{cat.sub_category_name}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingHorizontal: 5 },
  categoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    // fontWeight:'bold'
  },
  categoryText: { color: '#333', fontSize: 14, textAlign: 'center' },
  activeText: { color: '#fff', fontWeight: 'bold' },
});
