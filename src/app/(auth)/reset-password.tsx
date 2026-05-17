import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"

import { AuthFooterLinks } from "@/components/auth/auth-footer-links"
import { AuthLogo } from "@/components/auth/auth-logo"
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button"
import { AuthScreen } from "@/components/auth/auth-screen"
import { AuthSeparator } from "@/components/auth/auth-separator"
import {
    authHeadingClassName,
    authInputClassName,
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
import { AlertCircleIcon } from "@/components/ui/icon"
import { Input, InputField } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

export default function ResetPasswordScreen() {
    const router = useRouter()
    const { email: emailParam } = useLocalSearchParams<{ email?: string }>()

    const [email, setEmail] = useState(
        typeof emailParam === "string" ? emailParam : ""
    )
    const [emailError, setEmailError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleReset = async () => {
        const trimmed = email.trim()

        if (!trimmed) {
            setEmailError("Please enter your email")
            return
        }

        setEmailError(null)
        setLoading(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 500))
            setSubmitted(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthScreen>
            <VStack space="md">
                <AuthLogo />

                <VStack space="xs" className="mb-2">
                    <Heading size="xl" className={authHeadingClassName}>
                        Reset Password
                    </Heading>
                    <Text className={authSubtitleClassName}>
                        Continue to UET App
                    </Text>
                </VStack>

                {submitted ? (
                    <Text size="sm" className="text-typography-600">
                        If an account exists for {email.trim()}, you will receive
                        reset instructions shortly.
                    </Text>
                ) : (
                    <FormControl isInvalid={!!emailError}>
                        <FormControlLabel className="sr-only">
                            <FormControlLabelText>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Input
                            variant="outline"
                            size="md"
                            className={authInputClassName}
                        >
                            <InputField
                                placeholder="Email"
                                className="placeholder:text-typography-500"
                                value={email}
                                onChangeText={(value) => {
                                    setEmail(value)
                                    setEmailError(null)
                                }}
                                autoCapitalize="none"
                                autoComplete="email"
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                editable={!loading}
                                onSubmitEditing={handleReset}
                            />
                        </Input>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>
                                {emailError}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                )}

                {!submitted && (
                    <AuthPrimaryButton
                        label="Reset Password"
                        loading={loading}
                        disabled={!email.trim()}
                        onPress={handleReset}
                    />
                )}

                {submitted && (
                    <AuthPrimaryButton
                        label="Back to log in"
                        onPress={() => router.replace("/login")}
                    />
                )}

                <AuthSeparator />

                <SocialLogin />

                <AuthFooterLinks />
            </VStack>
        </AuthScreen>
    )
}
