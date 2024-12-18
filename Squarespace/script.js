
document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("three-container");

    const scene = new THREE.Scene();

    container.style.background = "none";

    const links = [
        "./workforce",
        "./clients",
        "./governance",
        "./systems",
        "./finance",
        "./compliance",
    ]

    // GUI Setup
    const gui = new lil.GUI({ title: "Menu", width: 250 });
    gui.hide();
    window.addEventListener("keydown", (event) => {
        if (event.key === "h") {
           if (gui._hidden) {
                gui.show();
            } else {
               gui.hide();
            }
        }
    });
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild( stats.dom );

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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // Update Post Processing Passes
        composer.setSize(sizes.width, sizes.height)
        finalComposer.setSize(sizes.width, sizes.height);
        bloomComposer.setSize(sizes.width, sizes.height)
    })

    // Set renderer size and append it to the container
    const renderer = new THREE.WebGLRenderer({alpha: true, antialiasing: true});
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // renderer.setSize(container.clientWidth, container.clientHeight);    
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
    container.appendChild(renderer.domElement);

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

    // Environment Map
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
    scene.background = null; //environmentMapTexture
    scene.environment = environmentMapTexture;
    
    const debugObject = {
        envMapIntensity: 1,
        metalness: 0.3,
        roughness: 0.2
    }
    
    const updateAllMaterials = () => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMap = environmentMapTexture;
                child.material.envMapIntensity = debugObject.envMapIntensity;
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.metalness = debugObject.metalness;
                child.material.roughness = debugObject.roughness;
        
            }
        });
    };
    gui.add(debugObject, "envMapIntensity").min(0).max(20).step(0.001).name("EnvironmentMap Intensity").onChange(updateAllMaterials);
    gui.add(debugObject, "metalness").min(0).max(1).step(0.001).name("metalness").onChange(updateAllMaterials)
    gui.add(debugObject, "roughness").min(0).max(1).step(0.001).name("roughness").onChange(updateAllMaterials)
    /**
     * Materials
     */
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

    /**
     * Models
     */
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    const defaultSphere = new THREE.SphereGeometry(0.5, 16, 16);

    let PuzzlePiece_01 = new THREE.Mesh(defaultSphere, Material_01);
    let PuzzlePiece_02 = new THREE.Mesh(defaultSphere, Material_02);
    let PuzzlePiece_03 = new THREE.Mesh(defaultSphere, Material_03);
    let PuzzlePiece_04 = new THREE.Mesh(defaultSphere, Material_04);
    let PuzzlePiece_05 = new THREE.Mesh(defaultSphere, Material_05);
    let PuzzlePiece_06 = new THREE.Mesh(defaultSphere, Material_06);
    
    let PuzzlePieces = [PuzzlePiece_01, PuzzlePiece_02, PuzzlePiece_03, PuzzlePiece_04, PuzzlePiece_05, PuzzlePiece_06];

    const PositionMoveRight = 3.396413;
    const PositionMoveUp = 0.337502 * 6;
    const PositionTotalDown = -2.25;
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
            console.log("Loading..")
            updateAllMaterials();
        },
        (e) =>{
            console.log("Error",e )
        }
    );

    /**
     * Font
     */

    const fontLoader = new THREE.FontLoader();

    fontLoader.load(
        "https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/fonts/gentilis_bold.typeface.json",
        createText
    );
    const fontParams = {
        bevelSize : 0.01,
        bevelThickness : 0.02,
        size: 0.4,
        depth: 0.2,
        scale: 1.0,
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
        const textWorkforceGeometry = new THREE.TextGeometry(
                "Workforce",
                {
                    font: font,
                    size: fontParams.size,
                    height: fontParams.depth,
                    curveSegments: 4,
                    bevelEnabled: true,
                    bevelThickness: fontParams.bevelThickness,
                    bevelSize: fontParams.bevelSize,
                    bevelOffset: 0,
                    bevelSegments: 2,
                });
        const textClientsGeometry =  new THREE.TextGeometry(
                "Clients",
                {
                    font: font,
                    size: fontParams.size,
                    height: fontParams.depth,
                    curveSegments: 4,
                    bevelEnabled: true,
                    bevelThickness: fontParams.bevelThickness,
                    bevelSize: fontParams.bevelSize,
                    bevelOffset: 0,
                    bevelSegments: 2,
                });
            const textGovernanceGeometry =  new THREE.TextGeometry(
                "Governance",
                {
                    font: font,
                    size: fontParams.size,
                    height: fontParams.depth,
                    curveSegments: 4,
                    bevelEnabled: true,
                    bevelThickness: fontParams.bevelThickness,
                    bevelSize: fontParams.bevelSize,
                    bevelOffset: 0,
                    bevelSegments: 2,
                });
            const textSystemsGeometry =  new THREE.TextGeometry(
                "Systems",
                {
                    font: font,
                    size: fontParams.size,
                    height: fontParams.depth,
                    curveSegments: 4,
                    bevelEnabled: true,
                    bevelThickness: fontParams.bevelThickness,
                    bevelSize: fontParams.bevelSize,
                    bevelOffset: 0,
                    bevelSegments: 2,
                });
            const textFinanceGeometry =  new THREE.TextGeometry(
                "Finance",
                {
                    font: font,
                    size: fontParams.size,
                    height: fontParams.depth,
                    curveSegments: 4,
                    bevelEnabled: true,
                    bevelThickness: fontParams.bevelThickness,
                    bevelSize: fontParams.bevelSize,
                    bevelOffset: 0,
                    bevelSegments: 2,
                });
            const textComplianceGeometry =  new THREE.TextGeometry(
                "Compliance",
                {
                    font: font,
                    size: fontParams.size,
                    height: fontParams.depth,
                    curveSegments: 4,
                    bevelEnabled: true,
                    bevelThickness: fontParams.bevelThickness,
                    bevelSize: fontParams.bevelSize,
                    bevelOffset: 0,
                    bevelSegments: 2,
                });
        textWorkforceGeometry.center();
        textClientsGeometry.center();
        textGovernanceGeometry.center();
        textSystemsGeometry.center();
        textFinanceGeometry.center();
        textComplianceGeometry.center();
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

        const OverallUp = -0.5;
    

        textMesh_01.position.set(TextLeft - 0.15, TextUp + OverallUp, TextForward);
        textMesh_02.position.set(TextRight + 0.15, TextUp + OverallUp, TextForward);
        textMesh_03.position.set(TextLeft, 0.15 + OverallUp, TextForward);
        textMesh_04.position.set(TextRight + 0.45, 0.15 + OverallUp, TextForward);
        textMesh_05.position.set(TextLeft - 0.2, -TextDown + 0.2 + OverallUp, TextForward);
        textMesh_06.position.set(TextRight + 0.35, -TextDown -0.1 + OverallUp, TextForward);
        TextMeshes = [textMesh_01, textMesh_02, textMesh_03, textMesh_04, textMesh_05, textMesh_06]
        scene.add(textMesh_01, textMesh_02, textMesh_03, textMesh_04, textMesh_05, textMesh_06);
    }


    /**
     * Helpers
     */
    const guiHelperFolder = gui.addFolder("Helpers");

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
    scene.add( hemiLightHelper );

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
        startLocation: new THREE.Vector3(0, 0, 16),
    };

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.copy(CameraParams.startLocation)
    camera.fov = 32.5

    scene.add(camera)

    cameraGroup.add(camera)

    const guiCameraFolder = gui.addFolder("Camera");
    guiCameraFolder.add(CameraParams, "bAnimate");
    guiCameraFolder.add(camera, "fov").min(10).max(180).step(10);



    // Orbit Controls
    // const controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.target.set(0, 0.75, 0)
    // controls.enableDamping = true;
    // guiCameraFolder.add(controls, "enabled");

    /**
     * Mouse
     */
    const mouse = new THREE.Vector2();
    window.addEventListener("mousemove", (event)=>
        {
            const rect = container.getBoundingClientRect(); // Get the bounding box of the canvas
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }
    )
    /**
     * Selecting
     */
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
                const index = (PuzzlePieces.findIndex((item) => item === currentIntersect.object))
                bSelectedItem = !bSelectedItem;
                const Message = `"Travel To" ${links[index]}`
                console.log(Message);
                // alert(Message);
                // window.location.href = links[index];
                // if(bSelectedItem)
                // {
                //     camera.position.set(currentIntersect.object.position.x, currentIntersect.object.position.y, 5);
                // }
                // else
                // {
                //     camera.position.copy(CameraParams.startLocation)
                // }
            }
            else
            {
                bSelectedItem = false;
                // camera.position.copy(CameraParams.startLocation)
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

    /**
     * Post Processing
     */
    const composer = new THREE.EffectComposer( renderer );
    const renderPass = new THREE.RenderPass( scene, camera );
    composer.addPass( renderPass );

    const ssaoPass = new THREE.SSAOPass(scene, camera, sizes.width, sizes.height);
    composer.addPass(ssaoPass);

    gui.add( ssaoPass, 'output', {
        'Default': THREE.SSAOPass.OUTPUT.Default,
        'SSAO Only': THREE.SSAOPass.OUTPUT.SSAO,
        'SSAO Only + Blur': THREE.SSAOPass.OUTPUT.Blur,
        'Depth': THREE.SSAOPass.OUTPUT.Depth,
        'Normal': THREE.SSAOPass.OUTPUT.Normal
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

    const bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), bloomParams.strength, bloomParams.radius, bloomParams.threshold );
    composer.addPass(bloomPass);

    // Replace OutputPass with ShaderPass using CopyShader
    const outputPass = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(outputPass);

    const bloomComposer = new THREE.EffectComposer( renderer );
    bloomComposer.renderToScreen = true;
    bloomComposer.addPass( renderPass );
    bloomComposer.addPass( bloomPass );
    
    const mixPass = new THREE.ShaderPass(
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

    bloomFolder.add(bloomParams, 'threshold', 0.0, 1.0).onChange(value => bloomPass.threshold = value);
    bloomFolder.add(bloomParams, 'strength', 0.0, 3.0).onChange(value => bloomPass.strength = value);
    bloomFolder.add(bloomParams, 'radius', 0.0, 1.0).onChange(value => bloomPass.radius = value);


    const finalComposer = new THREE.EffectComposer( renderer );
    finalComposer.addPass( renderPass );
    finalComposer.addPass( ssaoPass );
    finalComposer.addPass( mixPass );
    finalComposer.addPass( outputPass );



    function render() {
        scene.traverse( darkenNonBloomed );
        bloomComposer.render();
        scene.traverse( restoreMaterial );
        // render the entire scene, then render bloom scene on top
        finalComposer.render();
    }
    
    function darkenNonBloomed( obj ) 
    {
        if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) 
        {
            materials[ obj.uuid ] = obj.material;
            obj.material = darkMaterial;
        }
    }
    
    function restoreMaterial( obj ) 
    {
        if ( materials[ obj.uuid ] ) 
        {
            obj.material = materials[ obj.uuid ];
            delete materials[ obj.uuid ];
        }
    }
    
    
    const raycaster = new THREE.Raycaster();

    const easeTypes = [
        "power1.in",
        "power1.out",
        "power1.inOut",
        "power2.in",
        "power2.out",
        "power2.inOut",
        "power3.in",
        "power3.out",
        "power3.inOut",
        "power4.in",
        "power4.out",
        "power4.inOut",
        "back.in",
        "back.out",
        "back.inOut",
    ]
    const AnimParams = {
        SelectTime : 0.35,
        zOffset: 1,
        FontZOffset: 1.5,
        easeInType: easeTypes[4],
        easeOutType: easeTypes[10]


    }
    gui.add( AnimParams, 'easeInType', easeTypes).name("Ease In");;
    gui.add( AnimParams, 'easeOutType', easeTypes).name("Ease Out");;

    function handleSelect(object) {
        document.body.style.cursor = "pointer";
        gsap.killTweensOf(object.position);
        const index = PuzzlePieces.findIndex(item => item === object);
        if(TextMeshes[index] !== undefined)
        {
            gsap.killTweensOf(TextMeshes[index].position);
            gsap.to(TextMeshes[index].position, {
                duration: AnimParams.SelectTime,
                ease: AnimParams.easeInType,
                z: AnimParams.FontZOffset 
            });
            gsap.to(TextMeshes[index].scale, {
                duration: AnimParams.SelectTime,
                ease: AnimParams.easeInType,
                x: fontParams.scale * 1.25,
                y: fontParams.scale * 1.25,
                z: fontParams.scale * 1.25
            });
        }
        for(const PuzzlePiece of PuzzlePieces)
        {
            PuzzlePiece.layers.disable(BLOOM_SCENE)
        }
        object.layers.enable(BLOOM_SCENE);
        gsap.to(object.position, {
            duration: AnimParams.SelectTime,
            ease: AnimParams.easeInType,
            z: AnimParams.zOffset
        });
        gsap.to(object.scale, {
            duration: AnimParams.SelectTime,
            ease: AnimParams.easeInType,
            x: PuzzleScale * 1.25,
            y: PuzzleScale * 1.25,
            z: PuzzleScale * 1.25
        });
    }
    // Function called when an object is deselected
    function handleDeselect(object) {
        gsap.killTweensOf(object.position);
        const index = PuzzlePieces.findIndex(item => item === object);
        if(TextMeshes[index] !== undefined)
        {
            gsap.killTweensOf(TextMeshes[index].position);
            gsap.to(TextMeshes[index].position, {
                duration: AnimParams.SelectTime,
                ease: AnimParams.easeOutType,
                z: TextForward 
            });
            gsap.to(TextMeshes[index].scale, {
                duration: AnimParams.SelectTime,
                ease: AnimParams.easeOutType,
                x: fontParams.scale,
                y: fontParams.scale,
                z: fontParams.scale
            });
        }    
        object.layers.enable(BLOOM_SCENE);
        gsap.to(object.position, {
            duration: AnimParams.SelectTime,
            ease: AnimParams.easeOutType,
            z: "0"
        });
        gsap.to(object.scale, {
            duration: AnimParams.SelectTime,
            ease: AnimParams.easeOutType,
            x: PuzzleScale,
            y: PuzzleScale,
            z: PuzzleScale
        });
    }

    gui.add( AnimParams, 'SelectTime' ).min( 0.05 ).max( 6 ).step(0.01);

    const framesObject = {
        maxTickRate: 61,
    }
    
    gui.add( framesObject, 'maxTickRate' ).min( 1 ).max( 61 ).step(10);

    // TODO 
    // Remove Shadows
    // Remove Lights
    // let FrameTimes = []
    function optimize(frameTime){
        // if(isNaN(frameTime)){return}
        // FrameTimes.push(frameTime)
        // if(FrameTimes.length > 10)
        // {
        //     FrameTimes.shift();
        // }
        // else{
        // }
        // // console.l]og(FrameTimes)
        // const average = FrameTimes.reduce((acc, c) => acc + c, 0) / FrameTimes.length;
        // // console.log(FrameTimes)
    
        // // if(average >= 20)
        // // {
        // //     directionalLight.visible = false;
        // //     console.log("HI")
        // // }
        // // else
        // // {
        // //     directionalLight.visible = true;
        // // }
    }

    function HightlightAllPieces(){
        for(const PuzzlePiece of PuzzlePieces)
        {
            PuzzlePiece.layers.enable(BLOOM_SCENE)
        }
    }


    function init(){
        HightlightAllPieces();
    }

    function tick(currentTime) {
        stats.update()
        const deltaTime = currentTime - previousTime;
        optimize(deltaTime);

        if (deltaTime < 1000 / framesObject.maxTickRate) {
            window.requestAnimationFrame(tick);
            return;
        }
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
                HightlightAllPieces();
                document.body.style.cursor = "default";
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

        // Update Controls
        // controls.update();

        render();
        // Request the next frame
        requestAnimationFrame(tick);
    }

    init();
    tick();
});
