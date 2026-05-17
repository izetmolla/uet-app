import { TabPage } from "@/components/navigation/tab-page"
import { ScreenPlaceholder } from "@/components/navigation/screen-placeholder"

export default function ScheduleScreen() {
    return (
        <TabPage title="Schedule">
            <ScreenPlaceholder
                title="Schedule"
                description="Weekly timetable and exam dates."
            />
        </TabPage>
    )
}
