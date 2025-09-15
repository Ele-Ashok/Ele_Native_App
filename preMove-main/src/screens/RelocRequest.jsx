// src/screens/RelocationRequestScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  RelocRequestScreenCssheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from 'react-native-geolocation-service';
import colors from '../theme/colors';
import { RelocRequestScreenCss } from '../assets/css/ScreensCss';
import GradientText from '../components/GradientText';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';

const RelocRequest = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    moveType: '',
    fromCity: '',
    toCity: '',
    moveDate: new Date(),
    homeSize: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  // 🔹 Handle form input changes
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // 🔹 Handle date picker
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || form.moveDate;
    setShowDatePicker(Platform.OS === 'ios');
    handleChange('moveDate', currentDate);
  };

  // 🔹 Ask for location permission
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your location to auto-fill pickup city',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') {
          getCurrentLocation();
        }
      }
    } catch (err) {
      console.warn('Permission error:', err);
    }
  };

  // 🔹 Get current location (lat/lng) and fetch city name from Nominatim API
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        console.log('Lat/Lng:', latitude, longitude);

        try {
          // 🌍 Using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                'User-Agent': 'PreMoveApp/1.0 (your-email@example.com)', // Nominatim requires this
              },
            },
          );
          const data = await response.json();

          if (data && data.address) {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.county ||
              data.address.state ||
              data.address.country; // multiple fallbacks

            if (city) {
              handleChange('fromCity', city);
            }
          }
        } catch (error) {
          console.log('Error fetching city:', error);
        }
      },
      error => {
        console.log('Location error:', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  // 🔹 Run when screen loads
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const navigation = useNavigation();

  return (
    <ScrollView
      style={RelocRequestScreenCss.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      {/* <Text style={RelocRequestScreenCss.header}>PreMove</Text> */}
      <GradientText
        text="Relocation Request"
        style={RelocRequestScreenCss.title}
      />

      {/* Form Fields */}
      <View style={RelocRequestScreenCss.form}>
        <Text style={RelocRequestScreenCss.label}>Full Name</Text>
        <TextInput
          style={RelocRequestScreenCss.input}
          placeholder="Enter full name"
          placeholderTextColor={colors.muted}
          value={form.fullName}
          onChangeText={text => handleChange('fullName', text)}
        />

        <Text style={RelocRequestScreenCss.label}>Email</Text>
        <TextInput
          style={RelocRequestScreenCss.input}
          placeholder="Enter email"
          keyboardType="email-address"
          placeholderTextColor={colors.muted}
          value={form.email}
          onChangeText={text => handleChange('email', text)}
        />

        <Text style={RelocRequestScreenCss.label}>Phone number</Text>
        <View style={RelocRequestScreenCss.phoneRow}>
          <View style={RelocRequestScreenCss.codeBox}>
            <Text style={RelocRequestScreenCss.codeText}>+91</Text>
          </View>
          <TextInput
            style={[RelocRequestScreenCss.input, { flex: 1 }]}
            placeholder="Phone number"
            keyboardType="phone-pad"
            placeholderTextColor={colors.muted}
            value={form.phone}
            onChangeText={text => handleChange('phone', text)}
          />
        </View>

        <Text style={RelocRequestScreenCss.label}>Select Services</Text>
        <TextInput
          style={RelocRequestScreenCss.input}
          placeholder="Enter services"
          placeholderTextColor={colors.muted}
          value={form.service}
          onChangeText={text => handleChange('service', text)}
        />

        <Text style={RelocRequestScreenCss.label}>Select Move Type</Text>
        <TextInput
          style={RelocRequestScreenCss.input}
          placeholder="Enter move type"
          placeholderTextColor={colors.muted}
          value={form.moveType}
          onChangeText={text => handleChange('moveType', text)}
        />

        <Text style={RelocRequestScreenCss.label}>Pick Up Location</Text>
        <TextInput
          style={RelocRequestScreenCss.input}
          placeholder="Enter Pick Up Location"
          placeholderTextColor={colors.muted}
          value={form.fromCity}
          onChangeText={text => handleChange('fromCity', text)}
        />

        <Text style={RelocRequestScreenCss.label}>Drop Location</Text>
        <TextInput
          style={RelocRequestScreenCss.input}
          placeholder="Enter Drop Location"
          placeholderTextColor={colors.muted}
          value={form.toCity}
          onChangeText={text => handleChange('toCity', text)}
        />

        {/* Date Picker */}
        <Text style={RelocRequestScreenCss.label}>Moving Date</Text>
        <TouchableOpacity
          style={RelocRequestScreenCss.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: form.moveDate ? '#000' : '#aaa' }}>
            {form.moveDate
              ? form.moveDate.toDateString()
              : 'Select moving date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={form.moveDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        {/* Home Size */}
        <Text style={RelocRequestScreenCss.label}>Home Size</Text>
        <TextInput
          style={RelocRequestScreenCss.input}
          placeholder="e.g. 2 BHK / 3 BHK / Villa"
          placeholderTextColor={colors.muted}
          value={form.homeSize}
          onChangeText={text => handleChange('homeSize', text)}
        />

        {/* Submit Button */}
        <TouchableOpacity onPress={() => navigation.navigate('AddItem')}>
          <GradientBackground style={RelocRequestScreenCss.button}>
            <Text style={RelocRequestScreenCss.buttonText}>Submit Request</Text>
          </GradientBackground>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default RelocRequest;
