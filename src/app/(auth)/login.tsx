import { useRouter } from "expo-router"
import { Button, Text, View } from "react-native"

import useAuthorizationStore from "@/store/authorization"

export default function LoginScreen() {
    const router = useRouter()

    const signInUser = useAuthorizationStore((s) => s.signInUser)

    const handleLogin = async () => {
        // fake api request

        signInUser({
            tokens: {
                access_token: "jwt-token",
                refresh_token: "jwt-refresh-token",
            },
            user: {
                id: "1",
                email: "test@test.com",
                first_name: "Test",
                last_name: "Test",
                roles: ["admin"],
                created_at: new Date().toISOString(),
            },
        })

        router.replace("/")
    }

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text>Login</Text>

            <Button title="Login" onPress={handleLogin} />
        </View>
    )
}