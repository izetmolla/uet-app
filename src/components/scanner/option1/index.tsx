import { useRouter } from "expo-router"
import { Alert } from "react-native"

import { Button, ButtonText } from "@/components/ui/button"
import { scanDocuments } from "@/lib/camscan/scanner"
import { useCamscanStore } from "@/store/camscan-store"

export default function CamscanOption1Screen({ student_id }: { student_id: string }) {
    const router = useRouter()
    const addPhotosToItem = useCamscanStore((s) => s.addPhotosToItem)







    const handleAddPages = async () => {
        if (!student_id) return

        try {
            const images = await scanDocuments()
            if (images.length > 0) {
                await addPhotosToItem(student_id, images)
            }
        } catch {
            Alert.alert("Scan failed", "Could not add new pages.")
        } finally {
            if (router.canGoBack()) {
                router.back()
            }
        }
    }

    return (
        <Button onPress={handleAddPages}>
            <ButtonText>Add pages</ButtonText>
        </Button>
    )
}
