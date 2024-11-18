document.addEventListener("DOMContentLoaded", function () {


    // Create scene, camera, and renderer
    const container = document.getElementById("three-container");
    const canvas = document.querySelector("canvas.webgl");

    // GUI Setup
    const gui = new lil.GUI({ title: "Menu", width: 250 });
    const debugObject = {
        envMapIntensity: 1,
    }
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

    const scene = new THREE.Scene();

    // Set renderer size and append it to the container
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
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
        'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/px.jpg',
        'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/nx.jpg',
        'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/py.jpg',
        'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/ny.jpg',
        'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/pz.jpg',
        'https://raw.githubusercontent.com/johnnymcoy/3DProject/refs/heads/main/static/textures/environmentMaps/0/nz.jpg'
    ])
    environmentMapTexture.encoding = THREE.sRGBEncoding;
    scene.background = null; //environmentMapTexture
    scene.environment - environmentMapTexture;
    
    const updateAllMaterials = () => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMap = environmentMapTexture;
                child.material.envMapIntensity = debugObject.envMapIntensity;
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.metalness = 0.3;
                child.material.roughness = 0.2;
        
            }
        });
    };
    gui.add(debugObject, "envMapIntensity").min(0).max(20).step(0.001).name("EnvironmentMap Intensity").onChange(updateAllMaterials);

    /**
     * Models
     */
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new THREE.GLTFLoader();
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
            console.log("Loading..")
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

    const PositionMax = 20;

    const guiLightsFolder = gui.addFolder("Lights");
    guiLightsFolder.add(directionalLight, "intensity").min(0).max(10).step(0.01).name("Directional");
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



    // Orbit Controls (commented since it may need more complex configuration for Squarespace)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
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

    /**
     * Animate
     */
    const clock = new THREE.Clock()
    let previousTime = 0

    const objectsToTest = PuzzlePieces;
    let currentIntersect = null;

    // Post
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

    function IsSelected(Obj){
        if(currentIntersect != null)
        {
            return Obj === currentIntersect.object;
        }
        return false;
    }
    
    const framesObject = {
        maxTickRate: 61,
    }
    
    gui.add( framesObject, 'maxTickRate' ).min( 1 ).max( 120 ).step(10);
    
    const raycaster = new THREE.Raycaster();

    const AnimParams = {
        SelectTime : 0.35,
        zOffset: 2
    }

    function handleSelect(object) {
        // console.log("Object selected:", object);
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
        // console.log("Object deselected:", object);
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



    function tick(currentTime) {
        const deltaTime = currentTime - previousTime;
        if (deltaTime < 1000 / framesObject.maxTickRate) {
            window.requestAnimationFrame(tick);
            return;
        }
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
        PuzzlePieces.forEach((piece) => {
            if (IsSelected(piece)) {
                piece.layers.enable(BLOOM_SCENE);
            } else {
                piece.layers.disable(BLOOM_SCENE);
            }
        });

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
        controls.update();

        render();

        // Request the next frame
        requestAnimationFrame(tick);
    }

    tick();
});
