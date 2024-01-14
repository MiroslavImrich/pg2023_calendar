var camera, scene, renderer, controls;
var group;
var prismMesh;
var currentCalendar;
var isYearly;
var fontLoader = new THREE.FontLoader();
var font;
var light;
var material = 'basic';

var calendarType = 'yearly';
var currentMonth = getCurrentMonth();
var currentYear = getCurrentYear();
var currentDay = getCurrentDay();
var currentWeek=getWeekNumber(new Date());

var circle1;
var circle2;

fontLoader.load('./js/font/droid_sans_regular.typeface.json', function (loadedFont) {
    font = loadedFont;

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

var cubeColorPicker = createColorPicker('cubeColorPicker', '270px', 'Cube Color:', '#cccccc');
var cubeHollidayColorPicker = createColorPicker('cubeHollidayColorPicker', '310px', 'Cube Color Holliday:', '#ff0000');
var pyramidColorPicker = createColorPicker('pyramidColorPicker', '350px', 'Pyramid Color:', '#dddddd');
var regularDaysColorPicker = createColorPicker('regularDaysColorPicker', '70px', 'Regular Days:', '#000000');
var specialDaysColorPicker = createColorPicker('specialDaysColorPicker', '110px', 'Special Days:', '#ffffff');
var dayNamesColorPicker = createColorPicker('dayNamesColorPicker', '150px', 'Day Names:', '#000000');
var monthNamesColorPicker = createColorPicker('monthNamesColorPicker', '190px', 'Month Names:', '#000000');
var yearNumberColorPicker = createColorPicker('yearNumberColorPicker', '230px', 'Year number:', '#000000');

let cubeCol = '#cccccc';
let cubeHollidayCol = '#ff0000';
let regularDaysCol = '#000000';
let specialDaysCol = '#ffffff';
let dayNamesCol = '#000000';
let monthNamesCol = '#000000';
let yearNumberCol = '#000000';
let pyramidCol = '#dddddd';

document.body.appendChild(cubeColorPicker);
document.body.appendChild(cubeHollidayColorPicker);
document.body.appendChild(pyramidColorPicker);
document.body.appendChild(yearNumberColorPicker);
document.body.appendChild(dayNamesColorPicker);
document.body.appendChild(regularDaysColorPicker);
document.body.appendChild(specialDaysColorPicker);
document.body.appendChild(monthNamesColorPicker);

cubeColorPicker.addEventListener('input', updateCubeColor);
regularDaysColorPicker.addEventListener('input', updateRegularDaysColor);
specialDaysColorPicker.addEventListener('input', updateSpecialDaysColor);
dayNamesColorPicker.addEventListener('input', updateDayNamesColor);
monthNamesColorPicker.addEventListener('input', updateMonthNamesColor);
yearNumberColorPicker.addEventListener('input', updateYearNumberColor);
cubeHollidayColorPicker.addEventListener('input', updateHollidayCubeColor);
pyramidColorPicker.addEventListener('input', updatePyramidColor);


function createColorPicker(id, position, labelText, defaultColor) {
    var container = document.createElement('div');

    var label = document.createElement('label');
    label.textContent = labelText;
    label.style.position = 'absolute';
    label.style.width = '120px';
    label.style.top = position;

    container.appendChild(label);

    var colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = id;
    colorPicker.style.position = 'absolute';
    colorPicker.style.top = position;
    colorPicker.style.left = '140px';
    colorPicker.value = defaultColor;
    container.appendChild(colorPicker);

    document.body.appendChild(container);

    return colorPicker;
}

function updatePyramidColor() {
    var newColor = pyramidColorPicker.value;
    pyramidCol = newColor;

    prismMesh.material[0].color.set(colorToThreeJSColor(newColor));
}

function updateCubeColor() {
    var newColor = cubeColorPicker.value;
    var isRegularDay = false;
    cubeCol = newColor;

    group.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            if (child.userData.isCube) {
                var day = child.userData.day;
                var month = child.userData.month;
                var dayOfWeek = child.userData.dayOfWeek;
                if (!(isHoliday(day, month) || dayOfWeek === 0)) {
                    child.material.color.set(colorToThreeJSColor(newColor));
                }
            }
        }
    });
}

function updateHollidayCubeColor() {
    var newColor = cubeHollidayColorPicker.value;
    var isRegularDay = false;
    cubeHollidayCol = newColor;

    group.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            if (child.userData.isCube) {
                var day = child.userData.day;
                var month = child.userData.month;
                var dayOfWeek = child.userData.dayOfWeek;
                if (isHoliday(day, month) || dayOfWeek === 0) {
                    child.material.color.set(colorToThreeJSColor(newColor));
                }
            }
        }
    });
}

function updateDayNamesColor() {
    var newColor = dayNamesColorPicker.value;
    dayNamesCol = newColor;

    group.traverse(function (child) {
        if (child instanceof THREE.Mesh && child.userData.isDayName) {
            child.material.color.set(colorToThreeJSColor(newColor));
        }
    });
}
function updateYearNumberColor() {
    var newColor = yearNumberColorPicker.value;
    yearNumberCol = newColor;

    group.traverse(function (child) {
        if (child instanceof THREE.Mesh && child.userData.isYearNumber) {
            child.material.color.set(colorToThreeJSColor(newColor));
        }
    });
}
function updateMonthNamesColor() {
    var newColor = monthNamesColorPicker.value;
    monthNamesCol = newColor;

    group.traverse(function (child) {
        if (child instanceof THREE.Mesh && child.userData.isMonthName) {
            child.material.color.set(colorToThreeJSColor(newColor));
        }
    });
}

