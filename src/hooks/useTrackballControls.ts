import { onBeforeUnmount } from 'vue'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

const useTrackballControls = (...args: ConstructorParameters<typeof TrackballControls>) => {
    const controller = new TrackballControls(...args)
    controller.staticMoving = true
    controller.rotateSpeed = 10

    const onResize = () => {
        controller.handleResize()
    }

    // listen to the resize events
    window.addEventListener('resize', onResize, false)

    onBeforeUnmount(() => {
        window.removeEventListener('resize', onResize, false)
    })

    return controller
}

export default useTrackballControls