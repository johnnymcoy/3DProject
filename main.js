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


import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry"
import {FontLoader} from "three/examples/jsm/loaders/FontLoader"




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

const stats = new Stats();
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 500))
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 10))
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.CineonToneMapping
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap
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

const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0-1/px.jpg',
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0-1/nx.jpg',
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0-1/py.jpg',
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0-1/ny.jpg',
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0-1/pz.jpg',
    'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0-1/nz.jpg'
])
environmentMapTexture.minFilter = THREE.NearestFilter;
environmentMapTexture.magFilter = THREE.NearestFilter;
environmentMapTexture.generateMipmaps = true;
environmentMapTexture.encoding = THREE.sRGBEncoding;
scene.background = null;
scene.environment = environmentMapTexture;

const debugObject = {
    envMapIntensity: 1,
    metalness: 0.3,
    roughness: 0.2
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
            child.material.metalness = debugObject.metalness;
            child.material.roughness = debugObject.roughness;
        }
    });
}    
gui.add(debugObject, "envMapIntensity").min(0).max(20).step(0.001).name("EnviromentMap Intensity").onChange(updateAllMaterials)
gui.add(debugObject, "metalness").min(0).max(1).step(0.001).name("metalness").onChange(updateAllMaterials)
gui.add(debugObject, "roughness").min(0).max(1).step(0.001).name("roughness").onChange(updateAllMaterials)


/**
 *  Materials
 */



/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const defaultSphere = new THREE.SphereGeometry(0.5, 16, 16);
const Material_01 = new THREE.MeshStandardMaterial({
    color: Colors[0],
    metalness: debugObject.metalness,
    roughness: debugObject.roughness,
});
const Material_02 = new THREE.MeshStandardMaterial({
    color: Colors[1],
    metalness: debugObject.metalness,
    roughness: debugObject.roughness,
})
const Material_03 = new THREE.MeshStandardMaterial({
    color: Colors[2],
    metalness: debugObject.metalness,
    roughness: debugObject.roughness,
})
const Material_04 = new THREE.MeshStandardMaterial({
    color: Colors[3],
    metalness: debugObject.metalness,
    roughness: debugObject.roughness,
})
const Material_05 = new THREE.MeshStandardMaterial({
    color: Colors[4],
    metalness: debugObject.metalness,
    roughness: debugObject.roughness,
})
const Material_06 = new THREE.MeshStandardMaterial({
    color: Colors[5],
    metalness: debugObject.metalness,
    roughness: debugObject.roughness,
})

let PuzzlePiece_01 = new THREE.Mesh(defaultSphere, Material_01);
let PuzzlePiece_02 = new THREE.Mesh(defaultSphere, Material_02);
let PuzzlePiece_03 = new THREE.Mesh(defaultSphere, Material_03);
let PuzzlePiece_04 = new THREE.Mesh(defaultSphere, Material_04);
let PuzzlePiece_05 = new THREE.Mesh(defaultSphere, Material_05);
let PuzzlePiece_06 = new THREE.Mesh(defaultSphere, Material_06);
let PuzzlePieces = [PuzzlePiece_01, PuzzlePiece_02, PuzzlePiece_03, PuzzlePiece_04, PuzzlePiece_05, PuzzlePiece_06];

const PositionMoveRight = 3.396413;
const PositionMoveUp = 0.337502 * 6;

const PositionTotalDown = -1.75;
const PositionTotalLeft = 1.75;


const PuzzleScale = 30;
const RotationX = Math.PI * 0.5;
gltfLoader.load(
    "https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/models/Jigsaws_07_LowPoly.gltf",
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
        // Set Proper Index Values
        PuzzlePieces = [PuzzlePiece_04, PuzzlePiece_06, PuzzlePiece_01, PuzzlePiece_03, PuzzlePiece_05, PuzzlePiece_02]
        let index = 0;
        for(const PuzzlePiece of PuzzlePieces)
        {
            index++;
            PuzzlePiece.scale.set(PuzzleScale, PuzzleScale, PuzzleScale);
            PuzzlePiece.castShadow = true;
            scene.add(PuzzlePiece);
        }
        updateAllMaterials();
    },
    () =>{
        console.log("Loading.. ")
        updateAllMaterials();
    },
    (e) =>{
        console.log("Error",e )
    }
);



