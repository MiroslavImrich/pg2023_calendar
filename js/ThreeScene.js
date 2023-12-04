var camera, scene, renderer, controls;
var group;
var prismMesh;
var currentCalendar; // Store a reference to the current calendar
var isYearly;

// Load the font
var fontLoader = new THREE.FontLoader();
var font;

var currentMonth = getCurrentMonth();
var currentYear = getCurrentYear();

var circle1;
var circle2;

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

// Create the color picker element
var cubeColorPicker = createColorPicker('cubeColorPicker', '240px', 'Cube Color:', '#cccccc');
var cubeHollidayColorPicker = createColorPicker('cubeHollidayColorPicker', '280px', 'Cube Color Holliday:', '#ff0000');
var pyramidColorPicker = createColorPicker('pyramidColorPicker', '320px', 'Pyramid Color:', '#dddddd');
var regularDaysColorPicker = createColorPicker('regularDaysColorPicker', '40px', 'Regular Days:', '#000000');
var specialDaysColorPicker = createColorPicker('specialDaysColorPicker', '80px', 'Special Days:', '#ffffff');
var dayNamesColorPicker = createColorPicker('dayNamesColorPicker', '120px', 'Day Names:', '#000000');
var monthNamesColorPicker = createColorPicker('monthNamesColorPicker', '160px', 'Month Names:', '#000000');
var yearNumberColorPicker = createColorPicker('yearNumberColorPicker', '200px', 'Year number:', '#000000');

let cubeCol = '#cccccc';
let cubeHollidayCol = '#ff0000';
let regularDaysCol = '#000000';
let specialDaysCol = '#ffffff';
let dayNamesCol = '#000000';
let monthNamesCol = '#000000';
let yearNumberCol = '#000000';

document.body.appendChild(cubeColorPicker);
document.body.appendChild(cubeHollidayColorPicker);
document.body.appendChild(pyramidColorPicker);
document.body.appendChild(yearNumberColorPicker);
document.body.appendChild(dayNamesColorPicker);
document.body.appendChild(regularDaysColorPicker);
document.body.appendChild(specialDaysColorPicker);
document.body.appendChild(monthNamesColorPicker);


// Attach event listeners to the color pickers

cubeColorPicker.addEventListener('input', updateCubeColor);
regularDaysColorPicker.addEventListener('input', updateRegularDaysColor);
specialDaysColorPicker.addEventListener('input', updateSpecialDaysColor);
dayNamesColorPicker.addEventListener('input', updateDayNamesColor);
monthNamesColorPicker.addEventListener('input', updateMonthNamesColor);
yearNumberColorPicker.addEventListener('input', updateYearNumberColor);
cubeHollidayColorPicker.addEventListener('input', updateHollidayCubeColor);
pyramidColorPicker.addEventListener('input', updatePyramidColor);


// Function to create a color picker element
function createColorPicker(id, position, labelText, defaultColor) {
    var container = document.createElement('div');

    // Create a label element
    var label = document.createElement('label');
    label.textContent = labelText;
    label.style.position = 'absolute';
    label.style.width = '120px'; // Adjust the width as needed
    label.style.top = position;

    container.appendChild(label);

    // Create a color picker element
    var colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = id;
    colorPicker.style.position = 'absolute';
    colorPicker.style.top = position;
    colorPicker.style.left = '140px'; // Adjust the left position as needed
    colorPicker.value = defaultColor;
    container.appendChild(colorPicker);

    document.body.appendChild(container);

    return colorPicker;
}

function updatePyramidColor() {
    var newColor = pyramidColorPicker.value;

    // Aktualizujte farbu vonkajšieho materiálu prizmy
    prismMesh.material[0].color.set(colorToThreeJSColor(newColor));
}

function updateCubeColor() {
    var newColor = cubeColorPicker.value;
    var isRegularDay = false;
    console.log("zacinam");
    cubeCol = newColor;

    // Update the color of the cube in the calendar
    group.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            if (child.userData.isCube) {
                var day = child.userData.day;
                var month = child.userData.month;
                var dayOfWeek = child.userData.dayOfWeek;
                if (!(isHoliday(day, month) || dayOfWeek === 0)) {
                    console.log("som tu")
                    child.material.color.set(colorToThreeJSColor(newColor));
                }
            }
        }
    });
}

