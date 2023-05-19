<template>
    <!-- Div which will hold the Output -->
    <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue'
    import useBasicScene from '/@/hooks/useBasicScene'
    import { createCubeAndSphere, createPointLight } from './utils'

    const controls = {
        castShadow: true,
        isLightMoving: true,
        color: '#ffffff',
        /**
         * 衰减，光源强度随着离开光源的距离而衰减的速度。该值为2时更接近现实世界中的效果，默认值为 2。
         * 只有WebGLRenderer的属性physicallyCorrectLights(物理正确光源)被设置为启用时，decay属性才有效 （貌似修改了）
         */
        decay: 2,
        /**
         * 距离，如果非零，那么光强度将会从最大值当前灯光位置处按照距离线性衰减到0。 缺省值为 0.0。
         */
        distance: 0,
        /**
         * 强度，默认值为1
         */
        intensity: 1,
        power: 4 * Math.PI
    }

    const { cube, sphere, animate } = createCubeAndSphere()
    const { pointLight, pointLightGroup, pointLightHelper, move } =
        createPointLight()

    pointLight.intensity = controls.intensity

    const { scene, camera, gui } = useBasicScene(() => {
        animate()

        pointLight.distance = controls.distance

        if (controls.isLightMoving) {
            move()
        }
    })

    scene.add(cube)
    scene.add(sphere)
    scene.add(pointLightGroup)
    scene.add(pointLightHelper)

    onMounted(() => {
        console.log(pointLight)
        camera.position.set(-30, 40, 30)

        const plane = scene.getObjectByName('ground plane')
        plane?.position.setX(15)

        scene.remove(scene.getObjectByName('defaultSpotLight')!)

        setTimeout(() => {
            pointLight.distance = 10
            pointLight.distance = 0
        })

        gui.addColor(controls, 'color').onChange((newValue: string) =>
            pointLight.color.set(newValue)
        )
        gui.add(controls, 'castShadow').onChange((newValue: boolean) => {
            pointLight.castShadow = newValue
        })
        gui.add(controls, 'isLightMoving')
        gui.add(controls, 'intensity', 0, 5)
            .onChange((newValue: number) => {
                pointLight.intensity = newValue
                controls.power = pointLight.power
            })
            .listen()
        gui.add(controls, 'decay', 0, 10).onChange((newValue: number) => {
            pointLight.decay = newValue
        })
        gui.add(controls, 'distance', 0, 100)
        gui.add(controls, 'power', 0, 20)
            .onChange((newValue: number) => {
                pointLight.power = newValue
                controls.intensity = pointLight.intensity
            })
            .listen()
    })
</script>