function updateTextColor() {
    updateColorForDays(mainColorPicker, false, false, true);

}
function updateRegularDaysColor() {
    updateColorForDays(regularDaysColorPicker, false, false, true);
}

function updateSpecialDaysColor() {
    updateColorForDays(specialDaysColorPicker, true, true);
}

function updateColorForDays(colorPicker, includeHolidays = false, includeSundays = false, includeRegularDays = false) {
    var newColor = colorPicker.value;
    if(includeHolidays === true){
        specialDaysCol = newColor;
    }
    if(includeHolidays === false && includeSundays === false){
        regularDaysCol = newColor;
    }

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

    var geometryPrism = new THREE.CylinderGeometry(1.4, 1.4, 3, 3);

    var materialOuter = new THREE.MeshBasicMaterial({
        color: pyramidCol,
        side: THREE.DoubleSide
    });

    var materialInner = new THREE.MeshBasicMaterial({
        visible: false
    });

    geometryPrism.faceVertexUvs[0] = [];
    geometryPrism.faceVertexUvs[0].push([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(0, 1)
    ]);

    prismMesh = new THREE.Mesh(geometryPrism, [materialOuter, materialInner]);
    prismMesh.position.set(0, 0.2, 0);
    prismMesh.rotation.x = -Math.PI / 2;
    group.add(prismMesh);

    currentCalendar = createYearlyCalendar(currentYear);
    positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    group.add(currentCalendar);

    scene.add(group);
    document.body.appendChild(cubeColorPicker);
    cubeColorPicker.addEventListener('input', updateCubeColor);
}
function getCurrentDay() {
    var currentDate = new Date();
    return currentDate.getDate();
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
    var faceCenter = new THREE.Vector3(distanceFromCenterX, 0.2 + distanceFromCenterY, 1.5 + distanceFromCenterZ);
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
    for (var i = 0; i <= month; i++) {
        dayOfYear += daysInMonth[i];
    }

    dayOfYear += day;

    return dayOfYear;
}

function getSlovakName(day, month) {
    return [
        "Nový rok","Alexandra","Daniela","Drahoslav","Andrea","Antónia","Bohuslava","Severín","Alexej","Dáša",
        "Malvína","Ernest","Rastislav","Radovan","Dobroslav","Kristína","Natália","Bohdana","Drahomíra",
        "Dalibor","Vincent","Zora","Miloš","Timotej","Gejza","Tamara","Bohuš","Alfonz","Gašpar","Ema",
        "Emil","Tatiana","Erika, Erik","Blažej","Veronika","Agáta","Dorota","Vanda","Zoja","Zdenko","Gabriela",
        "Dezider","Perla","Arpád","Valentín","Pravoslav","Ida, Liana","Miloslava","Jaromír","Vlasta","Lívia",
        "Eleonóra","Etela","Roman","Matej","Frederik","Viktor","Alexander","Zlatica","Albín",
        "Anežka","Bohumil","Kazimír","Fridrich","Radoslav","Tomáš","Alan, Alana",
        "Františka","Branislav","Angela","Gregor","Vlastimil","Matilda","Svetlana","Boleslav",
        "Ľubica","Eduard","Jozef","Víťazoslav","Blahoslav","Benedikt","Adrián","Gabriel","Marián",
        "Emanuel","Alena","Soňa","Miroslav","Vieroslava","Benjamín","Hugo","Zita","Richard","Izidor","Miroslava",
        "Irena","Zoltán","Albert","Milena","Igor","Július","Estera","Aleš","Justína","Fedor","Dana, Danica",
        "Rudolf, Rudolfa","Valér","Jela","Marcel","Ervin","Slavomír","Vojtech","Juraj","Marek","Jaroslava",
        "Jaroslav","Jarmila","Lea","Anastázia","","Zigmund","Galina, Timea","Florián","Lesia, Lesana","Hermina",
        "Monika","Ingrida","Roland","Viktória","Blažena","Pankrác","Servác","Bonifác","Žofia, Sofia","Svetozár",
        "Gizela","Viola","Gertrúda","Bernard","Zina","Júlia, Juliána","Želmíra","Ela","Urban","Dušan",
        "Iveta","Viliam","Vilma","Ferdinand","Petrana","Zaneta","Xénia","Karolína","Lenka",
        "Laura","Nórbert","Róbert","Medard","Stanislava","Margaréta","Dobroslava","Zlatko",
        "Anton","Vasil","Vít","Blanka","Adolf","Vratislav","Alfréd","Valéria","Alojz","Paulína",
        "Sidónia","Ján","Olívia","Adriána","Ladislav","Beáta","Peter,Pavol","Melánia",
        "Diana","Berta","Miloslav","Prokop","Cyril, Metod","Patrik","Oliver","Ivan","Lujza","Amália",
        "Milota","Nina","Margita","Kamil","Henrich","Drahomír, Rút","Bohuslav","Kamila","Dušana","Ilja",
        "Daniel","Magdaléna","Oľga","Vladimír","Jakub, Timur","Anna, Hana","Božena","Krištof",
        "Marta","Libuša","Ignác","Božidara","Gustáv","Jerguš","Dominika","Hortenzia","Jozefina",
        "Štefánia","Oskar","Ľubomíra","Vavrinec","Zuzana","Darina","Ľubomír","Mojmír","Marcela","Leonard",
        "Milica","Helena","Lýdia","Anabela, Liliana","Jana","Tichomír","Filip","Bartolomej","Ľudovít","Samuel","Silvia","Augustín","Nikola",
        "Ružena","Nora","Drahoslava","Linda","Belo","Rozália","Regína","Alica","Marianna","Miriama","Martina","Oleg","Bystrik","Mária","Ctibor","Ľudomil","Jolana",
        "Ľudmila","Olympia","Eugénia","Konštantín","Ľuboslav","Matúš","Móric","Zdenka","Ľuboš",
        "Vladislav","Edita","Cyprián","Václav","Michal","Jarolím","Arnold","Levoslav","Stela",
        "František","Viera","Natália","Eliška","Brigita","Dionýz","Slavomíra","Valentína","Maximilián","Koloman",
        "Boris","Terézia","Vladimíra","Hedviga","Lukáš","Kristián","Vendelín","Uršula","Sergej","Alojzia",
        "Kvetoslava","Aurel","Demeter","Sabína","Dobromila","Klára","Šimon, Simona","Aurelia","Denis","",
        "Hubert","Karol","Imrich","Renáta","René","Bohumír","Teodor","Tibor","Martin, Maroš","Svätopluk","Stanislav",
        "Irma","Leopold","Agnesa","Klaudia","Eugen","Alžbeta","Félix","Elvíra","Cecília","Klement","Emília","Katarína",
        "Kornel","Milan","Henrieta","Vratko","Ondrej","Edmund","Bibiána","Oldrich","Barbora","Oto",
        "Mikuláš","Ambróz","Marína","Izabela","Radúz","Hilda","Otília","Lucia","Branislava","Ivica",
        "Albína","Kornélia","Sláva","Judita","Dagmara","Bohdan","Adela","Nadežda","Adam, Eva","","Štefan","Filoména",
        "Ivana","Milada","Dávid","Silvester"
    ][getDayOfYear(month-1,day-1)] || "";
}