function updateHollidayCubeColor() {
    var newColor = cubeHollidayColorPicker.value;
    var isRegularDay = false;
    console.log("zacinam");
    cubeHollidayCol = newColor;

    // Update the color of the cube in the calendar
    group.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            if (child.userData.isCube) {
                var day = child.userData.day;
                var month = child.userData.month;
                var dayOfWeek = child.userData.dayOfWeek;
                if (isHoliday(day, month) || dayOfWeek === 0) {
                    console.log("som tu")
                    child.material.color.set(colorToThreeJSColor(newColor));
                }
            }
        }
    });
}

function updateDayNamesColor() {
    var newColor = dayNamesColorPicker.value;
    dayNamesCol = newColor;

    // Update the color of day names in the calendar
    group.traverse(function (child) {
        if (child instanceof THREE.Mesh && child.userData.isDayName) {
            child.material.color.set(colorToThreeJSColor(newColor));
        }
    });
}
function updateYearNumberColor() {
    var newColor = yearNumberColorPicker.value;
    yearNumberCol = newColor;

    // Update the color of the year number in the calendar
    group.traverse(function (child) {
        if (child instanceof THREE.Mesh && child.userData.isYearNumber) {
            child.material.color.set(colorToThreeJSColor(newColor));
        }
    });
}
function updateMonthNamesColor() {
    var newColor = monthNamesColorPicker.value;
    monthNamesCol = newColor;

    // Update the color of month names in the calendar
    group.traverse(function (child) {
        if (child instanceof THREE.Mesh && child.userData.isMonthName) {
            child.material.color.set(colorToThreeJSColor(newColor));
        }
    });
}

// Function to update text color based on the main color picker value
function updateTextColor() {
    updateColorForDays(mainColorPicker, false, false, true);

}
function updateRegularDaysColor() {
    updateColorForDays(regularDaysColorPicker, false, false, true);
}

// Function to update text color based on the special days color picker value
function updateSpecialDaysColor() {
    updateColorForDays(specialDaysColorPicker, true, true);
}

// Function to update text color based on the specified color picker value
function updateColorForDays(colorPicker, includeHolidays = false, includeSundays = false, includeRegularDays = false) {
    var newColor = colorPicker.value;
    if(includeHolidays === true){
        specialDaysCol = newColor;
    }
    if(includeHolidays === false && includeSundays === false){
        regularDaysCol = newColor;
    }


    // Update the color of existing text meshes for selected days
    group.traverse(function (child) {
        if (child instanceof THREE.Mesh && child.userData.isText) {
            var day = child.userData.day;
            var month = child.userData.month;
            var dayOfWeek = child.userData.dayOfWeek;

            if ((includeHolidays && isHoliday(day, month)) || (includeSundays && dayOfWeek === 0) || (includeRegularDays && !isHoliday(day, month) && dayOfWeek !== 0)) {
                child.material.color.set(colorToThreeJSColor(newColor));
            }
        }
    });
}



// Function to update text color based on the color picker value
// Add a variable to store the current text color
var textColor = '#000000';

// Function to update text color based on the color picker value
// Function to update text color based on the color picker value



// Convert hex color to Three.js color format
function colorToThreeJSColor(hexColor) {
    var color = new THREE.Color();
    color.set(hexColor);
    return color;
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
    prismMesh = new THREE.Mesh(geometryPrism, [materialOuter, materialInner]);
    prismMesh.position.set(0, 0.2, 0);
    prismMesh.rotation.x = -Math.PI / 2;
    group.add(prismMesh);

    currentCalendar = createYearlyCalendar(currentYear);
    positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    group.add(currentCalendar);

    // Add the group to the scene
    scene.add(group);

    // Append the cube color picker to the document body
    document.body.appendChild(cubeColorPicker);

    // Attach event listener to the cube color picker
    cubeColorPicker.addEventListener('input', updateCubeColor);
}

function getCurrentYear() {
    var currentDate = new Date();
    return currentDate.getFullYear();
}

