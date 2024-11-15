import './style.css'

import * as THREE from 'three';
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
// import gsap from "gsap";

/**
 * Debug
 */
const gui = new dat.GUI({title: "Menu", width: 250})
window.addEventListener("keydown", (event) => {
    if(event.key === "h")
    {
        if(gui._hidden)
        {
            gui.show();
        }
        else
        {
            gui.hide();
        }
    }
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 *  Textures
 */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const matcapTexture = textureLoader.load("static/textures/matcaps/7.png");

const gradientTexture = textureLoader.load("static/textures/gradients/3.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;


const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    'static/textures/environmentMaps/0/px.jpg',
    'static/textures/environmentMaps/0/nx.jpg',
    'static/textures/environmentMaps/0/py.jpg',
    'static/textures/environmentMaps/0/ny.jpg',
    'static/textures/environmentMaps/0/pz.jpg',
    'static/textures/environmentMaps/0/nz.jpg'
])
environmentMapTexture.encoding = THREE.sRGBEncoding;
// scene.background = environmentMapTexture;
scene.environment - environmentMapTexture;
const debugObject = {}
debugObject.envMapIntensity = 2.2;
const updateAllMaterials = () => 
{
    scene.traverse((child) => 
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMap = environmentMapTexture;
            child.material.envMapIntensity = debugObject.envMapIntensity;
            child.castShadow = true;
            child.receiveShadow = true;

        }
    });
}    
gui.add(debugObject, "envMapIntensity").min(0).max(20).step(0.001).name("EnviromentMap Intensity").onChange(updateAllMaterials)


/**
 *  Materials
 */

const MatcapMaterial = new THREE.MeshMatcapMaterial();
MatcapMaterial.matcap = matcapTexture;
MatcapMaterial.flatShading = true;


const ToonMaterial = new THREE.MeshToonMaterial();
ToonMaterial.gradientMap = gradientTexture;

const PhongMaterial = new THREE.MeshPhongMaterial();
PhongMaterial.shininess = 100;
PhongMaterial.specular = new THREE.Color(0xff11ff);

// Depth material white when objects are close
// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

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

const StandardMaterialEnvi = new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})


/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
let mixer = null
let PuzzlePiece_01 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: '#ff0000' }));
let PuzzlePiece_02 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: '#fff17f' }));
let PuzzlePiece_03 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: '#0f0090' }));
let PuzzlePiece_04 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: '#ffff00' }));
let PuzzlePiece_05 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: '#ff00ff' }));
let PuzzlePiece_06 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: '#bb1122' }));
// let PuzzlePiece_07 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: '#01f000' }));

// PuzzlePiece_01.material = StandardMaterialEnvi;

let PuzzlePieces = [PuzzlePiece_01, PuzzlePiece_02, PuzzlePiece_03, PuzzlePiece_04, PuzzlePiece_05, PuzzlePiece_06];

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


