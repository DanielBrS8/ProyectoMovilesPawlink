import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const iconSize = width < 380 ? 20 : 24;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#7DD3C0",
        tabBarInactiveTintColor: "#718096",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          height: width < 380 ? 58 : 68,
          paddingBottom: width < 380 ? 6 : 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mascotas"
        options={{
          title: "Mascotas",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="paw" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="adopcion"
        options={{
          title: "Adopción",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart-outline" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="centros"
        options={{
          title: "Centros",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="hospital-building" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