function getCurrentMonth() {
    var currentDate = new Date();
    return currentDate.getMonth();
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

function getDayOfYear(month, day) {
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var dayOfYear = 0;
    console.log(month+1);
    for (var i = 0; i <= month; i++) {
        dayOfYear += daysInMonth[i];
    }

    dayOfYear += day;

    return dayOfYear;
}

function getSlovakName(day, month) {
    return [
        "Novy rok","Alexandra","Daniela","Drahoslav","Andrea","Antonia","Bohuslava","Severin","Alexej","Dasa",
        "Malvina","Ernest","Rastislav","Radovan","Dobroslav","Kristina","Natalia","Bohdana","Drahomira",
        "Dalibor","Vincent","Zora","Milos","Timotej","Gejza","Tamara","Bohus","Alfonz","Gaspar","Ema",
        "Emil","Tatiana","Erika, Erik","Blazej","Veronika","Agata","Dorota","Vanda","Zoja","Zdenko","Gabriela",
        "Dezider","Perla","Arpad","Valentin","Pravoslav","Ida, Liana","Miloslava","Jaromir","Vlasta","Livia",
        "Eleonora","Etela","Roman","Matej","Frederik","Viktor","Alexander","Zlatica","Albin",
        "Anezka","Bohumil","Kazimir","Fridrich","Radoslav","Tomas","Alan, Alana",
        "Frantiska","Branislav","Angela","Gregor","Vlastimil","Matilda","Svetlana","Boleslav",
        "Lubica","Eduard","Jozef","Vitazoslav","Blahoslav","Benadik","Adrian","Gabriel","Marian",
        "Emanuel","Alena","Sona","Miroslav","Vieroslava","Benjamin","Hugo","Zita","Richard","Izidor","Miroslava",
        "Irena","Zoltan","Albert","Milena","Igor","Julius","Estera","Ales","Justina","Fedor","Dana, Danica",
        "Rudolf, Rudolfa","Valer","Jela","Marcel","Ervin","Slavomir","Vojtech","Juraj","Marek","Jaroslava",
        "Jaroslav","Jarmila","Lea","Anastazia","","Zigmund","Galina, Timea","Florian","Lesia, Lesana","Hermina",
        "Monika","Ingrida","Roland","Viktória","Blazena","Pankrac","Servac","Bonifac","Zofia, Sofia","Svetozar",
        "Gizela","Viola","Gertruda","Bernard","Zina","Julia, Juliana","Zelmira","Ela","Urban","Dusan",
        "Iveta","Viliam","Vilma","Ferdinand","Petrana","Zaneta","Xenia","Karolina","Lenka",
        "Laura","Norbert","Robert","Medard","Stanislava","Margareta","Dobroslava","Zlatko",
        "Anton","Vasil","Vit","Blanka","Adolf","Vratislav","Alfred","Valeria","Alojz","Paulina",
        "Sidónia","Jan","Olivia","Adriana","Ladislav","Beata","Peter,Pavol","Melania",
        "Diana","Berta","Miloslav","Prokop","Cyril, Metod","Patrik","Oliver","Ivan","Lujza","Amalia",
        "Milota","Nina","Margita","Kamil","Henrich","Drahomir, Rut","Bohuslav","Kamila","Dusana","Ilja",
        "Daniel","Magdalena","Olga","Vladimir","Jakub, Timur","Anna, Hana","Bozena","Kristof",
        "Marta","Libusa","Ignac","Bozidara","Gustav","Jergus","Dominika","Hortenzia","Jozefina",
        "Stefania","Oskar","Lubomira","Vavrinec","Zuzana","Darina","Lubomir","Mojmir","Marcela","Leonard",
        "Milica","Helena","Lýdia","Anabela, Liliana","Jana","Tichomir","Filip","Bartolomej","Ludovit","Samuel","Silvia","Augustin","Nikola",
        "Ruzena","Nora","Drahoslava","Linda","Belo","Rozalia","Regina","Alica","Marianna","Miriama","Martina","Oleg","Bystrik","Maria","Ctibor","Ludomil","Jolana",
        "Ludmila","Olympia","Eugenia","Konstantin","Luboslav","Matus","Moric","Zdenka","Lubos",
        "Vladislav","Edita","Cyprian","Vaclav","Michal","Jarolim","Arnold","Levoslav","Stela",
        "František","Viera","Natalia","Eliška","Brigita","Dionyz","Slavomira","Valentina","Maximilian","Koloman",
        "Boris","Terezia","Vladimira","Hedviga","Lukas","Kristian","Vendelin","Ursula","Sergej","Alojzia",
        "Kvetoslava","Aurel","Demeter","Sabina","Dobromila","Klara","Simon, Simona","Aurelia","Denis","",
        "Hubert","Karol","Imrich","Renata","Rene","Bohumir","Teodor","Tibor","Martin, Maros","Svatopluk","Stanislav",
        "Irma","Leopold","Agnesa","Klaudia","Eugen","Alžbeta","Felix","Elvira","Cecilia","Klement","Emilia","Katarina",
        "Kornel","Milan","Henrieta","Vratko","Ondrej","Edmund","Bibiana","Oldrich","Barbora","Oto",
        "Mikulas","Ambroz","Marina","Izabela","Raduz","Hilda","Otilia","Lucia","Branislava","Ivica",
        "Albina","Kornelia","Slava","Judita","Dagmara","Bohdan","Adela","Nadezda","Adam, Eva","","Stefan","Filomena",
        "Ivana","Milada","David","Silvester"
    ][getDayOfYear(month-1,day-1)] || "";
}

function createDayCube(x, y, z, day, month, dayOfWeek, year) {
    var cubeColor = cubeCol;

    if (dayOfWeek === 0 || isHoliday(day, month) || (day === 2 && month === 1 && year === 2024)) {
        cubeColor = cubeHollidayCol;
    }

    // Vytvořte samostatný materiál pro text
    var textColor = (dayOfWeek === 0 || isHoliday(day, month) || (day === 2 && month === 1 && year === 2024)) ? specialDaysCol : regularDaysCol;

    // Create a separate material for the text
    var textMaterial = new THREE.MeshBasicMaterial({ color: textColor });

    // Create text geometry for the day number
    var textGeometry;
    if (day >= 10) {
        // For two-digit days
        textGeometry = new THREE.TextGeometry(day.toString(), {
            font: font,
            size: 0.1,
            height: 0.02
        });
    } else {
        // For single-digit days
        textGeometry = new THREE.TextGeometry(day.toString(), {
            font: font,
            size: 0.1,
            height: 0.02
        });
    }

    var textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Set position based on the number of digits
    if (day >= 10) {
        textMesh.position.set(-0.07, -0.05, 0.02); // For two-digit days
    } else {
        textMesh.position.set(-0.05, -0.05, 0.02); // For single-digit days
    }
    var name = getSlovakName(day, month);
    // Create text geometry for the name
    if(day === 29 && month === 1){
        name = '';
    }

    console.log(name);
    var nameGeometry = new THREE.TextGeometry(name, {
        font: font,
        size: 0.03,
        height: 0.01
    });

    var nameMesh = new THREE.Mesh(nameGeometry, textMaterial);
    nameMesh.position.set(-0.07, -0.13, 0.02); // Center text

    var material = new THREE.MeshBasicMaterial({ color: cubeColor });
    var cube = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.05), material);

    cube.add(textMesh);
    cube.add(nameMesh); // Add the name mesh to the cube
    cube.position.set(x, y, z);

    // Set userData properties
    textMesh.userData.isText = true;
    cube.userData.isCube = true;
    cube.userData.day = day;
    cube.userData.month = month;
    cube.userData.dayOfWeek = dayOfWeek;
    cube.userData.name = name; // Add name to cube userData
    textMesh.userData.day = day;
    textMesh.userData.month = month;
    textMesh.userData.dayOfWeek = dayOfWeek;

    // Set the initial text color
    textMesh.material.color.set(colorToThreeJSColor(textColor));

    return cube;
}





