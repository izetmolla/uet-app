import { TabPage } from "@/components/navigation/tab-page"
import { ScreenPlaceholder } from "@/components/navigation/screen-placeholder"

export default function CoursesScreen() {
    return (
        <TabPage title="Courses">
            <ScreenPlaceholder
                title="Courses"
                description="Your enrolled courses will appear here."
            />
        </TabPage>
    )
}
