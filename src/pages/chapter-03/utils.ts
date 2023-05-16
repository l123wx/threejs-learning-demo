import * as THREE from 'three'

export const createCubeAndSphere = () => {
    // create a cube·
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

    // create a sphere
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff
    })
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.castShadow = true

    // position the sphere
    sphere.position.x = 20
    sphere.position.y = 0
    sphere.position.z = 2

    return { cube, sphere }
}

export const createSpotLight = () => {
    var spotLight = new THREE.SpotLight('#ffffff')
    spotLight.position.set(0, 0, 0)
    spotLight.castShadow = true

    const spotLightHelper = new THREE.SpotLightHelper(spotLight)

    // add a small sphere simulating the pointlight
    var sphereLight = new THREE.SphereGeometry(0.2)
    var sphereLightMaterial = new THREE.MeshBasicMaterial({
        color: 0xac6c25
    })
    var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)
    sphereLightMesh.position.set(0, 0, 0)

    const group = new THREE.Group()
    group.add(spotLight, sphereLightMesh)

    const setPosition = (
        ...args: Parameters<THREE.Mesh['position']['set']>
    ) => {
        group.position.set(...args)
        spotLightHelper.update()
    }

    setPosition(3, 20, 3)

    return {
        spotLight,
        spotLightHelper,
        spotLightGroup: group,
        setPosition
    }
}