const Scale = 30;
const RotationX = Math.PI * 0.5;
const PositionMove = 3.0;
gltfLoader.load(
    "/static/models/Jigsaws_02.gltf",
    (gltf) =>{
        // let Pieces = gltf.scene.children[0].children[0].children[0].children;
        let nodeIndex = 0;
        gltf.scene.traverse((node) => {
            if(node.type == "Mesh")
            {
                console.log(node)
                PuzzlePieces[nodeIndex -1].geometry = node.geometry;
                PuzzlePieces[nodeIndex -1].rotation.set(RotationX,0,0);

            }
            // PuzzlePieces[nodeIndex].geometry = node.geometry;
            // for(const PuzzlePiece of PuzzlePieces)
            //     {
            //         PuzzlePiece.geometry = node.geometry;
            //         PuzzlePiece.receiveShadow = true;
            //         PuzzlePiece.material = new THREE.MeshStandardMaterial({
            //             color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            //             metalness: 0.3,
            //             roughness: 0.4,
            //             envMap: environmentMapTexture,
            //             envMapIntensity: 0.5
            //         });
            //     }
                // PuzzlePiece_01.position.set(-PositionMove,PositionMove,0);
                // PuzzlePiece_02.position.set(0,0,0);
                // PuzzlePiece_03.position.set(0,PositionMove,0);
                // PuzzlePiece_04.position.set(-PositionMove, 2 * PositionMove,0);
                // PuzzlePiece_05.position.set(-PositionMove,0,0);
                // PuzzlePiece_06.position.set(0, 2 * PositionMove, 0);
                // PuzzlePiece_07.position.set(-3.75,-3.75,0);
                let index = 0;
                for(const PuzzlePiece of PuzzlePieces)
                {
                    index++;
                    PuzzlePiece.scale.set(Scale, Scale, Scale);
                    PuzzlePiece.castShadow = true;
                    scene.add(PuzzlePiece);
                }
                nodeIndex++
            // const newMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            // const newMesh = new THREE.Mesh(node.geometry, newMaterial);
            // PuzzlePiece_10.geometry = node.geometry;
            // PuzzlePiece_10.scale.set(10,10,10)
            // scene.add(PuzzlePiece_10);


            // PuzzlePieces[sceneIndex].geometry = node.geometry;
            // for(const PuzzlePiece of PuzzlePieces)
            // {
            //     PuzzlePiece.geometry = node.geometry;
            //     PuzzlePiece.receiveShadow = true;
            //     PuzzlePiece.material = new THREE.MeshStandardMaterial({
            //         color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            //         metalness: 0.3,
            //         roughness: 0.4,
            //         envMap: environmentMapTexture,
            //         envMapIntensity: 0.5
            //     });
            // }
        })
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


/**
 * Helpers
 */


const gridHelper = new THREE.GridHelper();

const axesHelper = new THREE.AxesHelper(1);
axesHelper.visible = false;
gridHelper.visible = false;

const guiHelperFolder = gui.addFolder("Helpers");
guiHelperFolder.add(axesHelper, "visible").name("AxesHelper");
guiHelperFolder.add(gridHelper, "visible").name("gridHelper")

scene.add(axesHelper)
scene.add(gridHelper)


/**
 * Lights
 */

//Low Cost
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
ambientLight.intensity = 0
scene.add(ambientLight)

const LightParams = {
    Mapsize: 1024,
}
// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

//Mid Cost 
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(LightParams.Mapsize, LightParams.Mapsize)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
directionalLight.intensity = 0.1
scene.add(directionalLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
// scene.add(directionalLightHelper)
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper);

guiHelperFolder.add(directionalLightCameraHelper, "visible").name("Directional Helper");


const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
pointLight.intensity = 0.76;
// pointLight.scale.set(10,10,10)
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);
guiHelperFolder.add(pointLightHelper, "visible").name("point Helper");

//High Cost
//Only works with MeshPhysical MeshStandardMaterial  
// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 5, 1);
// rectAreaLight.position.set(-1.5,0,3.5);
// rectAreaLight.lookAt(new THREE.Vector3);
// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
//Have to add the .target to the scene to change it's location
// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
// spotLight.position.set(0,2,3);
// //look at location
// spotLight.target.position.x = 0.5;

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



const PositionMax = 20;

const guiLightsFolder = gui.addFolder("Lights");
guiLightsFolder.add(pointLight, "intensity").min(0).max(10).step(0.01).name("Point");
guiLightsFolder.add(spotLight, "intensity").min(0).max(10).step(0.01).name("spot");
guiLightsFolder.add(directionalLight, "intensity").min(0).max(10).step(0.01).name("Directional");
guiLightsFolder.add(ambientLight, "intensity").min(0).max(10).step(0.01).name("Ambient");
guiLightsFolder.add(directionalLight.position, "x").min(-PositionMax).max(PositionMax).step(0.01).name("Directional x");
guiLightsFolder.add(directionalLight.position, "y").min(-PositionMax).max(PositionMax).step(0.01).name("Directional y");
guiLightsFolder.add(directionalLight.position, "z").min(-PositionMax).max(PositionMax).step(0.01).name("Directional z");
guiLightsFolder.add(spotLight.position, "x").min(-PositionMax).max(PositionMax).step(0.01).name("Spot x");
guiLightsFolder.add(spotLight.position, "y").min(-PositionMax).max(PositionMax).step(0.01).name("Spot y");
guiLightsFolder.add(spotLight.position, "z").min(-PositionMax).max(PositionMax).step(0.01).name("Spot z");

// guiLightsFolder.add(directionalLight.shadow.mapSize, "x").min(0).max(4096).step(64).name("MapSize");
// guiLightsFolder.add(directionalLight.shadow.mapSize, "y").min(0).max(4096).step(64).name("MapSize");

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

const cameraGroup = new THREE.Group();
scene.add(cameraGroup)

let CameraParams = {
    bAnimate: false,
    startLocation: new THREE.Vector3(0, 0, 10),
  };

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.copy(CameraParams.startLocation)
scene.add(camera)
cameraGroup.add(camera)

// const cameraHelper = new THREE.CameraHelper(camera);
// cameraHelper.visible = true;
// scene.add(cameraHelper)


// const orthographicCamera = new THREE.OrthographicCamera(-1,1,1,-1,1,100);
// orthographicCamera.position.z = 8;
// orthographicCamera.position.y = 1;
// orthographicCamera.position.x = 0;

  
const guiCameraFolder = gui.addFolder("Camera");
guiCameraFolder.add(CameraParams, "bAnimate");

/**
 * Scroll
 */
// let currentSection = 0;
// let scrollY = window.scrollY;
// window.addEventListener("scroll", ()=>{
//     scrollY = window.scrollY;
//     const newSection = Math.round(scrollY / sizes.height);
//     // if(newSection != currentSection)
//     // {
//     //     currentSection = newSection;
//     //     gsap.to(
//     //         sectionMeshes[currentSection].rotation,
//     //         {
//     //             duration: 1.5,
//     //             ease: "power2.inOut",
//     //             x: "+=6",
//     //             y: "+=3",
//     //             z: "+=1.5"
//     //         }
//     //     )
//     // }
// })


/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true;
guiCameraFolder.add(controls, "enabled");

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

let bSelectedItem = false;

window.addEventListener("click", (event)=>
    {
        gsap.to(
            currentIntersect.object.position,
            {
                duration: 1.5,
                ease: "power2.inOut",
                x: "+=6",
                y: "+=3",
                z: "+=1.5"
            }
        )

        // if(currentIntersect)
        // {
        //     console.log(objectsToTest.findIndex((item) => item === currentIntersect.object))
        //     bSelectedItem = !bSelectedItem;
        //     if(bSelectedItem)
        //     {
        //         camera.position.set(currentIntersect.object.position.x, currentIntersect.object.position.y, 5);
        //     }
        //     else
        //     {
        //         camera.position.copy(CameraParams.startLocation)
        //     }
        // }
        // else
        // {
        //     bSelectedItem = false;
        //     camera.position.copy(CameraParams.startLocation)
        // }
    }
)


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
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap
gui.add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    ACES: THREE.ACESFilmicToneMapping,
})
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001)

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const rayOrigin = new THREE.Vector3(-3,0,0);
const rayDirection = new THREE.Vector3(10,0,0);
const objectsToTest = PuzzlePieces;
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

    raycaster.setFromCamera(mouse, camera)

    if(raycaster != null && objectsToTest)
    {
        if(objectsToTest != null)
        {
            raycaster.intersectObjects(objectsToTest);
            const intersects = raycaster.intersectObjects(objectsToTest);
            for(const object of objectsToTest)
            {
                if(object != null)
                {
                    object.position.z = 0;
                }
            }
            for(const intersect of intersects)
            {
                if(intersect != null && intersect.object != null)
                {
                    // intersect.object.position.z = 0.5;
                }
            }
            if(intersects.length)
            {
                if(currentIntersect === null)
                {
                    // console.log("mouseEnter")
                }
                currentIntersect = intersects[0]
                currentIntersect.object.position.z = 0.5;

                spotLight.target.position.x = currentIntersect.object.position.x;
                spotLight.target.position.y = currentIntersect.object.position.y;
                spotLight.target.updateMatrixWorld();
                // spotLight.update();
                // pointLight.position.x = currentIntersect.object.position.x
                // pointLight.position.y = currentIntersect.object.position.y

                // currentIntersect = intersects[0]
            }
            else
            {
                if(currentIntersect)
                {
                    // console.log("Mouse Leave")
                }
                currentIntersect = null;
            }
            
        }
    }

    if(CameraParams.bAnimate)
    {
        camera.position.y = Math.sin(elapsedTime * 0.05) * 1.5;
        camera.position.x = Math.sin(elapsedTime * 0.1) * 1.5;
    }
    // if(bSelectedItem == false)
    // {
    //     const paralaxX = mouse.x;
    //     const paralaxY = mouse.y; // Ease the movement 
    //     cameraGroup.position.x += (paralaxX - cameraGroup.position.x) * 5 * deltaTime;
    //     cameraGroup.position.y += (paralaxY - cameraGroup.position.y) * 5 * deltaTime;
    // }

    camera.updateProjectionMatrix()


    // camera.position.y = -(scrollY / sizes.height * 40);

    //Update LightHelpers 
    directionalLightCameraHelper.update();
    pointLightHelper.update();
    spotLightCameraHelper.update();

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


/////////////////////////////////////////           Extras  ///////////////////////


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