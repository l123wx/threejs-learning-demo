import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { onBeforeUnmount } from 'vue'

const useGui = () => {
    const gui = new GUI()

    onBeforeUnmount(() => {
        gui.destroy()
    })

    return gui
}

export default useGui