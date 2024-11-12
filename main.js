import './style.css'

import * as THREE from 'three';
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Models
// 
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
let mixer = null
let PuzzlePiece_01 = new THREE.Mesh();
let PuzzlePiece_02 = new THREE.Mesh();;
let PuzzlePiece_03 = new THREE.Mesh();;
let PuzzlePiece_04 = new THREE.Mesh();;
let PuzzlePiece_05 = new THREE.Mesh();;
let PuzzlePiece_06 = new THREE.Mesh();;
let PuzzlePiece_07 = new THREE.Mesh();;

let PuzzlePieces = [];

gltfLoader.load(
    "/static/models/scene.gltf",
    (gltf) =>{
        let Pieces = gltf.scene.children[0].children[0].children[0].children;
        gltf.scene.traverse((node) => {
            // console.log(node);
                  // Option 2: Use the geometry of the mesh to create a new mesh
            const newMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const newMesh = new THREE.Mesh(node.geometry, newMaterial);
            PuzzlePieces.push(newMesh);
            // scene.add(newMesh);
        })
        // const newMesh = new THREE.Mesh(Pieces.geometry, newMaterial);

        // PuzzlePiece_01 = Pieces[0];
        // PuzzlePiece_02 = Pieces[1];
        // PuzzlePiece_03 = Pieces[2];
        // PuzzlePiece_04 = Pieces[3];
        // PuzzlePiece_05 = Pieces[4];
        // //@TODO doesn't create new ones, they are Refs
        // PuzzlePiece_06 = Pieces[4];
        // PuzzlePiece_07 = Pieces[4];
        // PuzzlePieces = [PuzzlePiece_01, PuzzlePiece_02, PuzzlePiece_03, PuzzlePiece_04, PuzzlePiece_05, PuzzlePiece_06, PuzzlePiece_07];
        // PuzzlePiece_01.position.set(0,0,0);
        // PuzzlePiece_02.position.set(0,3.75,0);
        // PuzzlePiece_03.position.set(3.75,0,0);
        // PuzzlePiece_04.position.set(0,-3.75,0);
        // PuzzlePiece_05.position.set(-3.75,0,0);
        // // PuzzlePiece_06.position.set(-4.75,0,0)
        let index = 0;
        for(const PuzzlePiece of PuzzlePieces)
        {
            index++;
            PuzzlePiece.scale.set(0.025, 0.025, 0.025);
            PuzzlePiece.castShadow = true;
            scene.add(PuzzlePiece);
        }
        // PuzzlePiece_01.scale.set(0.025, 0.025, 0.025);
        // PuzzlePiece_01.position.set(0,4,0);
        // const material = new THREE.MeshPhongMaterial({color: 0xffffff} );
        // const PuzzlePieceMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10),material);
        // console.log(PuzzlePiece_01, PuzzlePieceMesh);
        // PuzzlePiece_01.castShadow = true;
        // PuzzlePiece_01.addEventListener();
        // scene.add(PuzzlePieces);
    },
    () =>{
        console.log("Progress")
    },
    () =>{
        console.log("Error")
    }
);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 1.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5;
floor.position.set(0,-3,0);
// scene.add(floor)

/**
 * Grid Helper
 */


const gridHelper = new THREE.GridHelper();
scene.add(gridHelper)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Mouse
 */

const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (event)=>
    {
        mouse.x = event.clientX / sizes.width * 2 - 1;
        mouse.y = -(event.clientY / sizes.height) * 2 + 1;
    }
)
window.addEventListener("click", (event)=>
    {
        if(currentIntersect)
        {
            console.log("Click obj")
        }
    }
)

//
// Raycaster
// 

const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(-3,0,0);
// const rayDirection = new THREE.Vector3(10,0,0);
// rayDirection.normalize();
// raycaster.set(rayOrigin,rayDirection);
// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);
// const intersects = raycaster.intersectObjects([object1,object2,object3]);
// console.log(intersects);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const rayOrigin = new THREE.Vector3(-3,0,0);
const rayDirection = new THREE.Vector3(10,0,0);
const objectsToTest = [PuzzlePiece_01];
let currentIntersect = null;


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Update Mixer
    if(mixer)
    {
        mixer.update(deltaTime);
    }

    // Update controls
    controls.update()
    raycaster.setFromCamera(mouse, camera)

    if(PuzzlePiece_01 != null && raycaster != null && objectsToTest)
    {
        // PuzzlePiece_01.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
        if(objectsToTest != null)
        {
            // raycaster.intersectObjects(objectsToTest);
            // const intersects = raycaster.intersectObjects(objectsToTest);
            for(const object of objectsToTest)
            {
                if(object != null)
                {
                    // object.material.color.set("red");
                }
            }
            // for(const intersect of intersects)
            // {
            //     if(intersect != null && intersect.object != null)
            //     {
            //         // intersect.object.material.color.set("blue");
            //     }
            // }
        }
    }
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// // const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#Background'),});
// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshPhongMaterial({color: 0xFF6347 /*, wireframe: true*/} );
// const torus = new THREE.Mesh(geometry, material);
// const pointLight = new THREE.PointLight(0xffffff);
// const ambientLight = new THREE.AmbientLight(0xffffff);
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// const controls = new OrbitControls(camera, renderer.domElement);
// const spaceTexture = new THREE.TextureLoader().load('2k_stars.jpg');
// const moonTexture = new THREE.TextureLoader().load('2k_moon.jpg');
// const moonNormalTexture = new THREE.TextureLoader().load('MoonNormalMap.png');
// const moonDisplacementTexture = new THREE.TextureLoader().load('MoonDisplacementMap.png');

// const moon = new THREE.Mesh(new THREE.SphereGeometry(3,32,32),new THREE.MeshPhongMaterial({ map: moonTexture,normalMap: moonNormalTexture, displacementMap: moonDisplacementTexture}));

// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// camera.position.setZ(30);
// // scene.background = spaceTexture;
// pointLight.position.set(5,5,20);
// moon.position.z = 30;
// moon.position.x = -10;


// // scene.add(torus, pointLight, ambientLight, lightHelper, gridHelper, moon, controls);
// scene.add(torus, pointLight, ambientLight, lightHelper, gridHelper, controls);

// function moveCamera()
// {
//   const top = document.body.getBoundingClientRect().top;
//   moon.rotation.x += 0.05;
//   moon.rotation.y += 0.075;
//   moon.rotation.z += 0.05;
//   camera.position.x = top * -0.01;
//   camera.position.y = top * -0.0002;
//   camera.position.z = top * -0.0002;

// }

// document.body.onscroll = moveCamera;

// // function addStar()
// // {
// //   const geometry = new THREE.SphereGeometry(0.25, 24, 24);
// //   const material = new THREE.MeshPhongMaterial({color: 0xffffff} );
// //   const star = new THREE.Mesh(geometry, material);
// //   const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));
// //   star.position.set(x, y, z);
// //   scene.add(star);
// // }

// function animate()
// {
//   requestAnimationFrame(animate);
// //   torus.rotation.y += 0.01;
//   controls.update();
//   renderer.render(scene, camera);
// }

// // Array(200).fill().forEach(addStar);
// animate();