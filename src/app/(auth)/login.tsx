import { useRouter } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import useAuthorizationStore from "@/store/authorization"
import { Box } from "@/components/ui/box"
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button"
import {
    Checkbox,
    CheckboxIcon,
    CheckboxIndicator,
    CheckboxLabel,
} from "@/components/ui/checkbox"
import { Center } from "@/components/ui/center"
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText,
} from "@/components/ui/form-control"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import {
    AlertCircleIcon,
    CheckIcon,
    EyeIcon,
    EyeOffIcon,
} from "@/components/ui/icon"
import { Image } from "@/components/ui/image"
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

const MIN_PASSWORD_LENGTH = 6

export default function LoginScreen() {
    const router = useRouter()
    const signInUser = useAuthorizationStore((s) => s.signInUser)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [loading, setLoading] = useState(false)

    const passwordTooShort =
        password.length > 0 && password.length < MIN_PASSWORD_LENGTH
    const canSubmit =
        email.trim().length > 0 &&
        password.length >= MIN_PASSWORD_LENGTH &&
        !loading

    const handleLogin = async () => {
        if (password.length < MIN_PASSWORD_LENGTH) {
            setIsInvalid(true)
            return
        }

        setIsInvalid(false)
        setLoading(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 500))

            signInUser({
                tokens: {
                    access_token: "jwt-token",
                    refresh_token: "jwt-refresh-token",
                },
                user: {
                    id: "1",
                    email: email.trim(),
                    first_name: "Student",
                    last_name: "UET",
                    roles: ["student"],
                    created_at: new Date().toISOString(),
                },
            })

            router.replace("/")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box className="flex-1 bg-uet-navy-dark">
            <Box className="absolute -right-28 -top-20 h-72 w-72 rounded-full bg-uet-sky/20" />
            <Box className="absolute -left-24 bottom-32 h-56 w-56 rounded-full bg-uet-gold/10" />

            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        className="flex-1"
                        contentContainerClassName="grow"
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Center className="flex-1 px-6 py-10">
                            <VStack className="mb-8 items-center" space="md">
                                <Box className="h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-3">
                                    <Image
                                        size="full"
                                        source={require("@/assets/images/icon.png")}
                                        alt="UET App logo"
                                        className="h-full w-full"
                                    />
                                </Box>
                                <Heading
                                    size="2xl"
                                    className="text-center text-white"
                                >
                                    UET App
                                </Heading>
                                <Text
                                    size="sm"
                                    className="max-w-xs text-center text-typography-400"
                                >
                                    Sign in to access your courses, schedule,
                                    and campus services.
                                </Text>
                            </VStack>

                            <VStack
                                className="w-full max-w-[380px] rounded-2xl border border-outline-200 bg-background-0 p-6"
                                space="lg"
                            >
                                <VStack space="xs">
                                    <Heading size="lg">Welcome back</Heading>
                                    <Text
                                        size="sm"
                                        className="text-typography-500"
                                    >
                                        Enter your university credentials to
                                        continue.
                                    </Text>
                                </VStack>

                                <FormControl>
                                    <FormControlLabel>
                                        <FormControlLabelText>
                                            Email
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <Input variant="outline" size="lg">
                                        <InputField
                                            placeholder="name@uet.edu.al"
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            keyboardType="email-address"
                                            textContentType="emailAddress"
                                            editable={!loading}
                                        />
                                    </Input>
                                </FormControl>

                                <FormControl
                                    isInvalid={isInvalid || passwordTooShort}
                                >
                                    <FormControlLabel>
                                        <FormControlLabelText>
                                            Password
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <Input variant="outline" size="lg">
                                        <InputField
                                            placeholder="Enter your password"
                                            value={password}
                                            onChangeText={(value) => {
                                                setPassword(value)
                                                if (
                                                    value.length >=
                                                    MIN_PASSWORD_LENGTH
                                                ) {
                                                    setIsInvalid(false)
                                                }
                                            }}
                                            secureTextEntry={!showPassword}
                                            autoComplete="password"
                                            textContentType="password"
                                            editable={!loading}
                                            onSubmitEditing={handleLogin}
                                        />
                                        <InputSlot
                                            className="pr-3"
                                            onPress={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            <InputIcon
                                                as={
                                                    showPassword
                                                        ? EyeIcon
                                                        : EyeOffIcon
                                                }
                                            />
                                        </InputSlot>
                                    </Input>

                                    <FormControlHelper>
                                        <FormControlHelperText>
                                            Must be at least{" "}
                                            {MIN_PASSWORD_LENGTH} characters.
                                        </FormControlHelperText>
                                    </FormControlHelper>

                                    <FormControlError>
                                        <FormControlErrorIcon
                                            as={AlertCircleIcon}
                                        />
                                        <FormControlErrorText>
                                            At least {MIN_PASSWORD_LENGTH}{" "}
                                            characters are required.
                                        </FormControlErrorText>
                                    </FormControlError>
                                </FormControl>

                                <HStack className="items-center justify-between">
                                    <Checkbox
                                        size="sm"
                                        value="remember"
                                        isChecked={rememberMe}
                                        onChange={setRememberMe}
                                    >
                                        <CheckboxIndicator>
                                            <CheckboxIcon as={CheckIcon} />
                                        </CheckboxIndicator>
                                        <CheckboxLabel>
                                            Remember me
                                        </CheckboxLabel>
                                    </Checkbox>

                                    <Button
                                        variant="link"
                                        action="primary"
                                        size="sm"
                                        isDisabled={loading}
                                    >
                                        <ButtonText className="text-uet-sky">
                                            Forgot password?
                                        </ButtonText>
                                    </Button>
                                </HStack>

                                <Button
                                    size="lg"
                                    action="primary"
                                    className="w-full bg-uet-navy data-[hover=true]:bg-uet-navy-dark data-[active=true]:bg-uet-navy-dark"
                                    onPress={handleLogin}
                                    isDisabled={!canSubmit}
                                >
                                    {loading ? (
                                        <ButtonSpinner color="#ffffff" />
                                    ) : (
                                        <ButtonText>Sign in</ButtonText>
                                    )}
                                </Button>
                            </VStack>

                            <Text
                                size="xs"
                                className="mt-8 max-w-sm text-center text-typography-500"
                            >
                                University of Elbasan &quot;Ismail Qemali&quot;
                                {"\n"}
                                Secure access for students and staff
                            </Text>
                        </Center>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Box>
    )
}
