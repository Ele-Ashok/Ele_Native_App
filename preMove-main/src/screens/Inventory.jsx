import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InventoryItem from '../components/InventoryItem';
import { InventoryScreenCss } from '../assets/css/ScreensCss';
import colors from '../theme/colors';
import { api } from '../utils/baseurl';
export default function InventoryScreen() {
  const [expanded, setExpanded] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    if (expanded) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => setExpanded(false));
    } else {
      setExpanded(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  };

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 510],
  });

  // Fetch customer and inventory
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Get user details and JWT
        const rawUser = await AsyncStorage.getItem('USER_DETAILS');
        const rawJwt = await AsyncStorage.getItem('APP_JWT_TOKEN');
        const leadId = await AsyncStorage.getItem('USER_ID');
        console.log('rawUser', rawUser);
        console.log('rawJwt', rawJwt);
        console.log('leadId', leadId);

        if (!rawUser || !rawJwt || !leadId) {
          console.log('❌ Missing session data');
          setLoading(false);
          return;
        }

        const user = JSON.parse(rawUser);
        setCustomer(user);

        const { token } = JSON.parse(rawJwt);

        // 2️⃣ Fetch inventory
        const res = await api.get(`/inventory/${leadId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const invData = res.data; // ✅ axios me yahi sahi hai

        if (!invData || !Array.isArray(invData)) {
          console.log('❌ Invalid inventory data');
          setLoading(false);
          return;
        }

        // 3️⃣ Fetch sub-category details for each item
        const inventoryWithName = await Promise.all(
          invData.map(async item => {
            try {
              const { data: subItem } = await api.get(
                `sub-category-item/${item.sub_category_item_id}`,
              );

              return {
                ...item,
                sub_category_item_name:
                  subItem?.sub_category_item_name || 'N/A',
                sub_category_item_image: subItem?.sub_category_item_image
                  ? `https://res.cloudinary.com/dfqledkbu/image/upload/v1757054818/premove_inventory/${subItem.sub_category_item_image}`
                  : null,
              };
            } catch (err) {
              console.error('❌ Sub-category fetch error:', err.message);
              return {
                ...item,
                sub_category_item_name: 'N/A',
                sub_category_item_image: null,
              };
            }
          }),
        );

        setInventory(inventoryWithName);
      } catch (err) {
        console.error('❌ Error fetching inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  const mapLift = value => {
    switch (value) {
      case 0:
        return 'No Service Lift';
      case 1:
        return 'Service Lift';
      case 2:
        return 'Small Lift';
      default:
        return 'N/A';
    }
  };

  return (
    <View style={InventoryScreenCss.container}>
      <ScrollView style={{ flex: 1, padding: 10 }}>
        {customer && (
          <Animated.View style={InventoryScreenCss.customerDetailsContainer}>
            <TouchableOpacity onPress={toggleExpand}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  alignItems: 'flex-start',
                }}
              >
                {/* Always visible top rows */}
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ flex: 1, padding: 8, fontWeight: 'bold' }}>
                    Phone
                  </Text>
                  <Text style={{ paddingHorizontal: 4 }}>:</Text>
                  <Text style={{ flex: 1, padding: 8 }}>
                    {customer.cust_mobile}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ flex: 1, padding: 8, fontWeight: 'bold' }}>
                    Email
                  </Text>
                  <Text style={{ paddingHorizontal: 4 }}>:</Text>
                  <Text style={{ flex: 1, padding: 8 }}>
                    {customer.cust_email}
                  </Text>
                </View>
              </View>

              {/* Animated expanding section */}
              <Animated.View
                style={{ overflow: 'hidden', height: animatedHeight }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    marginTop: 10,
                  }}
                >
                  {[
                    { label: 'Moving Date', value: customer.moving_date },
                    { label: 'Home Size', value: customer.home_type_id },
                    { label: 'Moving From', value: customer.moving_from },
                    { label: 'Moving To', value: customer.moving_to },
                    {
                      label: 'Loading Floor No',
                      value: customer.moving_from_floor_no,
                    },
                    {
                      label: 'Unloading Floor No',
                      value: customer.moving_to_floor_no,
                    },
                    {
                      label: 'Loading Services',
                      value: mapLift(customer.moving_from_service_lift),
                    },
                    {
                      label: 'Unloading Services',
                      value: mapLift(customer.moving_to_service_lift),
                    },
                    { label: 'Moving Type', value: customer.moving_type },
                    { label: 'Distance', value: customer.approx_dist },
                  ].map((row, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        borderBottomWidth: index < 9 ? 1 : 0,
                        borderColor: '#ccc',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ flex: 1, padding: 8, fontWeight: 'bold' }}>
                        {row.label}
                      </Text>
                      <Text style={{ paddingHorizontal: 4 }}>:</Text>
                      <Text style={{ flex: 1, padding: 8 }}>{row.value}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>

              {/* Divider */}
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    width: 150,
                    backgroundColor: colors.primary,
                    height: 2,
                  }}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Inventory items */}
        {inventory.map((item, index) => (
          <InventoryItem
            key={index}
            name={item.sub_category_item_name || 'N/A'}
            qty={item.quantity || 0}
            image={item.sub_category_item_image} // this will be null if no image
            onCameraPress={() =>
              alert(`Open camera for ${item.sub_category_item_name}`)
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
