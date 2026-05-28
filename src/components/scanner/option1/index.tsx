import { useRouter } from "expo-router"

import { Button, ButtonText } from "@/components/ui/button"
import { useCamscanStore } from "@/store/camscan-store"

export default function CamscanOption1Screen({ student_id }: { student_id: string }) {
    const router = useRouter()
    const addPhotosToItem = useCamscanStore((s) => s.addPhotosToItem)







    return (
        <Button onPress={()=>console.log("add pages")}>
            <ButtonText>Add pages</ButtonText>
        </Button>
    )
}