function createDayCube(x, y, z, day, month, dayOfWeek, year, isWeeklyCalendar) {
    var cubeColor = cubeCol;

    if (dayOfWeek === 0 || isHoliday(day, month) || (day === 2 && month === 1 && year === 2024)) {
        cubeColor = cubeHollidayCol;
    }
    var textColor = (dayOfWeek === 0 || isHoliday(day, month) || (day === 2 && month === 1 && year === 2024)) ? specialDaysCol : regularDaysCol;
    var textMaterial = new THREE.MeshBasicMaterial({ color: textColor });
    var textGeometry;

    if(isWeeklyCalendar){
        if(getDaysInMonth(currentYear,currentMonth+1) < day ){
            textGeometry = new THREE.TextGeometry((day - getDaysInMonth(currentYear, currentMonth+1)).toString(), {
                font: font,
                size: 0.1,
                height: 0.02
            });
        }
        else{
            textGeometry = new THREE.TextGeometry(day.toString(), {
                font: font,
                size: 0.1,
                height: 0.02
            });
        }
    }
    else{
        textGeometry = new THREE.TextGeometry(day.toString(), {
            font: font,
            size: 0.1,
            height: 0.02
        });
    }

    var textMesh = new THREE.Mesh(textGeometry, textMaterial);

    if (!isWeeklyCalendar) {
        if (day >= 10) {
            textMesh.position.set(-0.07, -0.05, 0.02);
        } else {
            textMesh.position.set(-0.05, -0.05, 0.02);
        }
    }
    else{
        if (day >= 10) {
            textMesh.position.set(-0.52, -0.05, 0.02);
        } else {
            textMesh.position.set(-0.5, -0.05, 0.02);
        }
    }

    var name = getSlovakName(day, month);
    if (day === 29 && month === 1) {
        name = '';
    }

    var nameGeometry = new THREE.TextGeometry(name, {
        font: font,
        size: 0.03,
        height: 0.01
    });

    var nameMesh = new THREE.Mesh(nameGeometry, textMaterial);
    nameGeometry.computeBoundingBox();


    if (isWeeklyCalendar) {
        nameMesh.position.set(0.15, -0.05, 0.02);
    } else {
        nameMesh.position.set(-nameMesh.geometry.boundingBox.max.x / 2, -0.13, 0.02);
    }

    var material = new THREE.MeshBasicMaterial({ color: cubeColor });
    var cube;

    if (isWeeklyCalendar) {
        cube = new THREE.Mesh(new THREE.BoxGeometry(2, 0.25, 0.05), material);
    } else {
        cube = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.05), material);
    }

    cube.add(textMesh);
    cube.add(nameMesh);
    cube.position.set(x, y, z);

    textMesh.userData.isText = true;
    cube.userData.isCube = true;
    cube.userData.day = day;
    cube.userData.month = month;
    cube.userData.dayOfWeek = dayOfWeek;
    cube.userData.name = name;
    textMesh.userData.day = day;
    textMesh.userData.month = month;
    textMesh.userData.dayOfWeek = dayOfWeek;

    textMesh.material.color.set(colorToThreeJSColor(textColor));
    return cube;
}


