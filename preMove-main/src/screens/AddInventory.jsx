import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ItemCategory from '../components/ItemCategory';
import Header from '../components/Header';
import { AddItemCss } from '../assets/css/ScreensCss';
import LinearGradient from 'react-native-linear-gradient';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';
import colors from '../theme/colors';
const AddInventory = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState(''); // 🔍 search text

  // ✅ Load all items on mount
  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      const res = await fetch('http://192.168.0.155:5000/api/all-items');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('❌ Error fetching all items:', error);
    }
  };

  const fetchItems = async categoryId => {
    try {
      setSelectedCategory(categoryId);

      if (!categoryId) {
        // "All" selected
        fetchAllItems();
        return;
      }

      const res = await fetch(
        `http://192.168.0.155:5000/api/sub-category-items/${categoryId}`,
      );
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('❌ Error fetching items:', error);
    }
  };

  const increaseQuantity = id => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decreaseQuantity = id => {
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));
  };

  // ✅ Filter items by search text
  const filteredItems = items.filter(item =>
    item.sub_category_item_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <View style={AddItemCss.container}>
        <View style={AddItemCss.headerWrapper}>
          <Header />
        </View>

        {/* 🔍 Search Bar */}
        <View style={AddItemCss.searchwrap}>
          <View style={AddItemCss.searchContainer}>
            <MagnifyingGlassIcon
              name="search-outline"
              size={20}
              color="#555"
              style={AddItemCss.icon}
            />
            <TextInput
              placeholder="Search items..."
              value={search}
              onChangeText={setSearch}
              style={AddItemCss.input}
              placeholderTextColor={colors.muted}
            />
          </View>
        </View>

        <View style={AddItemCss.categoryWrapper}>
          <ItemCategory onSelect={fetchItems} />
        </View>

        <View style={AddItemCss.listWrapper}>
          <FlatList
            data={filteredItems}
            keyExtractor={item => item.id.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <View style={AddItemCss.card}>
                <Image
                  source={{
                    uri: `https://res.cloudinary.com/dfqledkbu/image/upload/premove_inventory/${item.sub_category_item_image}`,
                  }}
                  style={AddItemCss.itemImage}
                />
                <Text style={AddItemCss.itemName}>
                  {item.sub_category_item_name}
                </Text>

                <View style={AddItemCss.quantityWrapper}>
                  <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                    <Text style={AddItemCss.quantityBtn}>+</Text>
                  </TouchableOpacity>

                  <Text style={AddItemCss.quantityText}>
                    {quantities[item.id] || 0}
                  </Text>

                  <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                    <Text style={AddItemCss.quantityBtn}>-</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>

      <TouchableOpacity style={AddItemCss.addBtn}>
        <LinearGradient
          colors={['#03B5A7', '#0189D5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={AddItemCss.addBtn}
        >
          <Text style={AddItemCss.addBtnText}>Add Items</Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
};

export default AddInventory;
