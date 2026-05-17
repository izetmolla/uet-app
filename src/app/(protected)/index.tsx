import { Button, Text, View } from "react-native"

import useAuthorizationStore from "@/store/authorization"
import { router } from "expo-router"

export default function HomeScreen() {
    const user = useAuthorizationStore((s) => s.user)
    const signOut = useAuthorizationStore((s) => s.signOut)

    const handleLogout = async () => {
        signOut()
        router.replace("/login")
    }

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text>Welcome</Text>

            <Text>{user?.email}</Text>

            <Button title="Logout" onPress={handleLogout} />
        </View>
    )
}