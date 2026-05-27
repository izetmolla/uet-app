import React, { useEffect, useRef } from 'react'
import { Camera, CameraRef, useCameraPermission } from 'react-native-vision-camera'

export default function CameraScreen() {
    const camera = useRef<CameraRef>(null)

    const { hasPermission, requestPermission } = useCameraPermission()


    useEffect(() => {
        if (!hasPermission) requestPermission()
    }, [hasPermission, requestPermission])

    const onTap = async ({ viewX, viewY }: { viewX: number, viewY: number }) => {
        await camera?.current?.focusTo({ x: viewX, y: viewY })
      }
    return (
        <Camera
        style={{
            flex: 1,
            height: '100%',
            width: '100%',

        }}
        isActive={true}
        device="back"
        ref={camera}
        />
    )
}