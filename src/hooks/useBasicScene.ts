import { onBeforeUnmount, onMounted } from 'vue'
import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import useGui from '/@/hooks/useGui'
import useStats from '/@/hooks/useStats'
import useTrackballControls from './useTrackballControls'
import usePerspectiveCamera from './usePerspectiveCamera'

/**
 * 创建一个基本的场景
 * @param frameRequestCallback requestAnimationFrame的回调函数
 */
const useBasicScene = (frameRequestCallback?: FrameRequestCallback) => {
    let controller: TrackballControls, renderScene: FrameRequestCallback

    let camera: THREE.Camera = usePerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )

    const renderer = new THREE.WebGLRenderer()
    const scene = new THREE.Scene()
    const gui = useGui()

    const init = () => {
        const stats = useStats(0)
        document.body.appendChild(stats.dom)

        // create a render and set the size
        renderer.setClearColor(new THREE.Color(0xcccccc))
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.shadowMap.enabled = true

        // show axes in the screen
        var axes = new THREE.AxesHelper(20)
        scene.add(axes)

        // position and point the camera to the center of the scene
        camera.position.x = -20
        camera.position.y = 25
        camera.position.z = 20
        camera.lookAt(scene.position)

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff)
        spotLight.position.set(-40, 60, 23)
        spotLight.castShadow = true
        spotLight.name = 'defaultSpotLight'
        scene.add(spotLight)

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 40)
        // 因为基本材质（MeshBasicMaterial）不会对光源有反应，所以需要更换材质
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
        var plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.receiveShadow = true
        plane.name = 'ground plane'

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

        controller = useTrackballControls(camera, renderer.domElement)

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

    const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const setCamera = (newCamera: THREE.Camera) => {
        camera = newCamera
        controller.object = camera
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
        renderer,
        scene,
        gui,
        camera,
        setCamera
    }
}

export default useBasicScene