const fontLoader = new FontLoader();

fontLoader.load(
    "https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/fonts/gentilis_bold.typeface.json",
    createText
);

const fontParams = {
    bevelSize : 0.01,
    bevelThickness : 0.02,
    size: 0.4,
    depth: 0.2,
}


let textMesh_01 = null;
let textMesh_02 = null;
let textMesh_03 = null;
let textMesh_04 = null;
let textMesh_05 = null;
let textMesh_06 = null;
let TextMeshes = [];
const TextForward = 0.4;

//Needs to be function, as its AFTER the font is loaded
function createText(font){
    const textWorkforceGeometry = new TextGeometry(
            "Workforce",
            {
                font: font,
                size: fontParams.size,
                depth: fontParams.depth,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: fontParams.bevelThickness,
                bevelSize: fontParams.bevelSize,
                bevelOffset: 0,
                bevelSegments: 2,
            });
    const textClientsGeometry =  new TextGeometry(
            "Clients",
            {
                font: font,
                size: fontParams.size,
                depth: fontParams.depth,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: fontParams.bevelThickness,
                bevelSize: fontParams.bevelSize,
                bevelOffset: 0,
                bevelSegments: 2,
            });
        const textGovernanceGeometry =  new TextGeometry(
            "Governance",
            {
                font: font,
                size: fontParams.size,
                depth: fontParams.depth,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: fontParams.bevelThickness,
                bevelSize: fontParams.bevelSize,
                bevelOffset: 0,
                bevelSegments: 2,
            });
        const textSystemsGeometry =  new TextGeometry(
            "Systems",
            {
                font: font,
                size: fontParams.size,
                depth: fontParams.depth,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: fontParams.bevelThickness,
                bevelSize: fontParams.bevelSize,
                bevelOffset: 0,
                bevelSegments: 2,
            });
        const textFinanceGeometry =  new TextGeometry(
            "Finance",
            {
                font: font,
                size: fontParams.size,
                depth: fontParams.depth,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: fontParams.bevelThickness,
                bevelSize: fontParams.bevelSize,
                bevelOffset: 0,
                bevelSegments: 2,
            });
        const textComplianceGeometry =  new TextGeometry(
            "Compliance",
            {
                font: font,
                size: fontParams.size,
                depth: fontParams.depth,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: fontParams.bevelThickness,
                bevelSize: fontParams.bevelSize,
                bevelOffset: 0,
                bevelSegments: 2,
            });
    TextGeometries.push(textWorkforceGeometry, textClientsGeometry, textGovernanceGeometry, textSystemsGeometry, textFinanceGeometry, textComplianceGeometry);                              
    console.log(textWorkforceGeometry)
    for(const singleText of TextGeometries)
    {
        singleText.center();
    
    }

    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - bevelThickness) * 0.5,
    //     - (textGeometry.boundingBox.max.y - bevelThickness) * 0.5,
    //     - (textGeometry.boundingBox.max.z - bevelSize) * 0.5,
    // );
    textMesh_01 = new THREE.Mesh(textWorkforceGeometry, Material_04);
    textMesh_02 = new THREE.Mesh(textClientsGeometry, Material_06);
    textMesh_03 = new THREE.Mesh(textGovernanceGeometry, Material_01);
    textMesh_04 = new THREE.Mesh(textSystemsGeometry, Material_03);
    textMesh_05 = new THREE.Mesh(textFinanceGeometry, Material_05);
    textMesh_06 = new THREE.Mesh(textComplianceGeometry, Material_02);

    const TextRight = PositionMoveRight * 0.4;
    const TextLeft = PositionMoveRight * -0.55;

    const TextUp = PositionMoveUp * 1.15;
    const TextDown = PositionMoveUp * 0.85;

    textMesh_01.position.set(TextLeft - 0.15, TextUp, TextForward);
    textMesh_02.position.set(TextRight + 0.15, TextUp, TextForward);
    textMesh_03.position.set(TextLeft, 0.15, TextForward);
    textMesh_04.position.set(TextRight + 0.45, 0.15, TextForward);
    textMesh_05.position.set(TextLeft - 0.2, -TextDown + 0.2, TextForward);
    textMesh_06.position.set(TextRight + 0.35, -TextDown -0.1, TextForward);
    TextMeshes = [textMesh_01, textMesh_02, textMesh_03, textMesh_04, textMesh_05, textMesh_06]
    scene.add(textMesh_01, textMesh_02, textMesh_03, textMesh_04, textMesh_05, textMesh_06);

    // Mesh_Group_01.add(PuzzlePiece_01);
    // Mesh_Group_01.add(textMesh_01);
    // scene.add(Mesh_Group_01);
}



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

