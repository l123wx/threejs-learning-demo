<template>
    <!-- Div which will hold the Output -->
    <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
    import * as THREE from 'three'
    import useBasicScene from '/@/hooks/useBasicScene'

    const controls = {
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,

        positionX: 0,
        positionY: 4,
        positionZ: 0,

        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,

        translateX: 0,
        translateY: 0,
        translateZ: 0,
        translate: function () {
            // translate 是相对于物体原来的位置进行平移，而不是指定物体的绝对位置
            cube.translateX(controls.translateX)
            cube.translateY(controls.translateY)
            cube.translateZ(controls.translateZ)

            controls.positionX = cube.position.x
            controls.positionY = cube.position.y
            controls.positionZ = cube.position.z
        },

        visible: true
    }

    const { scene, gui } = useBasicScene(() => {
        cube.visible = controls.visible

        cube.rotation.set(
            controls.rotationX,
            controls.rotationY,
            controls.rotationZ
        )

        cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ)
    })

    const material = new THREE.MeshLambertMaterial({ color: 0x44ff44 })
    const geom = new THREE.BoxGeometry(5, 8, 3)
    const cube = new THREE.Mesh(geom, material)
    cube.position.y = 4
    cube.castShadow = true
    scene.add(cube)

    const initGui = () => {
        const guiScale = gui.addFolder('scale')
        guiScale.add(controls, 'scaleX', 0, 5)
        guiScale.add(controls, 'scaleY', 0, 5)
        guiScale.add(controls, 'scaleZ', 0, 5)

        const guiPosition = gui.addFolder('position')
        var contX = guiPosition.add(controls, 'positionX', -10, 10)
        var contY = guiPosition.add(controls, 'positionY', -4, 20)
        var contZ = guiPosition.add(controls, 'positionZ', -10, 10)

        contX.listen()
        contX.onChange(() => {
            cube.position.x = controls.positionX
        })

        contY.listen()
        contY.onChange(() => {
            cube.position.y = controls.positionY
        })

        contZ.listen()
        contZ.onChange(() => {
            cube.position.z = controls.positionZ
        })

        const guiRotation = gui.addFolder('rotation')
        guiRotation.add(controls, 'rotationX', -4, 4)
        guiRotation.add(controls, 'rotationY', -4, 4)
        guiRotation.add(controls, 'rotationZ', -4, 4)

        const guiTranslate = gui.addFolder('translate')
        guiTranslate.add(controls, 'translateX', -10, 10)
        guiTranslate.add(controls, 'translateY', -10, 10)
        guiTranslate.add(controls, 'translateZ', -10, 10)
        guiTranslate.add(controls, 'translate')

        gui.add(controls, 'visible')
    }

    initGui()
</script>