function createDayCubeYearly(x, y, z, day, month, dayOfWeek, year) {
    var cubeColor = cubeCol;

    if (dayOfWeek === 0 || isHoliday(day, month) || isHoliday(day, month) || (day === 2 && month === 1 && year === 2024)) {
        cubeColor = cubeHollidayCol;
    }

    // Vytvořte samostatný materiál pro text
    var textColor = (dayOfWeek === 0 || isHoliday(day, month) || (day === 2 && month === 1 && year === 2024)) ? specialDaysCol : regularDaysCol;

    // Create a separate material for the text
    var textMaterial = new THREE.MeshBasicMaterial({ color: textColor });

    // Create text geometry for the day number
    var textGeometry = new THREE.TextGeometry(day.toString(), {
        font: font,
        size: 0.03,
        height: 0.01
    });

    var textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-0.01, -0.01, 0.02);

    var material = new THREE.MeshBasicMaterial({ color: cubeColor });
    var cube = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.105, 0.05), material);

    cube.add(textMesh);
    cube.position.set(x, y, z);

    // Set userData properties
    textMesh.userData.isText = true;
    cube.userData.isCube = true;
    cube.userData.day = day;
    cube.userData.month = month;
    cube.userData.dayOfWeek = dayOfWeek;
    textMesh.userData.day = day;
    textMesh.userData.month = month;
    textMesh.userData.dayOfWeek = dayOfWeek;

    // Set the initial text color
    textMesh.material.color.set(colorToThreeJSColor(textColor));

    return cube;
}


