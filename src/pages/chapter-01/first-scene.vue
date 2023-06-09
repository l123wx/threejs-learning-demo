<template>
    <!-- Div which will hold the Output -->
    <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
    import { onBeforeUnmount, onMounted } from 'vue'
    import * as THREE from 'three'
    import Stats from 'three/examples/jsm/libs/stats.module.js'
    import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
    import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

    let camera: THREE.PerspectiveCamera,
        scene: THREE.Scene,
        renderer: THREE.WebGLRenderer,
        controller: TrackballControls,
        stats: Stats,
        gui: GUI,
        renderScene: () => void

    function init() {
        stats = new Stats()
        stats.showPanel(0)
        document.body.appendChild(stats.dom)

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene()

        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )

        // create a render and set the size
        renderer = new THREE.WebGLRenderer()
        renderer.setClearColor(new THREE.Color(0xeeeeee))
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.shadowMap.enabled = true

        // show axes in the screen
        var axes = new THREE.AxesHelper(20)
        scene.add(axes)

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 20)
        // 因为基本材质（MeshBasicMaterial）不会对光源有反应，所以需要更换材质
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc })
        var plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.receiveShadow = true

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI
        plane.position.x = 15
        plane.position.y = 0
        plane.position.z = 0

        // add the plane to the scene
        scene.add(plane)

        // create a cube
        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0xff0000
            // 开启wireframe属性，这样物体就不会被渲染为实体物体
            // wireframe: true
        })
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.castShadow = true

        // position the cube
        cube.position.x = -4
        cube.position.y = 3
        cube.position.z = 0

        // add the cube to the scene
        scene.add(cube)

        // create a sphere
        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
        var sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0x7777ff
        })
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.castShadow = true

        // position the sphere
        sphere.position.x = 20
        sphere.position.y = 4
        sphere.position.z = 2

        // add the sphere to the scene
        scene.add(sphere)

        // position and point the camera to the center of the scene
        camera.position.x = -30
        camera.position.y = 40
        camera.position.z = 30
        camera.lookAt(scene.position)

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff)
        spotLight.position.set(-40, 60, -10)
        spotLight.castShadow = true
        scene.add(spotLight)

        // add the output of the renderer to the html element
        document
            .getElementById('WebGL-output')
            ?.appendChild(renderer.domElement)

        let step = 0

        const controls = {
            rotationSpeed: 0.02,
            bouncingSpeed: 0.03
        }

        gui = new GUI()
        gui.add(controls, 'rotationSpeed', 0, 0.5)
        gui.add(controls, 'bouncingSpeed', 0, 0.5)

        controller = new TrackballControls(camera, renderer.domElement)
        controller.staticMoving = true
        controller.rotateSpeed = 10

        renderScene = () => {
            stats.update()
            controller.update()

            // rotate the cube around its axes
            cube.rotation.x += controls.rotationSpeed
            cube.rotation.y += controls.rotationSpeed
            cube.rotation.z += controls.rotationSpeed

            // bounce the sphere up and down
            step += controls.bouncingSpeed
            sphere.position.x = 20 + 10 * Math.cos(step)
            sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

            // render using requestAnimationFrame
            requestAnimationFrame(renderScene)
            renderer.render(scene, camera)
        }

        renderScene()
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        controller.handleResize()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    onMounted(() => {
        init()

        // listen to the resize events
        window.addEventListener('resize', onResize, false)
    })

    onBeforeUnmount(() => {
        stats.dom.remove()
        gui.destroy()
        renderScene = () => void 0
        window.removeEventListener('resize', onResize, false)
    })
</script>
