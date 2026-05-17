import Svg, { Rect } from "react-native-svg"

import { authSocialButtonClassName } from "@/components/auth/auth-styles"
import { Button, ButtonText } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"

function MicrosoftLogo() {
    return (
        <Svg width={21} height={21} viewBox="0 0 21 21" accessibilityLabel="">
            <Rect x={1} y={1} width={9} height={9} fill="#f25022" />
            <Rect x={11} y={1} width={9} height={9} fill="#7fba00" />
            <Rect x={1} y={11} width={9} height={9} fill="#00a4ef" />
            <Rect x={11} y={11} width={9} height={9} fill="#ffb900" />
        </Svg>
    )
}

export function SocialLogin() {
    return (
        <Button
            variant="outline"
            action="default"
            size="md"
            isDisabled
            className={`${authSocialButtonClassName} data-[disabled=true]:opacity-100 data-[disabled=true]:bg-background-100 data-[disabled=true]:border-outline-200`}
        >
            <HStack className="items-center gap-2.5">
                <MicrosoftLogo />
                <ButtonText className="text-[15px] font-normal text-typography-500 data-[disabled=true]:opacity-100">
                    Sign in with Microsoft
                </ButtonText>
            </HStack>
        </Button>
    )
}
