<template>
    <!-- Div which will hold the Output -->
    <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue'
    import * as THREE from 'three'
    import useBasicScene from '/@/hooks/useBasicScene'
    import { createCubeAndSphere, createSpotLight } from './utils'

    // used to determine the switch point for the light animation
    let invert = 1
    let phase = 0

    enum Target {
        PLANE = 'plane',
        CUBE = 'cube',
        SPHERE = 'sphere'
    }

    const controls = {
        // 角度，单位是弧度，默认值为Math.PI/3
        angle: (Math.PI / 3 / (2 * Math.PI)) * 2,
        castShadow: true,
        color: '#ffffff',
        /**
         * 衰减，光源强度随着离开光源的距离而衰减的速度。该值为2时更接近现实世界中的效果，默认值为1。
         * 只有WebGLRenderer的属性physicallyCorrectLights(物理正确光源)被设置为启用时，decay属性才有效 （貌似修改了）
         */
        decay: 1,
        isLightMoving: true,
        /**
         * 距离，如果非零，那么光强度将会从最大值当前灯光位置处按照距离线性衰减到0。 缺省值为 0.0。
         */
        distance: 0,
        /**
         * 强度，默认值为1
         */
        intensity: 1,
        /**
         * 聚光锥的半影衰减百分比，照明区域在其边缘附近的平滑衰减速度。在0和1之间的值。 默认值 — 0.0。
         */
        penumbra: 0,
        /**
         * 功率，表示以“流明”为单位的光功率，缺省值 4Math.PI
         * 该值与intensity直接关联：power = intensity * π
         */
        power: Math.PI,
        target: Target.PLANE,
        /**
         * shadow.mapSize，阴影贴图的宽度和高度，使用一个Vector2定义
         * 较高的值会以计算时间为代价提供更好的阴影质量。
         * 值必须是2的幂，直到给定设备的WebGLRenderer.capabilities.maxTextureSize
         * 虽然宽度和高度不必相同（例如，（512,1024）有效）。 默认值为*（512,512）*。
         *
         * 这个属性貌似只能在添加到scene之前设置
         */
        mapSize: 512
    }

    const { cube, sphere } = createCubeAndSphere()
    const { spotLight, spotLightGroup, spotLightHelper, setPosition } =
        createSpotLight()

    spotLight.intensity = controls.intensity
    spotLight.angle = controls.angle
    spotLight.shadow.mapSize.set(controls.mapSize, controls.mapSize)

    let step = 0
    const { scene, camera, gui } = useBasicScene(() => {
        // rotate the cube around its axes
        cube.rotation.x += 0.02
        cube.rotation.y += 0.02
        cube.rotation.z += 0.02

        // bounce the sphere up and down
        step += 0.03
        sphere.position.x = 20 + 10 * Math.cos(step)
        sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

        // move the light simulation
        if (controls.isLightMoving) {
            if (phase > 2 * Math.PI) {
                invert = invert * -1
                phase -= 2 * Math.PI
            } else {
                phase += 0.03
            }

            const x =
                    invert < 0
                        ? invert * (14 * Math.cos(phase) - 14) + 14
                        : 14 * Math.cos(phase),
                y = 20,
                z = 7 * Math.sin(phase)

            setPosition(x, y, z)
        }
    })

    scene.add(cube)
    scene.add(sphere)
    scene.add(spotLightHelper)
    scene.add(spotLightGroup)

    onMounted(() => {
        camera.position.set(-30, 40, 30)

        const plane = scene.getObjectByName('ground plane')
        plane?.position.setX(15)

        spotLight.target = plane!

        scene.remove(scene.getObjectByName('defaultSpotLight')!)

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight('#1c1c1c')
        scene.add(ambientLight)

        // add spotlight for a bit of light
        var spotLight0 = new THREE.SpotLight(0xcccccc)
        spotLight0.position.set(-40, 30, -10)
        spotLight0.lookAt(plane!.position)
        scene.add(spotLight0)

        gui.add(controls, 'intensity', 0, 10)
            .onChange((newValue: number) => {
                spotLight.intensity = newValue
                controls.power = spotLight.power
            })
            .listen()
        gui.add(controls, 'angle', 0, Math.PI / 2).onChange(
            (newValue: number) => {
                spotLight.angle = newValue
                spotLightHelper.update()
            }
        )
        gui.add(controls, 'decay', 0, 10).onChange((newValue: number) => {
            spotLight.decay = newValue
        })
        gui.add(controls, 'isLightMoving')
        gui.add(controls, 'distance', 0, 100).onChange((newValue: number) => {
            spotLight.distance = newValue
        })
        gui.add(controls, 'penumbra', 0, 1).onChange((newValue: number) => {
            spotLight.penumbra = newValue
        })
        gui.add(controls, 'power', 0, 10)
            .onChange((newValue: number) => {
                spotLight.power = newValue
                controls.intensity = spotLight.intensity
            })
            .listen()
        gui.add(controls, 'target', [
            Target.CUBE,
            Target.PLANE,
            Target.SPHERE
        ]).onChange((newValue: Target) => {
            switch (newValue) {
                case Target.PLANE:
                    spotLight.target = plane!
                    break
                case Target.CUBE:
                    spotLight.target = cube
                    break
                case Target.SPHERE:
                    spotLight.target = sphere
            }
        })
    })
</script>
