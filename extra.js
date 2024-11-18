/////////////////////////////////////////           Extras  ///////////////////////

//  Camera Helper? doesn't work..
// const cameraHelper = new THREE.CameraHelper(camera);
// cameraHelper.visible = true;
// scene.add(cameraHelper)



///     Test puzzles

// gltfLoader.load(
//     "/static/models/scene.gltf",
//     (gltf) =>{
//         // let Pieces = gltf.scene.children[0].children[0].children[0].children;
//         gltf.scene.traverse((node) => {
//             // const newMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
//             // const newMesh = new THREE.Mesh(node.geometry, newMaterial);
//             // PuzzlePieces[sceneIndex].geometry = node.geometry;
//             for(const PuzzlePiece of PuzzlePieces)
//             {
//                 PuzzlePiece.geometry = node.geometry;
//                 PuzzlePiece.receiveShadow = true;
//                 PuzzlePiece.material = new THREE.MeshStandardMaterial({
//                     color: new THREE.Color(Math.random(), Math.random(), Math.random()),
//                     metalness: 0.3,
//                     roughness: 0.4,
//                     envMap: environmentMapTexture,
//                     envMapIntensity: 0.5
//                 });
//             }
//         })
//         PuzzlePiece_01.position.set(0,0,0);
//         PuzzlePiece_02.position.set(0,3.75,0);
//         PuzzlePiece_03.position.set(3.75,0,0);
//         PuzzlePiece_04.position.set(0,-3.75,0);
//         PuzzlePiece_05.position.set(-3.75,0,0);
//         PuzzlePiece_06.position.set(-3.75,3.75,0);
//         PuzzlePiece_07.position.set(-3.75,-3.75,0);
//         let index = 0;
//         for(const PuzzlePiece of PuzzlePieces)
//         {
//             index++;
//             PuzzlePiece.scale.set(0.025, 0.025, 0.025);
//             PuzzlePiece.castShadow = true;
//             // scene.add(PuzzlePiece);
//         }
//         // PuzzlePiece_01.scale.set(0.025, 0.025, 0.025);
//         // PuzzlePiece_01.position.set(0,4,0);
//         // const material = new THREE.MeshPhongMaterial({color: 0xffffff} );
//         // const PuzzlePieceMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10),material);
//         // console.log(PuzzlePiece_01, PuzzlePieceMesh);
//         // PuzzlePiece_01.castShadow = true;
//         // PuzzlePiece_01.addEventListener();
//         // scene.add(PuzzlePieces);
//     },
//     () =>{
//         console.log("Progress")
//     },
//     () =>{
//         console.log("Error")
//     }
// );


///////////////////     Lights //////////////

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
// scene.add(directionalLightHelper)


// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.1);
// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0,0,10);
spotLight.target.position.x = 0.5;

//Shadows
spotLight.castShadow = true;
spotLight.shadow.mapSize.x = 1024;
spotLight.shadow.mapSize.y = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 2;
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = true;
// scene.add(spotLight, spotLight.target, spotLightCameraHelper);
// guiHelperFolder.add(spotLightCameraHelper, "visible").name("Spot Helper");

guiLightsFolder.add(spotLight, "intensity").min(0).max(10).step(0.01).name("spot");

guiLightsFolder.add(spotLight.position, "x").min(-PositionMax).max(PositionMax).step(0.01).name("Spot x");
guiLightsFolder.add(spotLight.position, "y").min(-PositionMax).max(PositionMax).step(0.01).name("Spot y");
guiLightsFolder.add(spotLight.position, "z").min(-PositionMax).max(PositionMax).step(0.01).name("Spot z");


tick{

    spotLight.target.position.x = currentIntersect.object.position.x;
    spotLight.target.position.y = currentIntersect.object.position.y;
    spotLight.target.updateMatrixWorld();
    // spotLight.update();

}

import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

//  effects

let effect;
effect = new OutlineEffect( renderer,  { defaultThickness: 0.005, defaultColor: [ 0, 0, 0 ], defaultAlpha: 0, defaultKeepAlive: true // keeps outline material in cache even if material is removed from scene 
    } );

//tick
    effect.render( scene, camera );



// FPS STATS


import Stats from 'three/addons/libs/stats.module.js';
let stats;

stats = new Stats();
canvas.appendChild( stats.dom );

tick: 
stats.update();
or:
stats.begin();
stats.end();




 const cubeWidth = 400;
const numberOfSphersPerSide = 5;
const sphereRadius = ( cubeWidth / numberOfSphersPerSide ) * 0.8 * 0.5;
const stepSize = 1.0 / numberOfSphersPerSide;

const geometry = new THREE.SphereGeometry( sphereRadius, 32, 16 );

for ( let alpha = 0, alphaIndex = 0; alpha <= 1.0; alpha += stepSize, alphaIndex ++ ) {

    const colors = new Uint8Array( alphaIndex + 2 );

    for ( let c = 0; c <= colors.length; c ++ ) {

        colors[ c ] = ( c / colors.length ) * 256;

    }

    const gradientMap = new THREE.DataTexture( colors, colors.length, 1, THREE.RedFormat );
    gradientMap.needsUpdate = true;

    for ( let beta = 0; beta <= 1.0; beta += stepSize ) {

        for ( let gamma = 0; gamma <= 1.0; gamma += stepSize ) {

            // basic monochromatic energy preservation
            const diffuseColor = new THREE.Color().setHSL( alpha, 0.5, gamma * 0.5 + 0.1 ).multiplyScalar( 1 - beta * 0.2 );

            const material = new THREE.MeshToonMaterial( {
                color: diffuseColor,
                gradientMap: gradientMap
            } );

            const mesh = new THREE.Mesh( geometry, material );

            mesh.position.x = alpha * 400 - 200;
            mesh.position.y = beta * 400 - 200;
            mesh.position.z = gamma * 400 - 200;

            scene.add( mesh );

        }

    }

}


const groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
const groundMat = new THREE.MeshLambertMaterial( { color: 0xffffff } );
groundMat.color.setHSL( 0.095, 1, 0.75 );

const ground = new THREE.Mesh( groundGeo, groundMat );
ground.position.y = - 33;
ground.rotation.x = - Math.PI / 2;
ground.receiveShadow = true;
scene.add( ground );


///// Materials         //

// const StandardMaterial = new THREE.MeshStandardMaterial();
// StandardMaterial.roughness = 0.2;
// StandardMaterial.metalness = 0.45;
// // StandardMaterial.map = doorColorTexture;
// // StandardMaterial.aoMap = doorAmbientOcclusionTexture;
// StandardMaterial.aoMapIntensity = 1.5;
// // StandardMaterial.alphaMap = doorAlphaTexture;
// StandardMaterial.transparent = true;
// // StandardMaterial.normalMap = doorNormalTexture;
// // StandardMaterial.metalnessMap = doorMetalnessTexture;
// // StandardMaterial.roughnessMap = doorRoughnessTexture;
// // StandardMaterial.displacementMap = doorHeightTexture;
// StandardMaterial.displacementScale = 0.01;




// import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry"

// import {FontLoader} from "three/examples/jsm/loaders/FontLoader"
// const fontLoader = new FontLoader();

// fontLoader.load(
//     "/fonts/helvetiker_regular.typeface.json",
//     createText
// );

// //Needs to be function, as its AFTER the font is loaded
// function createText(font){
//     const bevelSize = 0.03;
//     const bevelThickness = 0.02;
//     console.log("font Loaded");
//     const textGeometry = new TextGeometry(
//             "Portfolio",
//             {
//                 font: font,
//                 size: 0.5,
//                 height: 0.2,
//                 curveSegments: 4,
//                 bevelEnabled: true,
//                 bevelThickness: bevelThickness,
//                 bevelSize: bevelSize,
//                 bevelOffset: 0,
//                 bevelSegments: 2,
//             }
//         );
//     // textGeometry.computeBoundingBox();
//     // textGeometry.translate(
//     //     - (textGeometry.boundingBox.max.x - bevelThickness) * 0.5,
//     //     - (textGeometry.boundingBox.max.y - bevelThickness) * 0.5,
//     //     - (textGeometry.boundingBox.max.z - bevelSize) * 0.5,
//     // );
//     textGeometry.center();

//     // const textMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true});
//     // guiText.add(textMaterial, "wireframe").name("wireframe")
//     const textMaterial = new THREE.MeshMatcapMaterial({matcap: textTexture});
//     const text = new THREE.Mesh(textGeometry, textMaterial);
//     scene.add(text);
//     console.time("donuts");
//     const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45);
//     for(let i = 0; i < 1000; i++)
//     {
//         const donut = new THREE.Mesh(donutGeometry, textMaterial);
//         scene.add(donut);
//         donut.position.x = (Math.random() - 0.5) * 30;
//         donut.position.y = (Math.random() - 0.5) * 30;
//         donut.position.z = (Math.random() - 0.5) * 20;
//         donut.rotation.x = Math.random() * Math.PI;
//         donut.rotation.y = Math.random() * Math.PI;
//         const scale = Math.random()
//         donut.scale.x = scale;
//         donut.scale.y = scale;
//         donut.scale.z = scale;

//     }
//     console.timeEnd("donuts");
// };


// const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45);
// for(let i = 0; i < 1000; i++)
// {
//     const donut = new THREE.Mesh(donutGeometry, ToonMaterial);
//     scene.add(donut);
//     donut.position.x = (Math.random() - 0.5) * 30;
//     donut.position.y = (Math.random() - 0.5) * 30;
//     donut.position.z = (Math.random() - 0.5) * 20;
//     donut.rotation.x = Math.random() * Math.PI;
//     donut.rotation.y = Math.random() * Math.PI;
//     const scale = Math.random()
//     donut.scale.x = scale;
//     donut.scale.y = scale;
//     donut.scale.z = scale;
// }


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


// const objectDistance = 40;

// /**
//  *  Particles
//  */
// const particlesCount = 200;
// const positions = new Float32Array(particlesCount * 3);
// for(let i = 0; i < particlesCount; i++)
// {
//     positions[i * 3 + 0] = (Math.random() - 0.5) * 40;
//     positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance;
//     positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
// }
// const particlesGeometry = new THREE.BufferGeometry();
// particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
// const particleMaterial = new THREE.PointsMaterial({
//     color: "#ffeded",
//     sizeAttenuation: true,
//     size:0.03,
// });
// //Points
// const particles = new THREE.Points(particlesGeometry, particleMaterial);
// scene.add(particles);



const orthographicCamera = new THREE.OrthographicCamera(-1,1,1,-1,1,100);
orthographicCamera.position.z = 8;
orthographicCamera.position.y = 1;
orthographicCamera.position.x = 0;


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