const guiHelperFolder = gui.addFolder("Helpers");

guiHelperFolder.add(floor, "visible").name("Floor");


/**
 * Helpers
 */

const gridHelper = new THREE.GridHelper();

const axesHelper = new THREE.AxesHelper(1);
axesHelper.visible = false;
gridHelper.visible = false;


scene.add(axesHelper)
scene.add(gridHelper)


guiHelperFolder.add(axesHelper, "visible").name("AxesHelper");
guiHelperFolder.add(gridHelper, "visible").name("gridHelper")


/**
 * Lights
 */


const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.castShadow = false;
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 50, 0 );
scene.add( hemiLight );

const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
// scene.add( hemiLightHelper );



//Low Cost
const LightParams = {
    Mapsize: 512,
}

//Mid Cost 
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(LightParams.Mapsize, LightParams.Mapsize)
directionalLight.shadow.camera.far = 10
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


const PositionMax = 20;

const guiLightsFolder = gui.addFolder("Lights");
guiLightsFolder.add(directionalLight, "intensity").min(0).max(10).step(0.01).name("Directional");
guiLightsFolder.add(directionalLight.position, "x").min(-PositionMax).max(PositionMax).step(0.01).name("Directional x");
guiLightsFolder.add(directionalLight.position, "y").min(-PositionMax).max(PositionMax).step(0.01).name("Directional y");
guiLightsFolder.add(directionalLight.position, "z").min(-PositionMax).max(PositionMax).step(0.01).name("Directional z");
guiLightsFolder.add(directionalLight, "visible").name("Directional");
guiLightsFolder.add(hemiLight, "visible").name("hemi");





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
        const rect = canvas.getBoundingClientRect(); // Get the bounding box of the canvas
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
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

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

// const Mesh_Group_01 = new THREE.Group()

// const MeshGroups = [Mesh_Group_01]
const objectsToTest = PuzzlePieces;
// const groupsToTest = MeshGroups;

let currentIntersect = null;


//
// Raycaster
// 
const raycaster = new THREE.Raycaster();

const AnimParams = {
    SelectTime : 0.35,
    zOffset: 2,
    FontZOffset: 2.5
}


function handleSelect(object) {
    // console.log("Object selected:", object);
    gsap.killTweensOf(object.position);
    const index = PuzzlePieces.findIndex(item => item === object);
    if(TextMeshes[index] !== undefined)
    {
        gsap.killTweensOf(TextMeshes[index].position);
        gsap.to(TextMeshes[index].position, {
            duration: AnimParams.SelectTime,
            ease: "power2.inOut",
            z: AnimParams.FontZOffset 
        });
    }
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
    gsap.killTweensOf(object.position);
    object.layers.disable(BLOOM_SCENE);
    const index = PuzzlePieces.findIndex(item => item === object);
    if(TextMeshes[index] !== undefined)
    {
        gsap.killTweensOf(TextMeshes[index].position);
        gsap.to(TextMeshes[index].position, {
            duration: AnimParams.SelectTime,
            ease: "power2.inOut",
            z: TextForward 
        });
    }    
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

    // Animate camera if required
    if (CameraParams.bAnimate) {
        const elapsedTime = clock.getElapsedTime(); // Ensure elapsedTime is calculated here
        camera.position.y = Math.sin(elapsedTime * 0.05) * 1.5;
        camera.position.x = Math.sin(elapsedTime * 0.1) * 1.5;
    }

    // Update camera and light helpers
    camera.updateProjectionMatrix();
    directionalLightCameraHelper.update();

    // Update controls
    controls.update();

    // Render the scene
    render();

    stats.end();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
