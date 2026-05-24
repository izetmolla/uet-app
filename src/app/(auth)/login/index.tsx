import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable } from "react-native";

import { signIn, SignInSchema, signInSchema } from "@/api/auth/login/indx";
import { AuthFooterLinks } from "@/components/auth/auth-footer-links";
import { AuthLogo } from "@/components/auth/auth-logo";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { AuthScreen } from "@/components/auth/auth-screen";
import { AuthSeparator } from "@/components/auth/auth-separator";
import {
    authHeadingClassName,
    authInputClassName,
    authLinkClassName,
    authSubtitleClassName,
} from "@/components/auth/auth-styles";
import { SocialLogin } from "@/components/auth/social-login";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlLabel,
    FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAppToast } from "@/hooks/use-app-toast";
import { getRequestErrorMessage } from "@/lib/network";
import useAuthorizationStore from "@/store/authorization";
import { useMutation } from "@tanstack/react-query";


/** When true, email and password are shown together for direct sign-in. When false, email is checked first. */
const show2fields = true;



export default function LoginScreen() {
    const { showError } = useAppToast()
    const router = useRouter()
    const signInUser = useAuthorizationStore((s) => s.signInUser)
    const [passwordVisible, setPasswordVisible] = useState(false)





    const form = useForm<SignInSchema>({
        resolver: standardSchemaResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            checkEmail: !show2fields,
        }
    })


    const mutation = useMutation({
        mutationFn: signIn,
        onSuccess: (data) => {
            if (data.user && data.tokens) {
                signInUser({ user: data.user, tokens: data.tokens })
                router.replace("/")
            } else {
                showError({
                    title: "Sign in failed",
                    description: "Unable to sign in. Please try again.",
                })
            }
        },
        onError: (error) => {
            showError({
                title: "Sign in failed",
                description: getRequestErrorMessage(
                    error,
                    "Unable to sign in. Please try again."
                ),
            })
        },
    })




    const handleSignIn = async () => {
        mutation.mutate(form.getValues())
    }

    const goToResetPassword = () => {
        const resetHref =
            `/(auth)/reset-password?email=${encodeURIComponent(form.getValues("email").trim())}` as Href
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
                <Controller
                    control={form.control}
                    render={({
                        field: { onChange, value },
                        fieldState: { error },
                    }) => (
                        <FormControl isInvalid={!!error}>
                            <FormControlLabel className="sr-only">
                                <FormControlLabelText>Email</FormControlLabelText>
                            </FormControlLabel>
                            <Input variant="outline" size="md" className={authInputClassName}>
                                <InputField
                                    placeholder="Email"
                                    className="placeholder:text-typography-500"
                                    value={value}
                                    onChangeText={onChange}
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    keyboardType="email-address"
                                    textContentType="emailAddress"
                                    editable={!mutation.isPending}
                                />
                            </Input>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} />
                                <FormControlErrorText>{error?.message}</FormControlErrorText>
                            </FormControlError>
                        </FormControl>
                    )}
                    name="email"
                />

                <Controller
                    control={form.control}
                    render={({
                        field: { onChange, value },
                        fieldState: { error },
                    }) => (

                        <FormControl isInvalid={!!error}>
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
                                    value={value}
                                    onChangeText={(value) => {
                                        onChange(value)
                                    }}
                                    secureTextEntry={!passwordVisible}
                                    autoComplete="password"
                                    textContentType="password"
                                    editable={!mutation.isPending}
                                    onSubmitEditing={handleSignIn}
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
                                    {error?.message}
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                    )}
                    name="password"
                />




                <HStack className="justify-end">
                    <Pressable
                        onPress={goToResetPassword}
                        disabled={mutation.isPending}
                        accessibilityRole="link"
                    >
                        <Text className={`${authLinkClassName} underline underline-offset-2`}>
                            Forgot password?
                        </Text>
                    </Pressable>
                </HStack>


                <AuthPrimaryButton
                    label="Sign in"
                    loading={mutation.isPending}
                    onPress={form.handleSubmit(handleSignIn)}
                />

                <AuthSeparator />

                <SocialLogin />

                <AuthFooterLinks />
            </VStack>
        </AuthScreen>
    )
}
