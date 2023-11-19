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

    var geometrySphere = new THREE.SphereGeometry( 100, 100, 100 );
    var cubeTexture = new THREE.ImageUtils.loadTexture(
        'texture/sky.jpg' );
    var materialSphere = new THREE.MeshBasicMaterial( {
        map: cubeTexture,
        transparent: true,
        side: THREE.DoubleSide} );
    sphere = new THREE.Mesh( geometrySphere, materialSphere );
    sphere.position.set(0, 0, 0);
    scene.add( sphere );
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

    // Create the material for the outer faces
    var materialOuter = new THREE.MeshBasicMaterial({
        color: 0xdddddd,
        side: THREE.DoubleSide
    });

// Create the material for the inner faces
    var materialInner = new THREE.MeshBasicMaterial({
        visible: false
    });



    // Assign UV coordinates to the geometry for proper texture mapping
    geometryPrism.faceVertexUvs[0] = [];
    geometryPrism.faceVertexUvs[0].push([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(0, 1)
    ]);

    // Create the triangular prism mesh
    var prismMesh = new THREE.Mesh(geometryPrism, [materialOuter, materialInner]);
    prismMesh.position.set(0, 0.2, 0);
    prismMesh.rotation.x = -Math.PI / 2;
    group.add(prismMesh);





    var calendar = createMonthlyCalendar(2008,1 );
    positionCalendarOnFace(calendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
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
    var geometry = new THREE.BoxGeometry(0.3, 0.3, 0.05); // Snížil jsem velikost na 0.6
    var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    var cube = new THREE.Mesh(geometry, material);

    // Create a separate material for the text
    var textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Set your desired text color

    // Create text geometry for the day number
    var textGeometry = new THREE.TextGeometry(day.toString(), {
        font: font, // Specify a font (you may need to load a font file)
        size: 0.1,           // Snížil jsem velikost textu na 0.2
        height: 0.03          // Snížil jsem tloušťku textu na 0.03
    });

    // Create a mesh with the text geometry and the separate text material
    var textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-0.05, -0.05, 0.02); // Snížil jsem pozici textu vzhledem k geometrii
    cube.add(textMesh);

    cube.position.set(x, y, z);

    return cube;
}

// Function to create a monthly calendar
// Function to create a monthly calendar with day names
// Function to create a monthly calendar with day names
// Function to create a monthly calendar with day names
// Function to create a monthly calendar with day names
function createMonthlyCalendar(year, month) {
    var calendar = new THREE.Object3D(); // Kontejner pro komponenty kalendáře

    // Výpočet počtu dnů v daném měsíci
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    // Dny v týdnu
    var daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Zjistění, který den v týdnu začíná měsíc
    var firstDayOfMonth = new Date(year, month, 0).getDay();
    console.log("firstDayOfMonth")
    console.log(firstDayOfMonth)

    // // Přeorganizování pořadí dnů v týdnu, aby pondělí bylo první
     var rearrangedDaysOfWeek = daysOfWeek.slice(0).concat(daysOfWeek.slice(0, 0));

    // Název měsíce a roku
    var monthYearText = getMonthName(month) + ' ' + year;
    var monthYearGeometry = new THREE.TextGeometry(monthYearText, {
        font: font,
        size: 0.1,
        height: 0.03
    });
    var monthYearMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    var monthYearMesh = new THREE.Mesh(monthYearGeometry, monthYearMaterial);
    monthYearMesh.position.set(0.5, 0.5, 0.05);
    calendar.add(monthYearMesh);

    // Vytvoření prvního řádku s názvy dní
    for (var col = 0; col < 7; col++) {
        var textGeometry = new THREE.TextGeometry(rearrangedDaysOfWeek[col], {
            font: font,
            size: 0.08,
            height: 0.03
        });

        var textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        var textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(col * 0.3 - 0.1, 0.3, 0.05);
        calendar.add(textMesh);
    }

    // Vytvoření druhého řádku s čísly dnů
    for (var day = 1; day <= daysInMonth; day++) {
        var row = Math.floor((day - 1 + firstDayOfMonth) / 7); // Předpokládáme 7denní týden
        var col = (day - 1 + firstDayOfMonth) % 7;

        var cube = createDayCube(col * 0.3, -row * 0.3, 0.07, day);
        calendar.add(cube);
    }
    return calendar;
}



// Funkce pro získání názvu měsíce
function getMonthName(month) {
    var months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
}







