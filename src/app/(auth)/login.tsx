import { type Href, useRouter } from "expo-router"
import { useState } from "react"
import { Pressable } from "react-native"

import { AuthFooterLinks } from "@/components/auth/auth-footer-links"
import { AuthLogo } from "@/components/auth/auth-logo"
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button"
import { AuthScreen } from "@/components/auth/auth-screen"
import { AuthSeparator } from "@/components/auth/auth-separator"
import {
    authHeadingClassName,
    authInputClassName,
    authLinkClassName,
    authSubtitleClassName,
} from "@/components/auth/auth-styles"
import { SocialLogin } from "@/components/auth/social-login"
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlLabel,
    FormControlLabelText,
} from "@/components/ui/form-control"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon"
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import useAuthorizationStore from "@/store/authorization"

const MIN_PASSWORD_LENGTH = 6

export default function LoginScreen() {
    const router = useRouter()
    const signInUser = useAuthorizationStore((s) => s.signInUser)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPasswordField, setShowPasswordField] = useState(false)
    const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const resetPasswordStep = () => {
        setShowPasswordField(false)
        setConfirmedEmail(null)
        setPassword("")
        setPasswordError(null)
    }

    const handleEmailChange = (value: string) => {
        setEmail(value)
        setEmailError(null)

        if (
            showPasswordField &&
            confirmedEmail !== null &&
            value.trim() !== confirmedEmail
        ) {
            resetPasswordStep()
        }
    }

    const validateEmail = () => {
        const trimmed = email.trim()

        if (!trimmed) {
            setEmailError("Please enter your email or username")
            return false
        }

        setEmailError(null)
        return true
    }

    const validatePassword = () => {
        if (password.length < MIN_PASSWORD_LENGTH) {
            setPasswordError(
                `At least ${MIN_PASSWORD_LENGTH} characters are required.`
            )
            return false
        }

        setPasswordError(null)
        return true
    }

    const handleContinueWithEmail = () => {
        if (!validateEmail()) return

        setConfirmedEmail(email.trim())
        setShowPasswordField(true)
        setPassword("")
    }

    const handleSignIn = async () => {
        if (!validatePassword()) return

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
            // Root layout auth guard handles redirect to home.
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = () => {
        if (!showPasswordField) {
            handleContinueWithEmail()
            return
        }

        handleSignIn()
    }

    const goToResetPassword = () => {
        const resetHref =
            `/(auth)/reset-password?email=${encodeURIComponent(email.trim())}` as Href
        router.push(resetHref)
    }

    return (
        <AuthScreen>
            <VStack space="md">
                <HStack className="mb-2 items-start justify-between">
                    <AuthLogo />
                </HStack>

                <VStack space="xs" className="mb-2">
                    <Heading size="xl" className={authHeadingClassName}>
                        Log in
                    </Heading>
                    <Text className={authSubtitleClassName}>
                        Continue to UET App
                    </Text>
                </VStack>

                <FormControl isInvalid={!!emailError}>
                    <FormControlLabel className="sr-only">
                        <FormControlLabelText>Email</FormControlLabelText>
                    </FormControlLabel>
                    <Input variant="outline" size="md" className={authInputClassName}>
                        <InputField
                            placeholder="Email"
                            className="placeholder:text-typography-500"
                            value={email}
                            onChangeText={handleEmailChange}
                            autoCapitalize="none"
                            autoComplete="email"
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            editable={!loading}
                            onSubmitEditing={
                                showPasswordField ? undefined : handleSubmit
                            }
                        />
                    </Input>
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>{emailError}</FormControlErrorText>
                    </FormControlError>
                </FormControl>

                {showPasswordField && (
                    <FormControl isInvalid={!!passwordError}>
                        <FormControlLabel className="sr-only">
                            <FormControlLabelText>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input
                            variant="outline"
                            size="md"
                            className={authInputClassName}
                        >
                            <InputField
                                placeholder="Password"
                                className="placeholder:text-typography-500"
                                value={password}
                                onChangeText={(value) => {
                                    setPassword(value)
                                    if (
                                        value.length >= MIN_PASSWORD_LENGTH
                                    ) {
                                        setPasswordError(null)
                                    }
                                }}
                                secureTextEntry={!passwordVisible}
                                autoComplete="password"
                                textContentType="password"
                                editable={!loading}
                                onSubmitEditing={handleSubmit}
                            />
                            <InputSlot
                                className="pr-3"
                                onPress={() =>
                                    setPasswordVisible(!passwordVisible)
                                }
                            >
                                <InputIcon
                                    as={
                                        passwordVisible
                                            ? EyeIcon
                                            : EyeOffIcon
                                    }
                                />
                            </InputSlot>
                        </Input>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>
                                {passwordError}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                )}

                {showPasswordField && (
                    <HStack className="justify-end">
                        <Pressable
                            onPress={goToResetPassword}
                            disabled={loading}
                            accessibilityRole="link"
                        >
                            <Text className={`${authLinkClassName} underline underline-offset-2`}>
                                Forgot password?
                            </Text>
                        </Pressable>
                    </HStack>
                )}

                <AuthPrimaryButton
                    label={
                        showPasswordField
                            ? "Sign in"
                            : "Continue with email"
                    }
                    loading={loading}
                    disabled={
                        showPasswordField
                            ? !email.trim() || password.length < MIN_PASSWORD_LENGTH
                            : !email.trim()
                    }
                    onPress={handleSubmit}
                />

                <AuthSeparator />

                <SocialLogin />

                <AuthFooterLinks />
            </VStack>
        </AuthScreen>
    )
}
