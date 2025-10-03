import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.replace("Login");
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.error) {
          navigation.replace("Login");
        } else {
          setUser(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        navigation.replace("Login");
      }
    };

    loadUser();
  }, [navigation]);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading user...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome, {user.name}!</Text>
      <Text>Email: {user.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