// Function to create a monthly calendar with day names
function createMonthlyCalendar(year, month, isYearlyObject) {
    var calendar = new THREE.Object3D();

    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    var firstDayOfMonth = new Date(year, month, 0).getDay();

    var rearrangedDaysOfWeek = daysOfWeek.slice(0).concat(daysOfWeek.slice(0, 0));

    var monthYearText;
    var monthYearGeometry;
    var monthYearMaterial = new THREE.MeshBasicMaterial({ color: monthNamesCol });
    var monthYearMesh;

    if( isYearlyObject ) {
        monthYearText = getMonthName(month);
        monthYearGeometry = new THREE.TextGeometry(monthYearText, {
            font: font,
            size: 0.06,
            height: 0.015
        });
        monthYearMesh = new THREE.Mesh(monthYearGeometry, monthYearMaterial);
        monthYearMesh.position.set(0.2, 0.45, 0.08);
    }
    else {
        monthYearText = getMonthName(month) + ' ' + year;
        monthYearGeometry = new THREE.TextGeometry(monthYearText, {
            font: font,
            size: 0.1,
            height: 0.03
        });
        monthYearMesh = new THREE.Mesh(monthYearGeometry, monthYearMaterial);
        monthYearMesh.position.set(0.5, 0.5, 0.05);
    }
    monthYearMesh.userData.isMonthName = true;
    calendar.add(monthYearMesh);


    for (var col = 0; col < 7; col++) {
        if( isYearlyObject ) {
            var textGeometry = new THREE.TextGeometry(rearrangedDaysOfWeek[col], {
                font: font,
                size: 0.03,
                height: 0.01
            });

            var textMaterial = new THREE.MeshBasicMaterial({ color:dayNamesCol });
            var textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(col * 0.11, 0.3, 0.08);
            textMesh.userData.isDayName = true;

            calendar.add(textMesh);
        }
        else {
            var textGeometry = new THREE.TextGeometry(rearrangedDaysOfWeek[col], {
                font: font,
                size: 0.08,
                height: 0.03
            });

            var textMaterial = new THREE.MeshBasicMaterial({ color: dayNamesCol });
            var textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(col * 0.3 - 0.1, 0.3, 0.05);
            textMesh.userData.isDayName = true;
            calendar.add(textMesh);
        }

    }

    for (var day = 1; day <= daysInMonth; day++) {
        var row = Math.floor((day - 1 + firstDayOfMonth) / 7);
        var col = (day - 1 + firstDayOfMonth) % 7;
        var cube;
        var yearlyShiftX = 0.06
        var yearlyShiftY = 0.15
        if( isYearlyObject ) {
            cube = createDayCubeYearly(yearlyShiftX + (col * 0.105), yearlyShiftY + (-row * 0.105), 0.11, day,month,(day + firstDayOfMonth) % 7, year);
        }
        else {
            cube = createDayCube(col * 0.3, -row * 0.3, 0.07, day,month,(day + firstDayOfMonth) % 7, year);
        }
        calendar.add(cube);
    }

    if(!isYearlyObject){
        circle1 = createClickableCircle(1,isYearlyObject);
        circle2 = createClickableCircle(0,isYearlyObject);
    }
    return calendar;
}

function isHoliday(day, month) {
    const holidays = {
        0: [1, 6],
        4: [1, 8],
        6: [5],
        7: [29],
        8: [1, 15],
        10: [1, 17],
        11: [24, 25, 26]
    };
    return holidays[month] && holidays[month].includes(day);
}

