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
        // 6.通过 fog 给场景添加雾化效果
        // THREE.Fog 是线性增长的
        // scene.fog = new THREE.Fog(0xffffff, 0.015, 100)
        // THREE.FogExp2 随着距离呈指数增长
        scene.fog = new THREE.FogExp2(0xffffff, 0.01)
        // 通过 overrideMaterial 设置的材质会覆盖场景下所有对象的材质
        scene.overrideMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff
        })

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
        var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1)
        // 因为基本材质（MeshBasicMaterial）不会对光源有反应，所以需要更换材质
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc })
        var plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.receiveShadow = true

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI
        plane.position.x = 0
        plane.position.y = 0
        plane.position.z = 0

        // add the plane to the scene
        scene.add(plane)

        // position and point the camera to the center of the scene
        camera.position.x = -30
        camera.position.y = 40
        camera.position.z = 30
        camera.lookAt(scene.position)

        var ambientLight = new THREE.AmbientLight(0x3c3c3c)
        scene.add(ambientLight)

        const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120)
        spotLight.position.set(-40, 60, -10)
        spotLight.castShadow = true
        scene.add(spotLight)

        // add the output of the renderer to the html element
        document
            .getElementById('WebGL-output')
            ?.appendChild(renderer.domElement)

        const addCube = () => {
            const cubeSize = Math.ceil(Math.random() * 3)
            const cubeGeometry = new THREE.BoxGeometry(
                cubeSize,
                cubeSize,
                cubeSize
            )
            const cubeMaterial = new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff
            })

            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
            cube.castShadow = true
            /**
             * 5.为对象指定唯一表示name，可以通过 getObjectByName(name, recursive) 获取特定名字的对象。
             * recursive为false时，在调用者子元素上查找；recursive为true时，在调用者所有后代对象中查找。
             */
            cube.name = 'cube-' + scene.children.length
            cube.position.x =
                -30 + Math.round(Math.random() * planeGeometry.parameters.width)
            cube.position.y = Math.round(Math.random() * 5)
            cube.position.z =
                -20 +
                Math.round(Math.random() * planeGeometry.parameters.height)

            // 1.通过 scene.add 方法向场景中添加对象
            scene.add(cube)
        }

        const removeCube = () => {
            // 2.通过 scene.children 返回场景中所有对象的列表，包括摄像机和光源
            const allChildren = scene.children
            const lastObject = allChildren[allChildren.length - 1]
            if (lastObject instanceof THREE.Mesh) {
                // 3.通过 scene.remove 移除场景中的对象
                scene.remove(lastObject)
            }
        }

        const outputObject = () => {
            console.log(scene.children)
        }

        const controls = {
            addCube,
            removeCube,
            outputObject,
            rotationSpeed: 0.05
        }

        gui = new GUI()
        gui.add(controls, 'rotationSpeed', 0, 0.5)
        gui.add(controls, 'addCube')
        gui.add(controls, 'removeCube')
        gui.add(controls, 'outputObject')
        gui.add(scene.children, 'length').listen().disable()

        controller = new TrackballControls(camera, renderer.domElement)
        controller.staticMoving = true
        controller.rotateSpeed = 10

        renderScene = () => {
            stats.update()
            controller.update()

            // 4.使用scene.traverse可以遍历场景中的所有对象，包括对象下的所有子对象
            scene.traverse(obj => {
                if (obj instanceof THREE.Mesh && obj !== plane) {
                    obj.rotation.x += controls.rotationSpeed
                    obj.rotation.y += controls.rotationSpeed
                    obj.rotation.z += controls.rotationSpeed
                }
            })

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
