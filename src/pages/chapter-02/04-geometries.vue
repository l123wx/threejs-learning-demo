<template>
    <!-- Div which will hold the Output -->
    <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
    import * as THREE from 'three'
    import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils.js'
    import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js'
    import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries.js'
    import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
    import useBasicScene from '/@/hooks/useBasicScene'

    const { scene } = useBasicScene()

    function addGeometries(scene: THREE.Scene) {
        var geoms = []

        geoms.push(new THREE.CylinderGeometry(1, 4, 4))

        // basic cube
        geoms.push(new THREE.BoxGeometry(2, 2, 2))

        // basic spherer
        geoms.push(new THREE.SphereGeometry(2))

        geoms.push(new THREE.IcosahedronGeometry(4))

        // create a convex shape (a shape without dents)
        // using a couple of points
        // for instance a cube
        var points = [
            new THREE.Vector3(2, 2, 2),
            new THREE.Vector3(2, 2, -2),
            new THREE.Vector3(-2, 2, -2),
            new THREE.Vector3(-2, 2, 2),
            new THREE.Vector3(2, -2, 2),
            new THREE.Vector3(2, -2, -2),
            new THREE.Vector3(-2, -2, -2),
            new THREE.Vector3(-2, -2, 2)
        ]
        geoms.push(new ConvexGeometry(points))

        // create a lathgeometry
        //http://en.wikipedia.org/wiki/Lathe_(graphics)
        var pts = [] //points array - the path profile points will be stored here
        var detail = 0.1 //half-circle detail - how many angle increments will be used to generate points
        var radius = 3 //radius for half_sphere
        for (
            var angle = 0.0;
            angle < Math.PI;
            angle += detail //loop from 0.0 radians to PI (0 - 180 degrees)
        )
            pts.push(
                new THREE.Vector2(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius
                )
            ) //angle/radius to x,z
        geoms.push(new THREE.LatheGeometry(pts, 12))

        // create a OctahedronGeometry
        geoms.push(new THREE.OctahedronGeometry(3))

        // create a geometry based on a function
        geoms.push(
            new ParametricGeometry(ParametricGeometries.mobius3d, 20, 10)
        )

        //
        geoms.push(new THREE.TetrahedronGeometry(3))

        geoms.push(new THREE.TorusGeometry(3, 1, 10, 10))

        geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20))

        var j = 0
        for (var i = 0; i < geoms.length; i++) {
            var materials = [
                new THREE.MeshLambertMaterial({
                    color: Math.random() * 0xffffff
                }),
                new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    wireframe: true
                })
            ]

            var mesh = SceneUtils.createMultiMaterialObject(geoms[i], materials)
            mesh.traverse(function (e) {
                e.castShadow = true
            })

            mesh.position.x = -24 + (i % 4) * 12
            mesh.position.y = 4
            mesh.position.z = -8 + j * 12

            if ((i + 1) % 4 == 0) j++
            scene.add(mesh)
        }
    }

    addGeometries(scene)
</script>
