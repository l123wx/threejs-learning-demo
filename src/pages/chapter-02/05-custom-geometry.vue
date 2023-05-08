<template>
    <!-- Div which will hold the Output -->
    <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
    import * as THREE from 'three'
    import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils.js'
    import useBasicScene from '/@/hooks/useBasicScene'

    const verticesList = [
        { x: 3, y: 5, z: 3 },
        { x: 3, y: 5, z: 0 },
        { x: 3, y: 0, z: 3 },
        { x: 3, y: 0, z: 0 },
        { x: 0, y: 5, z: 0 },
        { x: 0, y: 5, z: 3 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 3 }
    ]

    // 组成三角片面的点，在顶点列表中的索引（下标）
    const index = [
        0, 2, 1,
        2, 3, 1,
        4, 6, 5,
        6, 7, 5,
        4, 5, 1,
        5, 0, 1,
        7, 6, 2,
        6, 3, 2,
        5, 7, 0,
        7, 2, 0,
        1, 3, 4,
        3, 6, 4
    ]

    const geom = new THREE.BufferGeometry()

    geom.setIndex(index)

    const materials = [
        new THREE.MeshLambertMaterial({
            opacity: 0.6,
            color: 0x44ff44,
            transparent: true
        }),
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
    ]

    // 使用 createMultiMaterialObject 会根据 materials 数组里面的材质各创建一个对象，并加入到一个 group 中
    const mesh = SceneUtils.createMultiMaterialObject(geom, materials)
    mesh.children.forEach(function (e) {
        e.castShadow = true
    })

    const { scene, gui } = useBasicScene(() => {
        const vertices = new Float32Array(
            verticesList.reduce((pre: number[], item) => {
                pre.push(item.x, item.y, item.z)
                return pre
            }, [])
        )

        ;(mesh.children as THREE.Mesh[]).forEach((e) => {
            e.geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(vertices, 3)
            )
            // 使用 computeVertexNormals 计算顶点的法向量，这样才能正确计算光照
            e.geometry.computeVertexNormals()
        })
    })

    scene.add(mesh)

    /**
     * 添加环境光，SpotLight生成的生硬的阴影效果
     * 环境光会在所有物体上均匀的显示
     */
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    verticesList.forEach((item, index) => {
        const folder = gui.addFolder('Vertices ' + (index + 1))
        folder.add(item, 'x', -10, 10)
        folder.add(item, 'y', -10, 10)
        folder.add(item, 'z', -10, 10)
    })
</script>
