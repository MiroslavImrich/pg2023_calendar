import {
    cubeColorPicker,
    cubeHollidayColorPicker,
    pyramidColorPicker,
    specialDaysColorPicker,
    dayNamesColorPicker,
    yearNumberColorPicker,
    monthNamesColorPicker,
    regularDaysColorPicker,
    colorToThreeJSColor,
    updateCubeColor,
    updatePyramidColor,
    updateRegularDaysColor,
    updateSpecialDaysColor,
    updateYearNumberColor,
    updateMonthNamesColor,
    updateDayNamesColor,
    updateHollidayCubeColor
} from './ColorPickers.js';

import {
    getCurrentMonth,
    getCurrentDay,
    getCurrentYear,
    getSlovakName,
    isHoliday,
    getDaysInMonth,
    getMonthName,
    getISOWeeksInYear,
    createFirstDayOfWeek,
    positionCalendarOnFace
} from "./Helpers.js";

import { setMaterial }  from './DropdownButtons.js';

export var camera, scene, renderer, controls;
export var group;
export var prismMesh;
export var currentCalendar;
export var isYearly;
export var fontLoader = new THREE.FontLoader();
export  var font;
export  var light;

export var calendarType = 'yearly';
export var currentMonth = getCurrentMonth();
export var currentYear = getCurrentYear();
export var currentDay = getCurrentDay();
export var currentWeek=getWeekNumber(new Date());

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
    var sphere = new THREE.Mesh( geometrySphere, materialSphere );
    sphere.position.set(0, 0, 0);
    scene.add( sphere );
}

export let cubeCol = '#cccccc';
export let pyramidCol = '#dddddd';
export let cubeHollidayCol = '#ff0000';
export let regularDaysCol = '#000000';
export let specialDaysCol = '#ffffff';
export let dayNamesCol = '#000000';
export let monthNamesCol = '#000000';
export let yearNumberCol = '#000000';

document.body.appendChild(cubeColorPicker);
document.body.appendChild(cubeHollidayColorPicker);
document.body.appendChild(pyramidColorPicker);
document.body.appendChild(yearNumberColorPicker);
document.body.appendChild(dayNamesColorPicker);
document.body.appendChild(regularDaysColorPicker);
document.body.appendChild(specialDaysColorPicker);
document.body.appendChild(monthNamesColorPicker);

export function setCubeCol(newCol){
    cubeCol = newCol;
}

export function setPyramidCol(newCol){
    pyramidCol = newCol;
}
export function setCubeHollidayCol(newCol){
    cubeHollidayCol = newCol;
}

export function setRegularDaysCol(newCol){
    regularDaysCol = newCol;
}

export function setSpecialDaysCol(newCol){
    specialDaysCol = newCol;
}
export function setDayNamesCol(newCol){
    dayNamesCol = newCol;
}
export function setMonthNamesCol(newCol){
    monthNamesCol = newCol;
}
export function setYearNumberCol(newCol){
    yearNumberCol = newCol;
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    camera.lookAt(scene.position);
    controls.update();
}

export function updateVariables(prismMeshUpdated,groupUpdated,lightUpdated,currentCalendarUpdated,calendarTypeUpdated){
    prismMesh = prismMeshUpdated;
    group=groupUpdated;
    light = lightUpdated;
    currentCalendar=currentCalendarUpdated;
    calendarType=calendarTypeUpdated;

}

export function removeVariables(){
    scene.remove(light)
    scene.remove(group)
}

export function updateColors(calendarTypeUpdate, cubeColUpdate, cubeHollidayColUpdate, regularDaysColUpdate, specialDaysColUpdate, dayNamesColUpdate, monthNamesColUpdate,
                             yearNumberColUpdate, pyramidColorUpdate, currentMonthUpdate, currentYearUpdate, currentDayUpdate, currentWeekUpdate){
    calendarType = calendarTypeUpdate;
    cubeCol = cubeColUpdate;
    cubeHollidayCol = cubeHollidayColUpdate;
    regularDaysCol = regularDaysColUpdate;
    specialDaysCol = specialDaysColUpdate;
    dayNamesCol = dayNamesColUpdate;
    monthNamesCol = monthNamesColUpdate;
    yearNumberCol = yearNumberColUpdate;
    pyramidCol = pyramidColorUpdate;
    currentMonth = currentMonthUpdate;
    currentYear = currentYearUpdate;
    currentDay = currentDayUpdate;
    currentWeek = currentWeekUpdate;

    updateCubeColor();
    updateRegularDaysColor();
    updateSpecialDaysColor();
    updateDayNamesColor();
    updateMonthNamesColor();
    updateYearNumberColor();
    updateHollidayCubeColor();
    updatePyramidColor();
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

function createDayCube(x, y, z, day, month, dayOfWeek, year, isWeeklyCalendar) {
    var cubeColor = cubeCol;

    if (dayOfWeek === 0 || isHoliday(day, month)) {
        cubeColor = cubeHollidayCol;
    }
    var textColor = (dayOfWeek === 0 || isHoliday(day, month)) ? specialDaysCol : regularDaysCol;
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

    if (dayOfWeek === 0 || isHoliday(day, month) || isHoliday(day, month)) {
        cubeColor = cubeHollidayCol;
    }

    var textColor = (dayOfWeek === 0 || isHoliday(day, month)) ? specialDaysCol : regularDaysCol;
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

export function createWeeklyCalendar(year, month, day, isWeeklyObject) {
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
    markAnyDay(clickedObject, originalPosition, currentColor, calendar)

    return calendar;
}

function markAnyDay(clickedObject, originalPosition, currentColor, calendarType){
    document.addEventListener('click', function (event) {
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(calendarType.children, true);

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
}

export function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    currentWeek = weekNo;
    return weekNo;
}

export function createMonthlyCalendar(year, month, isYearlyObject, elementForYearlyCalendar) {
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
        markAnyDay(clickedObject,originalPosition, currentColor, calendar);
    }
    return calendar;
}

export function createYearlyCalendar(year) {
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

    markAnyDay(clickedObject, originalPosition, currentColor, yearlyCalendar);

    return yearlyCalendar;
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

isYearly = false;
export function toggleCalendarView(type) {
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
