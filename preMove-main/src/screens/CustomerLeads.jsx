import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../utils/baseurl"; // axios instance

const CustomerLeads = () => {
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
                                <Text
                                    style={styles.city}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
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
                                <Text style={styles.value}>
                                    {item.inventory || "0"} Items
                                </Text>
                            </Text>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.btnText}>View Inventory</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: "#f4f6f9" },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    colLeft: { flex: 1, marginRight: 6 },
    colRight: { flex: 1, marginLeft: 6 },
    label: { fontSize: 12, color: "#888", marginBottom: 4 },
    city: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2d3436",
    },
    arrow: { fontSize: 18, color: "#636e72", paddingHorizontal: 8 },
    value: { fontSize: 14, fontWeight: "500", color: "#2d3436" },
    btn: {
        backgroundColor: "#00b894",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    btnText: { color: "#fff", fontWeight: "600" },
    error: { textAlign: "center", marginTop: 20, color: "red" },
});

export default CustomerLeads;
