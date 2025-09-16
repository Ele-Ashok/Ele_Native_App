import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../utils/baseurl"; // axios instance
import { CustomerLeadsCss as styles } from "../assets/css/ScreensCss"; // ✅ Import separate css
import { useNavigation } from "@react-navigation/native";

const CustomerLeads = () => {
    const navigation = useNavigation();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const phone = await AsyncStorage.getItem("USER_PHONE");
                if (!phone) {
                    setError("Phone number not found in storage");
                    setLoading(false);
                    return;
                }

                const res = await api.get(`/customer/leads/${phone}`);
                if (res.data.success) {
                    setLeads(res.data.leads);
                } else {
                    setError("No leads found");
                }
            } catch (err) {
                console.error("❌ API Error:", err.response?.data || err.message);
                setError("Error fetching leads");
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    if (loading)
        return (
            <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        );
    if (error) return <Text style={styles.error}>{error}</Text>;
    return (
        <View style={styles.container}>
            <FlatList
                data={leads}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {/* From ⇄ To */}
                        <View style={styles.rowBetween}>
                            <View style={styles.colLeft}>
                                <Text style={styles.label}>FROM</Text>
                                <Text style={styles.city} numberOfLines={1} ellipsizeMode="tail">
                                    {item.moving_from}
                                </Text>
                            </View>

                            <Text style={styles.arrow}>⇄</Text>

                            <View style={styles.colRight}>
                                <Text style={styles.label}>TO</Text>
                                <Text
                                    style={[styles.city, { textAlign: "right" }]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.moving_to}
                                </Text>
                            </View>
                        </View>

                        {/* Travel Date & Service Type */}
                        <View style={styles.rowBetween}>
                            <View>
                                <Text style={styles.label}>MOVE DATE</Text>
                                <Text style={styles.value}>
                                    {new Date(item.moving_date).toLocaleDateString("en-GB")}
                                </Text>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={styles.label}>SERVICE TYPE</Text>
                                <Text style={styles.value}>{item.moving_type}</Text>
                            </View>
                        </View>

                        {/* Inventory & Button */}
                        <View style={styles.rowBetween}>
                            <Text style={styles.label}>
                                INVENTORY:{" "}
                                <Text style={styles.value}>{item.inventory || "0"} Items</Text>
                            </Text>
                            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Inventory", { id: item.id })}>
                                <Text style={styles.btnText}>View Inventory</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default CustomerLeads;
