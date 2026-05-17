import { TabPage } from "@/components/navigation/tab-page"
import { ScreenPlaceholder } from "@/components/navigation/screen-placeholder"

export default function MessagesScreen() {
    return (
        <TabPage title="Messages">
            <ScreenPlaceholder
                title="Messages"
                description="Conversations with faculty and staff."
            />
        </TabPage>
    )
}
