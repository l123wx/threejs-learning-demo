<template>
    <!-- Div which will hold the Output -->
    <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue'
    import * as THREE from 'three'
    import useBasicScene from '/@/hooks/useBasicScene'
    import usePerspectiveCamera from '/@/hooks/usePerspectiveCamera'

    const { setCamera, scene, gui } = useBasicScene()

    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)

    onMounted(() => {
        const planeMesh = scene.children[2] as THREE.Mesh
        const planeGeometry = planeMesh.geometry as THREE.PlaneGeometry

        for (var j = 0; j < planeGeometry.parameters.height / 5; j++) {
            for (var i = 0; i < planeGeometry.parameters.width / 5; i++) {
                var rnd = Math.random() * 0.75 + 0.25
                var cubeMaterial = new THREE.MeshLambertMaterial()
                cubeMaterial.color = new THREE.Color(rnd, 0, 0)
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

                cube.position.z =
                    -(planeGeometry.parameters.height / 2) + 2 + j * 5
                cube.position.x =
                    -(planeGeometry.parameters.width / 2) + 2 + i * 5
                cube.position.y = 2

                scene.add(cube)
            }
        }
    })

    const controls = {
        perspective: 'Perspective',
        switchCamera: () => {
            let camera
            if (controls.perspective === 'Perspective') {
                camera = new THREE.OrthographicCamera(
                    window.innerWidth / -16,
                    window.innerWidth / 16,
                    window.innerHeight / 16,
                    window.innerHeight / -16,
                    -200,
                    500
                )

                setCamera(camera)

                controls.perspective = 'Orthographic'
            } else {
                camera = usePerspectiveCamera(
                    45,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000
                )

                setCamera(camera)

                controls.perspective = 'Perspective'
            }
            camera.position.x = 120
            camera.position.y = 60
            camera.position.z = 180
            camera.lookAt(scene.position)
        }
    }

    gui.add(controls, 'switchCamera')
    gui.add(controls, 'perspective').listen().disable()
</script>
