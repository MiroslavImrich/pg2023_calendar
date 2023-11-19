var camera, scene, renderer, controls;
var group;

// Load the font
var fontLoader = new THREE.FontLoader();
var font;

// The path should point to the location of helvetiker_regular.typeface.json in your project
fontLoader.load('./js/font/helvetiker_regular.typeface.json', function (loadedFont) {
    font = loadedFont;

    // Call the initialization function after the font is loaded
    init();
    render();
});


function init() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(5, 5, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    addObjects();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    camera.lookAt(scene.position);
    controls.update();
}

function addObjects() {
    group = new THREE.Group();

    // Create the triangular prism geometry
    var geometryPrism = new THREE.CylinderGeometry(1.4, 1.4, 3, 3);

    // Create the material for the prism
    var materialPrism = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        // Adjust the opacity as needed
    });

    // Assign UV coordinates to the geometry for proper texture mapping
    geometryPrism.faceVertexUvs[0] = [];
    geometryPrism.faceVertexUvs[0].push([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(0, 1)
    ]);

    // Create the triangular prism mesh
    var prismMesh = new THREE.Mesh(geometryPrism, materialPrism);
    prismMesh.position.set(0, 0.2, 0);
    prismMesh.rotation.x = -Math.PI / 2;
    group.add(prismMesh);

    // Add calendar to the slanted face of the prism
    // Add calendar to the slanted face of the prism

    var calendar = createMonthlyCalendar(2023, 2);
    positionCalendarOnFace(calendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.3, 0.8, -0.62);
    group.add(calendar);



    // Add the group to the scene
    scene.add(group);
}

function positionCalendarOnFace(calendar, prism, rotationY, rotationX, distanceFromCenterX, distanceFromCenterY, distanceFromCenterZ) {
    var faceCenter = new THREE.Vector3(distanceFromCenterX, 0.2 + distanceFromCenterY, 1.5 + distanceFromCenterZ); // Upravte hodnoty podle potřeby
    var quaternionY = new THREE.Quaternion();
    quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    var quaternionX = new THREE.Quaternion();
    quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rotationX);
    calendar.setRotationFromQuaternion(quaternionY.multiply(quaternionX));
    calendar.position.copy(faceCenter);
}



// Function to create a cube representing a day with text
function createDayCube(x, y, z, day) {
    var geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3); // Snížil jsem velikost na 0.6
    var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    var cube = new THREE.Mesh(geometry, material);

    // Create a separate material for the text
    var textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Set your desired text color

    // Create text geometry for the day number
    var textGeometry = new THREE.TextGeometry(day.toString(), {
        font: font, // Specify a font (you may need to load a font file)
        size: 0.1,           // Snížil jsem velikost textu na 0.2
        height: 0.03          // Snížil jsem tloušťku textu na 0.03
    });

    // Create a mesh with the text geometry and the separate text material
    var textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-0.05, -0.05, 0.15); // Snížil jsem pozici textu vzhledem k geometrii
    cube.add(textMesh);

    cube.position.set(x, y, z);

    return cube;
}

// Function to create a monthly calendar
function createMonthlyCalendar(year, month) {
    var calendar = new THREE.Object3D(); // Container for calendar components

    // Calculate the number of days in the given month
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create cubes representing each day with text
    for (var day = 1; day <= daysInMonth; day++) {
        var row = Math.floor((day - 1) / 7); // Assuming a 7-day week
        var col = (day - 1) % 7;

        var cube = createDayCube(col * 0.3, -row * 0.3, 0, day); // Snížil jsem vzdálenosti mezi kostkami na 0.8
        calendar.add(cube);
    }

    return calendar;
}



