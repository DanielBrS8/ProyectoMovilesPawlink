import { Drawer } from "expo-router/drawer";
import DrawerPersonalizado from "../../components/DrawerPersonalizado";

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerPersonalizado {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Inicio" }} />
    </Drawer>
  );
}
