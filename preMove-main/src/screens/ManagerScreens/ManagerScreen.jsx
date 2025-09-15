import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../utils/baseurl';
import colors from '../../theme/colors';
import {
  MapPinIcon,
  PhoneIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/solid';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 20;

export default function Dashboard({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (search.trim() === '') setFilteredCustomers(customers);
    else {
      const filtered = customers.filter(
        cust =>
          cust.cust_name.toLowerCase().includes(search.toLowerCase()) ||
          cust.city_name.toLowerCase().includes(search.toLowerCase()) ||
          cust.cust_mobile.includes(search)
      );
      setFilteredCustomers(filtered);
    }
  }, [search, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const rawJwt = await AsyncStorage.getItem('APP_JWT_TOKEN');
      if (!rawJwt) return;

      const { token } = JSON.parse(rawJwt);

      const res = await api.get('/manager/dashboard/customers', {
        headers: { Authorization: `Bearer ${token}` },
        params: { spanco: 's' },
      });

      setCustomers(res.data.customers || []);
      setFilteredCustomers(res.data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: '#f5f7fa' }}>
      {/* Search Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15,
          backgroundColor: '#fff',
          borderRadius: 25,
          paddingHorizontal: 15,
          paddingVertical: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <MagnifyingGlassIcon size={22} color="#555" />
        <TextInput
          placeholder="Search customers..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#333' }}
        />
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      )}

      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingBottom: 20,
        }}
      >
        {filteredCustomers.map(customer => {
          const scaleAnim = new Animated.Value(1);

          const onPressIn = () => {
            Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
          };

          const onPressOut = () => {
            Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
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
                  navigation.navigate('CustomerInventoryScreen', { customerId: customer.id })
                }
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                {/* Gradient / Image Background */}
                <ImageBackground
                  source={{ uri: 'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=600&q=80' }}
                  style={{ height: 100, justifyContent: 'flex-end', padding: 10 }}
                  imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                  resizeMode="cover"
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 'bold',
                      textShadowColor: 'rgba(0,0,0,0.5)',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                    }}
                  >
                    {customer.cust_name}
                  </Text>
                </ImageBackground>

                <View style={{ padding: 12 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <MapPinIcon size={16} color={colors.primary} />
                    <Text style={{ marginLeft: 6, color: '#555', fontSize: 14 }}>
                      {customer.city_name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <PhoneIcon size={16} color={colors.primary} />
                    <Text style={{ marginLeft: 6, color: '#555', fontSize: 14 }}>
                      {customer.cust_mobile}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 6,
                      paddingVertical: 6,
                      justifyContent: 'center',
                      backgroundColor: colors.primary,
                      borderRadius: 10,
                    }}
                    onPress={() =>
                      navigation.navigate('CustomerInventoryScreen', { customerId: customer.id })
                    }
                  >
                    <ArrowRightIcon size={16} color="#fff" />
                    <Text style={{ marginLeft: 6, color: '#fff', fontWeight: 'bold' }}>
                      View Inventory
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}