function createDayCubeYearly(x, y, z, day, month, dayOfWeek, year) {
    var cubeColor = cubeCol;

    if (dayOfWeek === 0 || isHoliday(day, month) || isHoliday(day, month) || (day === 2 && month === 1 && year === 2024)) {
        cubeColor = cubeHollidayCol;
    }

    var textColor = (dayOfWeek === 0 || isHoliday(day, month) || (day === 2 && month === 1 && year === 2024)) ? specialDaysCol : regularDaysCol;
    var textMaterial = new THREE.MeshBasicMaterial({ color: textColor });

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

    textMesh.userData.isText = true;
    cube.userData.isCube = true;
    cube.userData.day = day;
    cube.userData.month = month;
    cube.userData.dayOfWeek = dayOfWeek;
    textMesh.userData.day = day;
    textMesh.userData.month = month;
    textMesh.userData.dayOfWeek = dayOfWeek;

    textMesh.material.color.set(colorToThreeJSColor(textColor));
    return cube;
}
function createFirstDayOfWeek(currentday,day,dayNumber){
    var firstDay;
    if(currentday === 0){
        firstDay = day-7
    }
    else{
        firstDay = day - (currentday);
    }
    return firstDay+dayNumber;
}

function createWeeklyCalendar(year, month, day, isWeeklyObject) {
    var calendar = new THREE.Object3D();

    var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    var rearrangedDaysOfWeek = daysOfWeek.slice(0).concat(daysOfWeek.slice(0, 0));

    var weekYearText;
    var weekYearGeometry;
    var weekYearMaterial = new THREE.MeshBasicMaterial({ color: monthNamesCol });
    var weekYearMesh;

    var currentDate = new Date(year, month, day);
    var weekNumber = getWeekNumber(currentDate);
    var currentDayNumber =  currentDate.getDay();

    weekYearText = getMonthName(month) + ' ' + 'Week ' + weekNumber + ', ' + year;
    weekYearGeometry = new THREE.TextGeometry(weekYearText, {
        font: font,
        size: 0.1,
        height: 0.03
    });
    weekYearMesh = new THREE.Mesh(weekYearGeometry, weekYearMaterial);
    weekYearMesh.position.set(0.05, 0.5, 0.05);
    weekYearMesh.userData.isWeekNumber = true;
    calendar.add(weekYearMesh);

    for (var dayNumber = 1; dayNumber <= 7; dayNumber++) {
        var col = dayNumber - 1;
        var firstDayOfWeek = createFirstDayOfWeek(currentDayNumber, day, dayNumber);
        var cube = createDayCube(0.88, -(dayNumber * 0.25) + 0.4, 0.07, firstDayOfWeek, month, (col + 1) % 7, year, true);

        var textGeometry = new THREE.TextGeometry(rearrangedDaysOfWeek[col], {
            font: font,
            size: 0.05,
            height: 0.03
        });

        var textMaterial = new THREE.MeshBasicMaterial({ color: dayNamesCol });
        var textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.x = 0.15;
        textMesh.userData.isDayName = true;

        cube.add(textMesh);

        cube.userData.isClickable = true;
        textMesh.userData.isClickable = true;
        if(cube.userData.day === new Date().getDate() && cube.userData.month === new Date().getMonth() && year === new Date().getFullYear()){
            cube.material.color.set('#0cd5d8');
            cube.position.z += 0.1;
        }
        calendar.add(cube);
    }

    circle1 = createClickableCircle(1, false, isWeeklyObject);
    circle2 = createClickableCircle(0, false, isWeeklyObject);

    var clickedObject = null;
    var originalPosition = null;
    var currentColor = null;


    document.addEventListener('click', function (event) {
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(calendar.children, true);

        for (var i = 0; i < intersects.length; i++) {
            var object = intersects[i].object;

            if (object.userData.isClickable && object.type === "Mesh") {
                var cube = object;
                if (clickedObject && clickedObject !== cube) {
                    clickedObject.material.color.set(currentColor);
                    clickedObject.position.z = originalPosition;
                }
                if (clickedObject === cube) {
                    clickedObject.material.color.set(currentColor);
                    clickedObject.position.z = originalPosition;
                    clickedObject = null;
                } else {
                    originalPosition = cube.position.z;
                    currentColor = cube.material.color.getHexString();
                    currentColor = '#'+ currentColor;

                    cube.position.z += 0.1;
                    cube.material.color.set('#ffff00');
                    clickedObject = cube;
                }
            }
        }
    });


    return calendar;
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    currentWeek = weekNo;
    return weekNo;
}

