import './style.css'

import * as THREE from 'three';
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import Stats from 'three/addons/libs/stats.module.js';


import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

/**
 * Debug
 */
const gui = new dat.GUI({title: "Menu", width: 250})
gui.close();
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


// Matrix 

//  [ 4   6 ]
//  [ 1   3 ]
//  [ 5   2 ]

const Colors =[
    new THREE.Color("#00d6d3"),
    new THREE.Color("#ffb87b"),
    new THREE.Color("#77efff"),
    new THREE.Color("#ff7600"),
    new THREE.Color("#023c3b"),
    new THREE.Color("#007e8f"),
]

const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};

// Canvas

let stats;
stats = new Stats();
document.body.appendChild( stats.dom );

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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
renderer.toneMapping = THREE.CineonToneMapping
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap
gui.add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    ACES: THREE.ACESFilmicToneMapping,
    Cineon: THREE.CineonToneMapping,
    Agx: THREE.AgXToneMapping,
    neutral: THREE.NeutralToneMapping
})
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001)


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
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/px.jpg',
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/nx.jpg',
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/py.jpg',
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/ny.jpg',
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/pz.jpg',
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/nz.jpg'
])





// const environment = new RoomEnvironment();
// const pmremGenerator = new THREE.PMREMGenerator( renderer );
// scene.environment = pmremGenerator.fromScene( environment ).texture;

environmentMapTexture.encoding = THREE.sRGBEncoding;
scene.background = null; //environmentMapTexture
scene.environment - environmentMapTexture;

const debugObject = {
    envMapIntensity: 1,
}


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
            child.material.metalness = 0.3;
            child.material.roughness = 0.2;
        }
    });
}    
gui.add(debugObject, "envMapIntensity").min(0).max(20).step(0.001).name("EnviromentMap Intensity").onChange(updateAllMaterials)


/**
 *  Materials
 */

// const MatcapMaterial = new THREE.MeshMatcapMaterial();
// MatcapMaterial.matcap = matcapTexture;
// MatcapMaterial.flatShading = true;


// const ToonMaterial = new THREE.MeshToonMaterial();
// ToonMaterial.gradientMap = gradientTexture;

// const PhongMaterial = new THREE.MeshPhongMaterial();
// PhongMaterial.shininess = 100;
// PhongMaterial.specular = new THREE.Color(0xff11ff);

// Depth material white when objects are close
// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const StandardMaterialEnvi = new THREE.MeshStandardMaterial({
//     color: '#777777',
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5
// })


/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
let mixer = null
let PuzzlePiece_01 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshStandardMaterial({
    color: Colors[0],
    metalness: 0,
    roughness: 1,
}));
let PuzzlePiece_02 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshStandardMaterial({
    color: Colors[1],
    metalness: 0,
    roughness: 1,
}));
let PuzzlePiece_03 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshStandardMaterial({
    color: Colors[2],
    metalness: 0,
    roughness: 1,

}));
let PuzzlePiece_04 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshStandardMaterial({
    color: Colors[3],
    metalness: 0,
    roughness: 1,

}));
let PuzzlePiece_05 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshStandardMaterial({
    color: Colors[4],
    metalness: 0,
    roughness: 1,

}));
let PuzzlePiece_06 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshStandardMaterial({
    color: Colors[5],
    metalness: 0,
    roughness: 1,
}));

let PuzzlePieces = [PuzzlePiece_01, PuzzlePiece_02, PuzzlePiece_03, PuzzlePiece_04, PuzzlePiece_05, PuzzlePiece_06];

const PositionMoveRight = 3.396413;
const PositionMoveUp = 0.337502 * 6;

const PositionTotalDown = -1.75;
const PositionTotalLeft = 1.75;


