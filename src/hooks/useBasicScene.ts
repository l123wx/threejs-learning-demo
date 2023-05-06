import { onBeforeUnmount, onMounted } from 'vue'
import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import useGui from '/@/hooks/useGui'
import useStats from '/@/hooks/useStats'

const useBasicScene = (frameRequestCallback?: FrameRequestCallback) => {
    let camera: THREE.PerspectiveCamera,
        renderer: THREE.WebGLRenderer,
        controller: TrackballControls,
        renderScene: FrameRequestCallback

    const scene = new THREE.Scene()
    const gui = useGui()

    function init() {
        const stats = useStats(0)
        document.body.appendChild(stats.dom)

        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )

        // create a render and set the size
        renderer = new THREE.WebGLRenderer()
        renderer.setClearColor(new THREE.Color(0xcccccc))
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.shadowMap.enabled = true

        // show axes in the screen
        var axes = new THREE.AxesHelper(20)
        scene.add(axes)

        // position and point the camera to the center of the scene
        camera.position.x = -30
        camera.position.y = 40
        camera.position.z = 30
        camera.lookAt(scene.position)

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x090909);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 40, 50);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 40)
        // 因为基本材质（MeshBasicMaterial）不会对光源有反应，所以需要更换材质
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
        var plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.receiveShadow = true

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI
        plane.position.x = 0
        plane.position.y = 0
        plane.position.z = 0

        // add the plane to the scene
        scene.add(plane)

        // add the output of the renderer to the html element
        document
            .getElementById('WebGL-output')
            ?.appendChild(renderer.domElement)

        controller = new TrackballControls(camera, renderer.domElement)
        controller.staticMoving = true
        controller.rotateSpeed = 10

        renderScene = (...args) => {
            stats.update()
            controller.update()

            frameRequestCallback && frameRequestCallback(...args)

            // render using requestAnimationFrame
            requestAnimationFrame(renderScene)
            renderer.render(scene, camera)
        }

        requestAnimationFrame(renderScene)
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
        renderScene = () => void 0
        window.removeEventListener('resize', onResize, false)
    })

    return {
        scene,
        gui
    }
}

export default useBasicScene