function createMonthlyCalendar(year, month, isYearlyObject, elementForYearlyCalendar) {
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
            cube = createDayCube(col * 0.3, -row * 0.3, 0.07, day,month,(day + firstDayOfMonth) % 7, year,false);
        }
        cube.userData.isClickable = true;
        if(cube.userData.day === new Date().getDate() && cube.userData.month === new Date().getMonth() && year === new Date().getFullYear()){
            cube.material.color.set('#0cd5d8');
            cube.position.z += 0.1;

        }
        calendar.add(cube);
    }

    if(!isYearlyObject){
        circle1 = createClickableCircle(1,isYearlyObject,false);
        circle2 = createClickableCircle(0,isYearlyObject,false);
    }

    var clickedObject = null;
    var originalPosition = null;
    var currentColor = null;

    if (elementForYearlyCalendar === true) {
        document.addEventListener('click', function (event) {
            var mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(calendar.children, true);

            for (var i = 0; i < intersects.length; i++) {
                var object = intersects[i].object;

                if (object.userData.isClickable && object.type === "Mesh") {
                    var cube = object;
                    if (clickedObject && clickedObject !== cube) {
                        clickedObject.material.color.set(currentColor);
                        clickedObject.position.z = originalPosition;
                    }
                    if (clickedObject === cube) {
                        clickedObject.material.color.set(currentColor);
                        clickedObject.position.z = originalPosition;
                        clickedObject = null;

                    } else {
                        originalPosition = cube.position.z;
                        currentColor = cube.material.color.getHexString();
                        currentColor = '#' + currentColor;

                        cube.position.z += 0.1;
                        cube.material.color.set('#ffff00');
                        clickedObject = cube;
                    }

                }
            }
        });

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

function createYearlyCalendar(year) {
    var yearlyCalendar = new THREE.Object3D();
    var selectedDay = null;

    var calendarsInRow = 4;
    var calendarSpacing = 0.2;

    for (var month = 0; month < 12; month++) {
        var calendar = createMonthlyCalendar(year, month, true, false);

        calendar.scale.set(0.5, 0.5, 0.5);
        var row = Math.floor(month / calendarsInRow);
        var col = month % calendarsInRow;
        calendar.position.set(col * (calendarSpacing + 0.25), -row * (calendarSpacing + 0.4), 0);

        calendar.userData.month = month;
        calendar.userData.year = year;

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

    circle1 = createClickableCircle(1, true, false);
    circle2 = createClickableCircle(0, true, false);

    var clickedObject = null;
    var originalPosition = null;
    var currentColor = null;

    document.addEventListener('click', function (event) {
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(yearlyCalendar.children, true);

        for (var i = 0; i < intersects.length; i++) {
            var object = intersects[i].object;

            if (object.userData.isClickable && object.type === "Mesh") {
                var cube = object;
                if (clickedObject && clickedObject !== cube) {
                    clickedObject.material.color.set(currentColor);
                    clickedObject.position.z = originalPosition;
                }
                if (clickedObject === cube) {
                    clickedObject.material.color.set(currentColor);
                    clickedObject.position.z = originalPosition;
                    clickedObject = null;

                } else {
                    originalPosition = cube.position.z;
                    currentColor = cube.material.color.getHexString();
                    currentColor = '#' + currentColor;

                    cube.position.z += 0.1;
                    cube.material.color.set('#ffff00');
                    clickedObject = cube;
                }

            }
        }
    });

    return yearlyCalendar;
}

function getMonthName(month) {
    var months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
}

var balls = [];

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

window.addEventListener('click', function () {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(balls, true);

    if (intersects.length > 0) {
        var ball = intersects[0].object;
        if (ball.userData.isClickEnabled) {
            ball.userData.isClickEnabled = false;
            setTimeout(function () {
                ball.userData.isClickEnabled = true;
            }, 500);
            ball.dispatchEvent({ type: 'click' });
        }
    }
});

window.addEventListener('mousemove', function (event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(balls, true);

    if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
    } else {
        renderer.domElement.style.cursor = 'auto';
    }
});

function createClickableCircle(direction,isYearly,isWeekly) {
    var container = new THREE.Object3D();
    var circleGeometry = new THREE.CircleGeometry(0.10, 32);
    var circleMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    var circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);

    circleMesh.rotation.set(Math.PI / 2, -Math.PI / 3, 0);

    circleMesh.userData = {
        isClickEnabled: true,
        onClick: function () {
            if(isYearly){
                if (direction === 1) changeYear(1);
                else if (direction === 0) changeYear(-1);
            }
            else if(isWeekly){
                if (direction === 1) changeWeek(1);
                else if (direction === 0) changeWeek(-1);
            }
            else{
                if (direction === 1) changeMonth(1);
                else if (direction === 0) changeMonth(-1);
            }
        }
    };

    circleMesh.addEventListener('click', function () {
        if (circleMesh.userData.onClick) {
            circleMesh.userData.onClick();
        }
    });

    container.add(circleMesh);

    function createArrowMesh(direction) {
        var arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        var arrowGeometry = new THREE.TextGeometry(direction, {
            font: font,
            size: 0.1,
            height: 0.0
        });
        var arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);

        return arrowMesh;
    }

    var leftArrow = createArrowMesh("<");
    var rightArrow = createArrowMesh(">");
    leftArrow.rotation.set(Math.PI / 2, -Math.PI / 3, Math.PI / 2);
    leftArrow.position.set(0.67, 0.47, -1.35);

    rightArrow.rotation.set(Math.PI / 2, -Math.PI / 3, Math.PI / 2);
    rightArrow.position.set(0.67, 0.47, 1.27);

    scene.add(leftArrow);
    scene.add(rightArrow);

    if (direction === 1) container.position.set(0.65, 0.5, -1.3);
    else if (direction === 0) container.position.set(0.65, 0.5, 1.3);

    scene.add(container);

    balls.push(circleMesh);
    return container;
}
var dropdown = document.createElement('select');
dropdown.style.position = 'absolute';
dropdown.style.top = '10px';
dropdown.style.left = '0.5rem';
dropdown.style.width = '10rem';
dropdown.style.height = '1.3rem';