// Function to create a monthly calendar with day names
// Function to create a yearly calendar with monthly calendars
function createYearlyCalendar(year) {
    var yearlyCalendar = new THREE.Object3D();

    var calendarsInRow = 4;
    var calendarSpacing = 0.2; // Adjust the spacing between calendars as needed

    for (var month = 0; month < 12; month++) {
        var calendar = createMonthlyCalendar(year, month, true);

        // Adjust the scale of each monthly calendar
        calendar.scale.set(0.5, 0.5, 0.5); // Adjust the scale factor as needed

        // Calculate the row and column for each calendar
        var row = Math.floor(month / calendarsInRow);
        var col = month % calendarsInRow;

        // Adjust the position to arrange calendars in a grid
        calendar.position.set(col * (calendarSpacing + 0.25), -row * (calendarSpacing + 0.4), 0);

        yearlyCalendar.add(calendar);
    }

    var yearText = year.toString();
    var yearGeometry;
    var yearMaterial = new THREE.MeshBasicMaterial({ color: yearNumberCol });
    var yearMesh;

    yearGeometry = new THREE.TextGeometry(yearText, {
        font: font,
        size: 0.06,
        height: 0.015
    });
    yearMesh = new THREE.Mesh(yearGeometry, yearMaterial);
    yearMesh.position.set(0.75, 0.45, 0.04);
    yearMesh.userData.isYearNumber = true;
    yearlyCalendar.add(yearMesh);
    circle1 = createClickableCircle(1,true);
    circle2 = createClickableCircle(0,true);



    return yearlyCalendar;
}

function getMonthName(month) {
    var months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
}

// Create an array to store the created balls
var balls = [];

// Set up raycasting for mouse picking
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Register global click event listener
window.addEventListener('click', function () {
    // Perform raycasting on click
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(balls, true);

    if (intersects.length > 0) {
        var ball = intersects[0].object;
        if (ball.userData.isClickEnabled) {
            ball.userData.isClickEnabled = false;
            setTimeout(function () {
                ball.userData.isClickEnabled = true;
            }, 500); // Set a timeout in milliseconds to control the click rate
            // Trigger the click event for the ball
            ball.dispatchEvent({ type: 'click' });
        }
    }
});

// Global mouse move event listener
window.addEventListener('mousemove', function (event) {
    // Update the mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Perform raycasting on mouse move
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(balls, true);

    // Change cursor style on mouse over
    if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
    } else {
        renderer.domElement.style.cursor = 'auto';
    }
});

function createClickableCircle(direction,isYearly) {
    // Create a parent container
    var container = new THREE.Object3D();

    var circleGeometry = new THREE.CircleGeometry(0.10, 32);
    var circleMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    var circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    // Rotate the circle by 90 degrees

    circleMesh.rotation.set(Math.PI / 2, -Math.PI / 3, 0);



    // Set up event listeners for each ball
    circleMesh.userData = {
        isClickEnabled: true,
        onClick: function () {
            if(isYearly){
                if (direction === 1) changeYear(1);
                else if (direction === 0) changeYear(-1);
            }
            else{
                if (direction === 1) changeMonth(1);
                else if (direction === 0) changeMonth(-1);
            }
        }
    };

    // Add event listeners for mouse events
    circleMesh.addEventListener('click', function () {
        if (circleMesh.userData.onClick) {
            circleMesh.userData.onClick();
        }
    });

    container.add(circleMesh);

    // Create an arrow helper (pointing to the right in this case)
    function createArrowMesh(direction) {
        // Vytvořte materiál pro šipku s texturou
        var arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

        // Vytvořte textovou geometrii pro šipku
        var arrowGeometry = new THREE.TextGeometry(direction, {
            font: font,
            size: 0.1,
            height: 0.0
        });

        // Vytvořte mesh pro šipku s použitím textové geometrie a materiálu
        var arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);

        return arrowMesh;
    }

// Vytvořte šipky
    var leftArrow = createArrowMesh("<");
    var rightArrow = createArrowMesh(">");

// Nastavte rotaci a pozici pro šipky
    leftArrow.rotation.set(Math.PI / 2, -Math.PI / 3, Math.PI / 2); // Přizpůsobte hodnoty podle potřeby
    leftArrow.position.set(0.67, 0.47, -1.35); // Přizpůsobte hodnoty podle potřeby

    rightArrow.rotation.set(Math.PI / 2, -Math.PI / 3, Math.PI / 2); // Přizpůsobte hodnoty podle potřeby
    rightArrow.position.set(0.67, 0.47, 1.27); // Přizpůsobte hodnoty podle potřeby

// Přidejte meshy do scény
    scene.add(leftArrow);
    scene.add(rightArrow);

    // Move the container to a new position

    if (direction === 1) container.position.set(0.65, 0.5, -1.3);
    else if (direction === 0) container.position.set(0.65, 0.5, 1.3);

    scene.add(container);

    // Add the ball to the array
    balls.push(circleMesh);
    return container;
}