const PuzzleScale = 30;
const RotationX = Math.PI * 0.5;
gltfLoader.load(
    "https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/models/Jigsaws_06.gltf",
    (gltf) =>{
        let nodeIndex = 0;
        gltf.scene.traverse((node) => {
            if(node.type == "Mesh")
            {
                PuzzlePieces[nodeIndex - 1].geometry = node.geometry;
                PuzzlePieces[nodeIndex - 1].rotation.set(RotationX,0,0);
                PuzzlePieces[nodeIndex -1].receiveShadow = true;
                PuzzlePieces[nodeIndex -1].castShadow = true;
            }
            nodeIndex++
        })
        PuzzlePiece_01.position.set(-PositionMoveRight + PositionTotalLeft,PositionMoveUp + PositionTotalDown,0);
        PuzzlePiece_02.position.set(PositionTotalLeft,PositionTotalDown,0);
        PuzzlePiece_03.position.set(PositionTotalLeft,PositionMoveUp + PositionTotalDown,0);
        PuzzlePiece_04.position.set(-PositionMoveRight + PositionTotalLeft, 2 * PositionMoveUp + PositionTotalDown,0);
        PuzzlePiece_05.position.set(-PositionMoveRight + PositionTotalLeft,PositionTotalDown,0);
        PuzzlePiece_06.position.set(PositionTotalLeft, 2 * PositionMoveUp + PositionTotalDown, 0);

        let index = 0;
        for(const PuzzlePiece of PuzzlePieces)
        {
            index++;
            PuzzlePiece.scale.set(PuzzleScale, PuzzleScale, PuzzleScale);
            PuzzlePiece.castShadow = true;
            scene.add(PuzzlePiece);
        }

        updateAllMaterials() 

    },
    () =>{
        console.log("Progress")
        updateAllMaterials();
    },
    (e) =>{
        console.log("Error",e )
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
floor.visible = false

scene.add(floor)


/**
 * Helpers
 */


const gridHelper = new THREE.GridHelper();

const axesHelper = new THREE.AxesHelper(1);
axesHelper.visible = false;
gridHelper.visible = false;

const guiHelperFolder = gui.addFolder("Helpers");

scene.add(axesHelper)
scene.add(gridHelper)


guiHelperFolder.add(axesHelper, "visible").name("AxesHelper");
guiHelperFolder.add(gridHelper, "visible").name("gridHelper")
guiHelperFolder.add(floor, "visible").name("Floor");



/**
 * Lights
 */


const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 50, 0 );
scene.add( hemiLight );

const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
scene.add( hemiLightHelper );



//Low Cost
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
// ambientLight.intensity = 0
// scene.add(ambientLight)

const LightParams = {
    Mapsize: 1024,
}

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
directionalLight.intensity = 0.5
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

guiHelperFolder.add(directionalLightCameraHelper, "visible").name("Directional Helper");


// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// pointLight.intensity = 0.76;
// pointLight.scale.set(10,10,10)
// scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// pointLightHelper.visible = false;
// scene.add(pointLightHelper);
// guiHelperFolder.add(pointLightHelper, "visible").name("point Helper");

//High Cost
//Only works with MeshPhysical MeshStandardMaterial  
// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 5, 1);
// rectAreaLight.position.set(-1.5,0,3.5);
// rectAreaLight.lookAt(new THREE.Vector3);
// // const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(rectAreaLight)
//Have to add the .target to the scene to change it's location
// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
// spotLight.position.set(0,2,3);
// //look at location
// spotLight.target.position.x = 0.5;




const PositionMax = 20;

const guiLightsFolder = gui.addFolder("Lights");
// guiLightsFolder.add(pointLight, "intensity").min(0).max(10).step(0.01).name("Point");
guiLightsFolder.add(directionalLight, "intensity").min(0).max(10).step(0.01).name("Directional");
// guiLightsFolder.add(ambientLight, "intensity").min(0).max(10).step(0.01).name("Ambient");
guiLightsFolder.add(directionalLight.position, "x").min(-PositionMax).max(PositionMax).step(0.01).name("Directional x");
guiLightsFolder.add(directionalLight.position, "y").min(-PositionMax).max(PositionMax).step(0.01).name("Directional y");
guiLightsFolder.add(directionalLight.position, "z").min(-PositionMax).max(PositionMax).step(0.01).name("Directional z");





/**
 * Camera
 */

const cameraGroup = new THREE.Group();
scene.add(cameraGroup)

let CameraParams = {
    bAnimate: false,
    startLocation: new THREE.Vector3(0, 0, 20),
  };

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.copy(CameraParams.startLocation)
camera.fov = 45

scene.add(camera)

cameraGroup.add(camera)

const guiCameraFolder = gui.addFolder("Camera");
guiCameraFolder.add(CameraParams, "bAnimate");
guiCameraFolder.add(camera, "fov").min(10).max(180).step(10);




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
        // gsap.to(
        //     currentIntersect.object.position,
        //     {
        //         duration: 1.5,
        //         ease: "power2.inOut",
        //         // x: "+=6",
        //         // y: "+=3",
        //         z: "+=1.5"
        //     }
        // )

        if(currentIntersect)
        {
            // currentIntersect.object.layers.toggle(BLOOM_SCENE);
            // render();
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
        }
    }
)




/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const objectsToTest = PuzzlePieces;
let currentIntersect = null;


// Post

const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );
const ssaoPass = new SSAOPass( scene, camera, sizes.width, sizes.height );
composer.addPass( ssaoPass );

const outputPass = new OutputPass();
composer.addPass( outputPass );

gui.add( ssaoPass, 'output', {
    'Default': SSAOPass.OUTPUT.Default,
    'SSAO Only': SSAOPass.OUTPUT.SSAO,
    'SSAO Only + Blur': SSAOPass.OUTPUT.Blur,
    'Depth': SSAOPass.OUTPUT.Depth,
    'Normal': SSAOPass.OUTPUT.Normal
} ).onChange( function ( value ) {
    ssaoPass.output = value;
} );

gui.add( ssaoPass, 'kernelRadius' ).min( 0 ).max( 32 );
gui.add( ssaoPass, 'minDistance' ).min( 0.001 ).max( 0.02 );
gui.add( ssaoPass, 'maxDistance' ).min( 0.01 ).max( 0.3 );
gui.add( ssaoPass, 'enabled' );

const BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );


const bloomParams = {
    threshold: 0.4,
    strength: 1,
    radius: 0.5,
    exposure: 1
};



const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = bloomParams.threshold;
bloomPass.strength = bloomParams.strength;
bloomPass.radius = bloomParams.radius;

const bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderPass );
bloomComposer.addPass( bloomPass );

const mixPass = new ShaderPass(
    new THREE.ShaderMaterial( {
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        defines: {}
    } ), 'baseTexture'
);
mixPass.needsSwap = true;

const bloomFolder = gui.addFolder( 'bloom' );

bloomFolder.add( bloomParams, 'threshold', 0.0, 1.0 ).onChange( function ( value ) {
    bloomPass.threshold = Number( value );
} );

const finalComposer = new EffectComposer( renderer );
finalComposer.addPass( renderPass );
finalComposer.addPass( mixPass );
finalComposer.addPass( ssaoPass );
finalComposer.addPass( outputPass );


function render() {

    scene.traverse( darkenNonBloomed );
    bloomComposer.render();
    scene.traverse( restoreMaterial );

    // render the entire scene, then render bloom scene on top
    finalComposer.render();

}

function darkenNonBloomed( obj ) {

    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;
    }
}

function restoreMaterial( obj ) {

    if ( materials[ obj.uuid ] ) {

        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];

    }
}

const framesObject = {
    maxTickRate: 61,
}

gui.add( framesObject, 'maxTickRate' ).min( 1 ).max( 120 ).step(10);


function IsSelected(Obj){
    if(currentIntersect != null)
    {
        return Obj === currentIntersect.object;
    }
    return false;
}


//
// Raycaster
// 

const raycaster = new THREE.Raycaster();

const AnimParams = {
    SelectTime : 0.35,
    zOffset: 2
}

function handleSelect(object) {
    console.log("Object selected:", object);
    gsap.killTweensOf(object.position);
    object.layers.enable(BLOOM_SCENE);
    gsap.to(object.position, {
        duration: AnimParams.SelectTime,
        ease: "power2.inOut",
        z: AnimParams.zOffset
    });
    gsap.to(object.scale, {
        duration: AnimParams.SelectTime,
        ease: "power2.inOut",
        x: PuzzleScale * 1.25,
        y: PuzzleScale * 1.25,
        z: PuzzleScale * 1.25
    });
}

// Function called when an object is deselected
function handleDeselect(object) {
    console.log("Object deselected:", object);
    gsap.killTweensOf(object.position);
    object.layers.disable(BLOOM_SCENE);

    gsap.to(object.position, {
        duration: AnimParams.SelectTime,
        ease: "power2.inOut",
        z: "0"
    });
    gsap.to(object.scale, {
        duration: AnimParams.SelectTime,
        ease: "power2.inOut",
        x: PuzzleScale,
        y: PuzzleScale,
        z: PuzzleScale
    });

}

gui.add( AnimParams, 'SelectTime' ).min( 0.05 ).max( 6 ).step(0.01);


const tick = (currentTime) => {
    // Calculate time delta and limit frame rate based on maxTickRate
    const deltaTime = currentTime - previousTime;
    if (deltaTime < 1000 / framesObject.maxTickRate) {
        window.requestAnimationFrame(tick);
        return;
    }

    stats.begin();
    previousTime = currentTime;

    // Update animations and mixers
    if (mixer) {
        mixer.update(deltaTime / 1000); // deltaTime is in ms; convert to seconds for update
    }

    // Handle raycasting for selection
    if (objectsToTest) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objectsToTest);

        if (intersects.length > 0) {
            // Handle selecting a new object
            if (currentIntersect === null) {
                currentIntersect = intersects[0];
                handleSelect(currentIntersect.object);
            } else if (currentIntersect.object !== intersects[0].object) {
                // Handle deselecting previous and selecting a new object
                handleDeselect(currentIntersect.object);
                currentIntersect = intersects[0];
                handleSelect(currentIntersect.object);
            }
        } else if (currentIntersect !== null) {
            // Handle deselecting when no object is intersected
            handleDeselect(currentIntersect.object);
            currentIntersect = null;
        }
    }

    // Update layers for bloom effect on puzzle pieces
    // PuzzlePieces.forEach((piece) => {
    //     if (IsSelected(piece)) {
    //         piece.layers.enable(BLOOM_SCENE);
    //     } else {
    //         piece.layers.disable(BLOOM_SCENE);
    //     }
    // });

    // Animate camera if required
    if (CameraParams.bAnimate) {
        const elapsedTime = clock.getElapsedTime(); // Ensure elapsedTime is calculated here
        camera.position.y = Math.sin(elapsedTime * 0.05) * 1.5;
        camera.position.x = Math.sin(elapsedTime * 0.1) * 1.5;
    }

    // Update camera and light helpers
    camera.updateProjectionMatrix();
    directionalLightCameraHelper.update();
    // pointLightHelper.update();

    // Update controls
    controls.update();

    // Render the scene
    render();

    stats.end();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