var monthlyOption = document.createElement('option');
monthlyOption.text = 'Monthly calendar';
monthlyOption.value = 'monthly';
dropdown.add(monthlyOption);

var yearlyOption = document.createElement('option');
yearlyOption.text = 'Yearly calendar';
yearlyOption.value = 'yearly';
dropdown.add(yearlyOption);

var weeklyOption = document.createElement('option');
weeklyOption.text = 'Weekly calendar';
weeklyOption.value = 'weekly';
dropdown.add(weeklyOption);
dropdown.selectedIndex = 1;
document.body.appendChild(dropdown);

var debounceTimeout;
dropdown.addEventListener('change', function () {
    if (!debounceTimeout) {

        if (dropdown.value === 'monthly') {
            toggleCalendarView('monthly');
            calendarType = 'monthly';
        } else if(dropdown.value === 'yearly') {
            toggleCalendarView('yearly');
            calendarType = 'yearly';
        }
        else {
            toggleCalendarView('weekly');
            calendarType = 'weekly';
        }
        debounceTimeout = setTimeout(function () {
            debounceTimeout = null;
        }, 1000);
    }
});

isYearly = false;
function toggleCalendarView(type) {
    group.remove(currentCalendar);
    balls = [];
    scene.remove(circle1);
    scene.remove(circle2);

    if (type === "monthly") {
        currentCalendar = createMonthlyCalendar(currentYear, currentMonth, false, true);
        positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    } else if (type === "yearly") {
        currentCalendar = createYearlyCalendar(currentYear);
        positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    }
    else {
        currentCalendar = createWeeklyCalendar(currentYear,currentMonth,currentDay,true);
        positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    }
    group.add(currentCalendar);
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function changeWeek(delta) {
    var currentDate = new Date(currentYear, currentMonth, currentDay);
    var currentDayNumber =  currentDate.getDay();
    var day = createFirstDayOfWeek(currentDayNumber,currentDay,1);
    var month;
    var year;
    var test=0;
    currentWeek += delta;
    if(delta === 1){
        if(day+7 > getDaysInMonth(currentYear,currentMonth+1)){
            if(currentMonth+1>11){
                currentYear = currentYear + 1 ;
                currentMonth = 0;
                test = day - getDaysInMonth(currentYear,currentMonth) + 6
                if(test === 6 ){
                    currentDay = 1;
                }
                else{
                    currentDay = 1+test;
                }

            }
            else {
                currentMonth = currentMonth+1
                test = day - getDaysInMonth(currentYear,currentMonth) + 6
                if(test === 6 ){
                    currentDay = 1;
                }
                else{
                    currentDay = 1+test;
                }
            }
        }
        else {
            currentDay =day + delta*7;
        }
    }
    else{
        if(currentDay-7 < 1){

            if(currentMonth-1<0){
                currentYear -= 1;
                currentMonth = 11;
                test = getDaysInMonth(currentYear,currentMonth+1) - day
                if(day < 7 ){
                    currentDay = getDaysInMonth(currentYear,currentMonth+1)-(day-(day-1));
                }
                else{
                    currentDay = 1+test;
                }
            }
            else {
                currentMonth = currentMonth-1;
                test = getDaysInMonth(currentYear,currentMonth+1) - day
                if(day < 7 ){
                    var skuska = day - 1;
                    var skuska2 = day-skuska;

                    currentDay = getDaysInMonth(currentYear,currentMonth+1)-skuska2;
                }
                else{
                    currentDay = 1+test;
                }
            }
        }
        else {
            currentDay =day + delta*7;
        }
    }

    if (currentWeek < 1) {
        currentWeek = getISOWeeksInYear(currentYear);
    } else if (currentWeek > getISOWeeksInYear(currentYear)) {
        currentWeek = 1;
    }
    group.remove(currentCalendar);

    var newCalendar = createWeeklyCalendar(currentYear, currentMonth, currentDay, true);
    positionCalendarOnFace(newCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    newCalendar.name = "calendar_week_" + currentWeek;
    group.add(newCalendar);
    currentCalendar = newCalendar;
}

function getISOWeeksInYear(year) {
    var d = new Date(year, 11, 31);
    var week = getISOWeek(d);

    if (week == 1) {
        var nextYear = new Date(year + 1, 0, 1);
        if (getISOWeek(d) == 1) {
            return 52;
        }
    }

    return week;
}

function getISOWeek(date) {
    var dayOfWeek = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayOfWeek);
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    var weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return weekNumber;
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

    group.remove(currentCalendar);

    var newCalendar = createMonthlyCalendar(currentYear, currentMonth, false, true);
    positionCalendarOnFace(newCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    newCalendar.name = "calendar_" + currentMonth;
    group.add(newCalendar);
    currentCalendar = newCalendar;
}

function changeYear(delta) {
    currentYear += delta;
    group.remove(currentCalendar);
    var newCalendar = createYearlyCalendar(currentYear);
    positionCalendarOnFace(newCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    newCalendar.name = "calendar_" + currentMonth;
    group.add(newCalendar);
    currentCalendar = newCalendar;
}

var screenshotButton = document.createElement('button');
screenshotButton.textContent = 'Take Screenshot';
screenshotButton.style.position = 'absolute';
screenshotButton.style.top = '10px';
screenshotButton.style.left = '11rem';
screenshotButton.style.width = '10rem';

document.body.appendChild(screenshotButton);

screenshotButton.addEventListener('click', function () {
    takeScreenshot();
});

async function takeScreenshot() {
    var screenshotCanvas = document.createElement('canvas');
    var width = window.innerWidth;
    var height = window.innerHeight;

    screenshotCanvas.width = width;
    screenshotCanvas.height = height;

    var context = screenshotCanvas.getContext('2d');
    renderer.render(scene, camera);

    context.drawImage(renderer.domElement, 0, 0, width, height);

    screenshotCanvas.toBlob(async function (blob) {
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
            var dataURL = URL.createObjectURL(blob);

            var downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = 'screenshot.png';

            downloadLink.click();
        }
    }, 'image/png');
}

var saveButton = document.createElement('button');
saveButton.textContent = 'Save Calendar';
saveButton.style.position = 'absolute';
saveButton.style.top = '10px';
saveButton.style.left = '21.5rem';

document.body.appendChild(saveButton);

saveButton.addEventListener('click', function () {
    saveCalendar();
});

function saveCalendar() {
    let calendarSettingsToSave = {
        calendarType: calendarType,
        cubeCol: cubeCol,
        cubeHollidayCol: cubeHollidayCol,
        regularDaysCol: regularDaysCol,
        specialDaysCol: specialDaysCol,
        dayNamesCol: dayNamesCol,
        monthNamesCol: monthNamesCol,
        yearNumberCol: yearNumberCol,
        pyramidCol: pyramidCol,
        currentMonth: currentMonth,
        currentYear: currentYear,
        currentDay: currentDay,
        currentWeek: currentWeek,
        cubeColor: cubeColorPicker.value,
        regularDaysColor: regularDaysColorPicker.value,
        specialDaysColor: specialDaysColorPicker.value,
        dayNamesColorPicker: specialDaysColorPicker.value,
        monthNamesColor: monthNamesColorPicker.value,
        yearNumberColor: yearNumberColorPicker.value,
        cubeHollidayColor: cubeHollidayColorPicker.value,
        pyramidColor:pyramidColorPicker.value,
        material: material
    };
    var settingsString = JSON.stringify(calendarSettingsToSave, null, 2);

    var blob = new Blob([settingsString], { type: 'application/json' });

    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'calendar_settings.json';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}

var loadInput = document.createElement('input');
loadInput.type = 'file';
loadInput.name = 'nazovInputu';
loadInput.style.position = 'absolute';
loadInput.style.top = '10px';
loadInput.style.left = '28.5rem';
loadInput.style.fontSize = '0';
loadInput.addEventListener('change', function () {
    loadCalendarSettings(loadInput);
});
document.body.appendChild(loadInput);

var loadButton = document.createElement('button');
loadButton.textContent = 'Load calendar';
loadButton.style.position = 'absolute';
loadButton.style.top = '10px';
loadButton.style.left = '28.5rem';
loadButton.style.cursor = 'pointer';

loadButton.addEventListener('click', function () {
    loadInput.click();
});

document.body.appendChild(loadButton);

function loadCalendarSettings(input) {
    if (input.files.length > 0) {
        var file = input.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            try {
                var calendarSettings = JSON.parse(e.target.result);
                updateCalendarSettings(calendarSettings);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    }
}

function updateCalendarSettings(settings) {
    calendarType = settings.calendarType;
    cubeCol = settings.cubeCol;
    cubeHollidayCol = settings.cubeHollidayCol;
    regularDaysCol = settings.regularDaysCol;
    specialDaysCol = settings.specialDaysCol;
    dayNamesCol = settings.dayNamesCol;
    monthNamesCol = settings.monthNamesCol;
    yearNumberCol = settings.yearNumberCol;
    pyramidCol = settings.pyramidColor;
    currentMonth = settings.currentMonth;
    currentYear = settings.currentYear;
    currentDay = settings.currentDay;
    currentWeek = settings.currentWeek;
    cubeColorPicker.value = settings.cubeColor
    regularDaysColorPicker.value = settings.regularDaysColor;
    specialDaysColorPicker.value = settings.specialDaysColor;
    monthNamesColorPicker.value = settings.monthNamesColor;
    yearNumberColorPicker.value = settings.yearNumberColor;
    cubeHollidayColorPicker.value = settings.cubeHollidayColor;
    pyramidColorPicker.value = settings.pyramidColor;
    material = settings.material
    updatePyramidColor();
    if( material === 'basic' ) {
        changeToBasicMaterial();
    }
    else if( material === 'lambert' ) {
        changeToLambertMaterial();
    }
    else if( material === 'phong' ) {
        changeToPhongMaterial();
    }
    toggleCalendarView(calendarType);
}

var materialDropdown = document.createElement('select');
materialDropdown.style.position = 'absolute';
materialDropdown.style.top = '40px';
materialDropdown.style.left = '0.5rem';
materialDropdown.style.width = '10rem';
materialDropdown.style.height = '1.3rem';

var basicOption = document.createElement('option');
basicOption.text = 'Basic material';
basicOption.value = 'basic';
materialDropdown.add(basicOption);

var lambertOption = document.createElement('option');
lambertOption.text = 'Lambert material';
lambertOption.value = 'lambert';
materialDropdown.add(lambertOption);

var phongOption = document.createElement('option');
phongOption.text = 'Phong material';
phongOption.value = 'phong';
materialDropdown.add(phongOption);

document.body.appendChild(materialDropdown);

materialDropdown.addEventListener('change', function () {
    if (!debounceTimeout) {

        if (materialDropdown.value === 'basic') {
            material = 'basic';
            changeToBasicMaterial();
        }
        else if(materialDropdown.value === 'lambert') {
            material = 'lambert';
            changeToLambertMaterial();
        }
        else if(materialDropdown.value === 'phong'){
            material = 'phong';
            changeToPhongMaterial();
        }

        debounceTimeout = setTimeout(function () {
            debounceTimeout = null;
        }, 1000);
    }
});

function changeToBasicMaterial() {
    scene.remove(light);
    scene.remove(group);
    group = new THREE.Group();

    var geometryPrism = new THREE.CylinderGeometry(1.4, 1.4, 3, 3);

    var materialOuter = new THREE.MeshBasicMaterial({
        color: pyramidColorPicker.value,
        side: THREE.DoubleSide
    });

    var materialInner = new THREE.MeshBasicMaterial({
        visible: false
    });

    geometryPrism.faceVertexUvs[0] = [];
    geometryPrism.faceVertexUvs[0].push([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(0, 1)
    ]);

    prismMesh = new THREE.Mesh(geometryPrism, [materialOuter, materialInner]);
    prismMesh.position.set(0, 0.2, 0);
    prismMesh.rotation.x = -Math.PI / 2;
    group.add(prismMesh);

    if(calendarType === "yearly"){
        currentCalendar = createYearlyCalendar(currentYear);


    }else if(calendarType === "monthly" ){
        currentCalendar = createMonthlyCalendar(currentYear, currentMonth, false, true);
    }else {
        currentCalendar = createWeeklyCalendar(currentYear,currentMonth,currentDay,true);

    }

    positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    group.add(currentCalendar);
    scene.add(group);
}

function changeToLambertMaterial() {
    scene.remove(light);
    scene.remove(group);
    group = new THREE.Group();

    var geometryPrism = new THREE.CylinderGeometry(1.4, 1.4, 3, 3);

    var materialOuter = new THREE.MeshLambertMaterial({
        color: pyramidColorPicker.value,
        side: THREE.DoubleSide
    });

    var materialInner = new THREE.MeshLambertMaterial({
        visible: false
    });

    geometryPrism.faceVertexUvs[0] = [];
    geometryPrism.faceVertexUvs[0].push([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(0, 1)
    ]);

    prismMesh = new THREE.Mesh(geometryPrism, [materialOuter, materialInner]);
    prismMesh.position.set(0, 0.2, 0);
    prismMesh.rotation.x = -Math.PI / 2;
    group.add(prismMesh);

    if(calendarType === "yearly"){
        currentCalendar = createYearlyCalendar(currentYear);


    }else if(calendarType === "monthly" ){
        currentCalendar = createMonthlyCalendar(currentYear, currentMonth, false, true);
    }else {
        currentCalendar = createWeeklyCalendar(currentYear,currentMonth,currentDay,true);

    }
    positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    group.add(currentCalendar);

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 2, 0.5, 0 ).normalize();
    scene.add(light);

    scene.add(group);
}

function changeToPhongMaterial() {
    scene.remove(light);
    scene.remove(group);
    group = new THREE.Group();

    var geometryPrism = new THREE.CylinderGeometry(1.4, 1.4, 3, 3);

    var materialOuter = new THREE.MeshPhongMaterial({
        color: pyramidColorPicker.value,
        side: THREE.DoubleSide
    });

    var materialInner = new THREE.MeshPhongMaterial({
        visible: false
    });

    geometryPrism.faceVertexUvs[0] = [];
    geometryPrism.faceVertexUvs[0].push([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(0, 1)
    ]);

    prismMesh = new THREE.Mesh(geometryPrism, [materialOuter, materialInner]);
    prismMesh.position.set(0, 0.2, 0);
    prismMesh.rotation.x = -Math.PI / 2;
    group.add(prismMesh);

    if(calendarType === "yearly"){
        currentCalendar = createYearlyCalendar(currentYear);


    }else if(calendarType === "monthly" ){
        currentCalendar = createMonthlyCalendar(currentYear, currentMonth, false, true);
    }else {
        currentCalendar = createWeeklyCalendar(currentYear,currentMonth,currentDay,true);

    }
    positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    group.add(currentCalendar);

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 2, 0.5, 0 ).normalize();
    scene.add(light);

    scene.add(group);
}