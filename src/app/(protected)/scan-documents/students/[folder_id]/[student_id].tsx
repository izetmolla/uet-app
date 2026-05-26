import ContentLoader from "@/components/content-loader"
import { AppHeader } from "@/components/navigation/app-header"
import { ScreenContentSafeArea, ScreenSafeArea } from "@/components/navigation/screen-safe-area"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { View } from "react-native"

const StudentScreen = () => {
    return (
        <ScreenSafeArea>
        <AppHeader
            title={"student Name"}
            showBack
            showMenu={false}
            showSearch={false}
            showNotifications={false}
        />
        <ScreenContentSafeArea>
            <Box className="flex-1 bg-background-50">
                <ContentLoader
                    isLoading={false}
                    forMeta
                    error={null}
                >
                    <View>
                        <Text>Student</Text>
                    </View>
                </ContentLoader>
            </Box>
        </ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}

export default StudentScreen