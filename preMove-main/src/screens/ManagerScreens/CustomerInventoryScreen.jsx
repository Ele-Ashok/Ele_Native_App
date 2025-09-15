import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../utils/baseurl';
import colors from '../../theme/colors';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';
import {
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  ArrowRightIcon,
} from 'react-native-heroicons/outline';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 20;

export default function CustomerInventoryScreen({ route }) {
  const { customerId } = route.params;
  const [inventory, setInventory] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawJwt = await AsyncStorage.getItem('APP_JWT_TOKEN');
        if (!rawJwt) return console.log('❌ Missing token');
        const { token } = JSON.parse(rawJwt);

        // Fetch customer inventory
        const response = await api.get(
          `/manager/customers/${customerId}/inventory`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setInventory(response.data.inventory || []);

        // Fetch customer details separately
        const custRes = await api.get(`/manager/customers/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(custRes.data.customer || null);
      } catch (err) {
        console.error('❌ Error fetching inventory or customer:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  if (!customer)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#555' }}>Customer not found</Text>
      </View>
    );

  return (
    <View style={{ height: '100%' }}>
      <View>
        <Header />
      </View>
      <ScrollView style={{ flex: 1, padding: 10, backgroundColor: '#f2f5f9' }}>
        {/* Customer Info Card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            borderLeftWidth: 5,
            borderLeftColor: colors.primary,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
            {customer.cust_name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}
          >
            <PhoneIcon size={16} color="#555" />
            <Text style={{ marginLeft: 6, color: '#555', fontSize: 14 }}>
              {customer.cust_mobile}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}
          >
            <IdentificationIcon size={16} color="#555" />
            <Text style={{ marginLeft: 6, color: '#555', fontSize: 14 }}>
              {customer.cust_email}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MapPinIcon size={16} color="#555" />
            <Text style={{ marginLeft: 6, color: '#555', fontSize: 14 }}>
              Move From: {customer.moving_from || 'N/A'} → To:{' '}
              {customer.moving_to || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Inventory Cards */}
        {inventory.length === 0 ? (
          <Text style={{ textAlign: 'center', fontSize: 16, color: '#555' }}>
            No inventory found
          </Text>
        ) : (
          inventory.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={{
                width: CARD_WIDTH,
                backgroundColor: '#fff',
                borderRadius: 15,
                padding: 20,
                marginBottom: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                borderLeftWidth: 5,
                borderLeftColor: colors.primary,
                flexDirection:'row',
                justifyContent:'space-between'
              }}
            >
              <View style={{width:'50%'}}>
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
                >
                  {item.item_name}
                </Text>
                <Text style={{ fontSize: 16, color: '#333', marginBottom: 5 }}>
                  Quantity: {item.quantity}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.item_status === 'in' ? (
                    <CheckCircleIcon size={20} color="green" />
                  ) : (
                    <XCircleIcon size={20} color="red" />
                  )}
                  <Text style={{ marginLeft: 6, fontSize: 16, color: '#555' }}>
                    Status: {item.item_status || 'N/A'}
                  </Text>
                </View>
              </View>
              <View>
                <ImageBackground
                  source={{
                    uri: 'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=600&q=80',
                  }}
                  style={{
                    height: 100,
                    justifyContent: 'flex-end',
                    padding: 10,
                  }}
                  imageStyle={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}
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
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
