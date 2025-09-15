import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../utils/baseurl';
import {
  MagnifyingGlassIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
} from 'react-native-heroicons/solid';
import colors from '../../theme/colors';
import { ArrowRightIcon } from 'react-native-heroicons/outline';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 20;

export default function CustomerInventory({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetchCustomers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const rawJwt = await AsyncStorage.getItem('APP_JWT_TOKEN');
      if (!rawJwt) return console.log('❌ Missing token');
      const { token } = JSON.parse(rawJwt);

      const res = await api.get('/manager/customers', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNum, limit: 10, search },
      });

      if (pageNum === 1) setCustomers(res.data.customers);
      else setCustomers(prev => [...prev, ...res.data.customers]);

      setTotal(res.data.total);
      setPage(pageNum);
    } catch (err) {
      console.error('❌ Error fetching manager customers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, [search]);

  const loadMore = () => {
    if (customers.length < total && !loading) {
      fetchCustomers(page + 1);
    }
  };

  const filteredCustomers = customers.filter(cust =>
    cust.cust_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#edf2f7', padding: 10 }}>
      {/* Search Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
          backgroundColor: '#fff',
          borderRadius: 15,
          paddingHorizontal: 15,
          paddingVertical: 8,
          // shadowColor: '#000',
          // shadowOffset: { width: 0, height: 5 },
          // shadowOpacity: 0.1,
          // shadowRadius: 10,
          // elevation: 5,
        }}
      >
        <MagnifyingGlassIcon size={22} color="#555" />
        <TextInput
          placeholder="Search customers..."
          value={search}
          placeholderTextColor={colors.muted}
          onChangeText={setSearch}
          style={{ flex: 1, marginLeft: 10, fontSize: 16, color: '#333' }}
        />
      </View>

      {loading && <ActivityIndicator size="large" color={colors.primary} />}

      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingBottom: 20,
        }}
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent.contentOffset.y +
              nativeEvent.layoutMeasurement.height >=
            nativeEvent.contentSize.height - 20
          ) {
            loadMore();
          }
        }}
      >
        {filteredCustomers.map(customer => {
          const scaleAnim = new Animated.Value(1);

          const onPressIn = () => {
            Animated.spring(scaleAnim, {
              toValue: 0.97,
              useNativeDriver: true,
            }).start();
          };

          const onPressOut = () => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 4,
              useNativeDriver: true,
            }).start();
          };

          return (
            <Animated.View
              key={customer.id}
              style={{
                transform: [{ scale: scaleAnim }],
                width: CARD_WIDTH,
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={() =>
                  navigation.navigate('CustomerInventoryScreen', {
                    customerId: customer.id,
                  })
                }
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  padding: 15,
                  // shadowColor: '#000',
                  // shadowOffset: { width: 0, height: 8 },
                  // shadowOpacity: 0.12,
                  // shadowRadius: 50,
                  // elevation: 6,
                  borderLeftWidth: 5,
                  borderLeftColor: colors.primary,
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}
                >
                  {customer.cust_name}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}
                >
                  <MapPinIcon size={16} color="#555" />
                  <Text style={{ marginLeft: 6, color: '#555', fontSize: 14 }}>
                    {customer.city_name}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <PhoneIcon size={16} color="#555" />
                  <Text style={{ marginLeft: 6, color: '#555', fontSize: 14 }}>
                    {customer.cust_mobile}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ArrowRightIcon size={16} color={colors.primary} />
                  <Text
                    style={{
                      marginLeft: 6,
                      color: colors.primary,
                      fontSize: 14,
                    }}
                  >
                    View Inventory
                  </Text>
                </View>
                
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}
