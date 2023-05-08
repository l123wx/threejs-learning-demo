import * as THREE from 'three'

const usePerspectiveCamera = (...ages: ConstructorParameters<typeof THREE.PerspectiveCamera>) => {
    const camera = new THREE.PerspectiveCamera(...ages)

    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
    }

    // listen to the resize events
    window.addEventListener('resize', onResize, false)

    return camera
}

export default usePerspectiveCamera