// Create a button element
var toggleViewButton = document.createElement('button');
toggleViewButton.textContent = 'Monthly calendar';
toggleViewButton.style.position = 'absolute';
toggleViewButton.style.top = '10px';
toggleViewButton.style.left = '10px';
toggleViewButton.style.width = '10rem';

// Append the button to the document body
document.body.appendChild(toggleViewButton);

// Register a click event listener for the button
var debounceTimeout;
toggleViewButton.addEventListener('click', function () {
    if (!debounceTimeout) {
        toggleCalendarView();
        if(toggleViewButton.textContent === 'Monthly calendar'){
            toggleViewButton.textContent = 'Yearly calendar';
        }else {
            toggleViewButton.textContent = 'Monthly calendar';
        }

        debounceTimeout = setTimeout(function () {
            debounceTimeout = null;
        }, 1000); // Set the timeout duration (in milliseconds)
    }
});

// Initialize isYearly property for the initial calendar
isYearly = false;

// Function to toggle between monthly and yearly views

function toggleCalendarView() {
    // Remove the existing calendar from the group
    group.remove(currentCalendar);
    balls = [];
    scene.remove(circle1);
    scene.remove(circle2);

    if (!isYearly) {
        // Toggle to monthly view
        currentCalendar = createMonthlyCalendar(currentYear, currentMonth, false);
        positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    } else {
        // Toggle to yearly view
        currentCalendar = createYearlyCalendar(currentYear);
        positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    }
    isYearly = !isYearly;
    group.add(currentCalendar); // Add the new calendar to the group
}


function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear = currentYear - 1;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear = currentYear + 1;
    }

    // Remove the existing calendar from the group
    // group.remove(scene.getObjectByName("calendar_" + currentMonth));
    group.remove(currentCalendar);

    // Create and add the new calendar for the updated month
    var newCalendar = createMonthlyCalendar(currentYear, currentMonth, false);
    positionCalendarOnFace(newCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    newCalendar.name = "calendar_" + currentMonth;
    group.add(newCalendar); // Add the new calendar to the group
    currentCalendar = newCalendar; // Update the reference to the current calendar
}

function changeYear(delta) {
    currentYear += delta;
    // Remove the existing calendar from the group
    // group.remove(scene.getObjectByName("calendar_" + currentMonth));
    group.remove(currentCalendar);
    // Create and add the new calendar for the updated month
    var newCalendar = createYearlyCalendar(currentYear);
    positionCalendarOnFace(newCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    newCalendar.name = "calendar_" + currentMonth;
    group.add(newCalendar); // Add the new calendar to the group
    currentCalendar = newCalendar; // Update the reference to the current calendar
}

// Create a button element
var screenshotButton = document.createElement('button');
screenshotButton.textContent = 'Take Screenshot';
screenshotButton.style.position = 'absolute';
screenshotButton.style.top = '10px';
screenshotButton.style.left = '11rem';
screenshotButton.style.width = '10rem';

// Append the button to the document body
document.body.appendChild(screenshotButton);

// Register a click event listener for the button
screenshotButton.addEventListener('click', function () {
    takeScreenshot();
});

async function takeScreenshot() {
    // Create a canvas element to render the screenshot
    var screenshotCanvas = document.createElement('canvas');
    var width = window.innerWidth;
    var height = window.innerHeight;

    // Set the canvas size to match the window size
    screenshotCanvas.width = width;
    screenshotCanvas.height = height;

    // Get the rendering context
    var context = screenshotCanvas.getContext('2d');

    // Render the current scene to the canvas
    renderer.render(scene, camera);

    // Copy the rendered image from the WebGL renderer to the canvas
    context.drawImage(renderer.domElement, 0, 0, width, height);

    // Convert the canvas content to a Blob representing a PNG image
    screenshotCanvas.toBlob(async function (blob) {
        // Use showSaveFilePicker if available
        if ('showSaveFilePicker' in window) {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'screenshot.png',
                types: [{
                    description: 'PNG Files',
                    accept: {
                        'image/png': ['.png'],
                    },
                }],
            });

            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        } else {
            // If showSaveFilePicker is not available, fallback to traditional download
            var dataURL = URL.createObjectURL(blob);

            // Create a download link for the screenshot
            var downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = 'screenshot.png';

            // Trigger a click event on the download link to prompt the user to save the screenshot
            downloadLink.click();
        }
    }, 'image/png');
}