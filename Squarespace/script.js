document.addEventListener("DOMContentLoaded", function () {

    // Create scene, camera, and renderer
    const container = document.getElementById("three-container");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    // Set renderer size and append it to the container
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Orbit Controls (commented since it may need more complex configuration for Squarespace)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // GUI Setup
    const gui = new lil.GUI({ title: "Menu", width: 250 });
    const debugObject = {};
    window.addEventListener("keydown", (event) => {
        if (event.key === "h") {
           if (gui._hidden) {
                gui.show();
            } else {
               gui.hide();
            }
        }
    });

    // Lights Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.castShadow = true;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Environment Map
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const environmentMapTexture = cubeTextureLoader.load([
        'https://your-path/static/textures/environmentMaps/0/px.jpg',
        'https://your-path/static/textures/environmentMaps/0/nx.jpg',
        'https://your-path/static/textures/environmentMaps/0/py.jpg',
        'https://your-path/static/textures/environmentMaps/0/ny.jpg',
        'https://your-path/static/textures/environmentMaps/0/pz.jpg',
        'https://your-path/static/textures/environmentMaps/0/nz.jpg'
    ]);
    environmentMapTexture.encoding = THREE.sRGBEncoding;
    scene.environment = environmentMapTexture;
    

    debugObject.envMapIntensity = 2.2;
    const updateAllMaterials = () => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMap = environmentMapTexture;
                child.material.envMapIntensity = debugObject.envMapIntensity;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    };
    gui.add(debugObject, "envMapIntensity").min(0).max(20).step(0.001).name("EnvironmentMap Intensity").onChange(updateAllMaterials);

    // Materials Setup
    const matcapTexture = new THREE.TextureLoader().load('https://your-path/static/textures/matcaps/7.png');
    const gradientTexture = new THREE.TextureLoader().load('https://your-path/static/textures/gradients/3.jpg');
    gradientTexture.minFilter = THREE.NearestFilter;
    gradientTexture.magFilter = THREE.NearestFilter;
    gradientTexture.generateMipmaps = false;

    const MatcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture, flatShading: true });
    const ToonMaterial = new THREE.MeshToonMaterial({ gradientMap: gradientTexture });
    const StandardMaterialEnvi = new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    });

    // Draco and GLTF Loaders
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath("https://your-path/draco/");

    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let mixer = null;
    gltfLoader.load(
        "https://your-path/static/models/scene.gltf",
        (gltf) => {
            gltf.scene.traverse((node) => {
                if (node.isMesh) {
                    node.geometry.computeBoundingBox();
                    node.material = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
                        metalness: 0.3,
                        roughness: 0.4,
                        envMap: environmentMapTexture,
                        envMapIntensity: 0.5
                    });
                    node.castShadow = true;
                    node.receiveShadow = true;
                    scene.add(node);
                }
            });
        },
        undefined,
        (error) => {
            console.error('An error occurred while loading the model:', error);
        }
    );

    // Puzzle Pieces Setup
    const createPuzzlePiece = (color) => {
        return new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshBasicMaterial({ color: color })
        );
    };
    const PuzzlePieces = [
        createPuzzlePiece('#ff0000'),
        createPuzzlePiece('#fff17f'),
        createPuzzlePiece('#0f0090'),
        createPuzzlePiece('#ffff00'),
        createPuzzlePiece('#ff00ff'),
        createPuzzlePiece('#bb1122'),
        createPuzzlePiece('#01f000')
    ];

    PuzzlePieces.forEach((piece, index) => {
        piece.scale.set(0.025, 0.025, 0.025);
        piece.castShadow = true;
        scene.add(piece);
    });

    // Animate and Render Loop
    const clock = new THREE.Clock();
    let previousTime = 0;

    function animate() {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        // Rotate Puzzle Pieces
        PuzzlePieces.forEach((piece) => {
            piece.rotation.x += 0.01;
            piece.rotation.y += 0.01;
        });

        // Update Controls
        controls.update();

        // Render the Scene
        renderer.render(scene, camera);

        // Request the next frame
        requestAnimationFrame(animate);
    }

    animate();

    // Resize Event Listener
    window.addEventListener('resize', () => {
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
    });


    // // Create a cube to test rendering
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    // // Set camera position
    // camera.position.z = 5;

    // // Animation loop
    // function animate() {
    //     requestAnimationFrame(animate);

    //     // Rotate the cube to add some interaction
    //     cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;

    //     renderer.render(scene, camera);
    // }

    // animate();

    // // Handle resizing to maintain responsive layout
    // window.addEventListener('resize', () => {
    //     const container = document.getElementById("three-container");
    //     renderer.setSize(container.clientWidth, container.clientHeight);
    //     camera.aspect = container.clientWidth / container.clientHeight;
    //     camera.updateProjectionMatrix();
    // });
});
