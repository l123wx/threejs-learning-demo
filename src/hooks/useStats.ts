import { onBeforeUnmount, onMounted } from 'vue'
import Stats from 'three/examples/jsm/libs/stats.module.js'

const useStats = (value: number = 0) => {
    const stats = new Stats()

    onMounted(() => {
        stats.showPanel(value)
    })

    onBeforeUnmount(() => {
        stats.dom.remove()
    })

    return stats
}

export default useStats