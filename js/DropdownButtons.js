import * as ThreeScene from './ThreeScene.js';

import {
    positionCalendarOnFace,
    getCurrentYear,
    getCurrentMonth,
    getCurrentDay
} from './Helpers.js';

import {
    cubeColorPicker,
    cubeHollidayColorPicker,
    pyramidColorPicker,
    specialDaysColorPicker,
    dayNamesColorPicker,
    yearNumberColorPicker,
    monthNamesColorPicker,
    regularDaysColorPicker,
    updatePyramidColor,
} from './ColorPickers.js';

var group;
var prismMesh;
var light;
var currentCalendar;
var material = 'basic'
var calendarType = 'yearly';

let cubeCol = '#cccccc';
let cubeHollidayCol = '#ff0000';
let regularDaysCol = '#000000';
let specialDaysCol = '#ffffff';
let dayNamesCol = '#000000';
let monthNamesCol = '#000000';
let yearNumberCol = '#000000';
let pyramidCol = '#dddddd';

var currentMonth = getCurrentMonth();
var currentYear = getCurrentYear();
var currentDay = getCurrentDay();
var currentWeek = ThreeScene.getWeekNumber(new Date());

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
            ThreeScene.toggleCalendarView('monthly');
            calendarType = 'monthly';
        } else if(dropdown.value === 'yearly') {
            ThreeScene.toggleCalendarView('yearly');
            calendarType = 'yearly';
        }
        else {
            ThreeScene.toggleCalendarView('weekly');
            calendarType = 'weekly';
        }
        debounceTimeout = setTimeout(function () {
            debounceTimeout = null;
        }, 1000);
    }
});
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
    ThreeScene.renderer.render(ThreeScene.scene, ThreeScene.camera);

    context.drawImage(ThreeScene.renderer.domElement, 0, 0, width, height);

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
        currentMonth: ThreeScene.currentMonth,
        currentYear: ThreeScene.currentYear,
        currentDay: ThreeScene.currentDay,
        currentWeek: ThreeScene.currentWeek,
        cubeColor: cubeColorPicker.value,
        regularDaysColor: regularDaysColorPicker.value,
        specialDaysColor: specialDaysColorPicker.value,
        dayNamesColorPicker: specialDaysColorPicker.value,
        monthNamesColor: monthNamesColorPicker.value,
        yearNumberColor: yearNumberColorPicker.value,
        cubeHollidayColor: cubeHollidayColorPicker.value,
        pyramidColor: pyramidColorPicker.value,
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
    if (calendarType === 'monthly') {
        dropdown.selectedIndex=0
    }
    else if(calendarType === 'yearly') {
        dropdown.selectedIndex=1
    }
    else if(calendarType === 'weekly'){
        dropdown.selectedIndex=2
    }
    materialDropdown.selectedIndex
    updatePyramidColor();
    ThreeScene.toggleCalendarView(calendarType);
    ThreeScene.updateColors(
        calendarType,
        cubeCol,
        cubeHollidayCol,
        regularDaysCol,
        specialDaysCol,
        dayNamesCol,
        monthNamesCol ,
        yearNumberCol,
        pyramidCol,
        currentMonth,
        currentYear ,
        currentDay,
        currentWeek)
    if( material === 'basic' ) {
        materialDropdown.selectedIndex=0;
        changeMaterial('basic');
    }
    else if( material === 'lambert' ) {
        materialDropdown.selectedIndex=1;
        changeMaterial('lambert');
    }
    else if( material === 'phong' ) {
        materialDropdown.selectedIndex=2;
        changeMaterial('phong');
    }

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
            changeMaterial('basic')
        }
        else if(materialDropdown.value === 'lambert') {
            material = 'lambert';
            changeMaterial('lambert')
        }
        else if(materialDropdown.value === 'phong'){
            material = 'phong';
            changeMaterial('phong');
        }

        debounceTimeout = setTimeout(function () {
            debounceTimeout = null;
        }, 1000);
    }
});

function changeMaterial(materialType) {
    ThreeScene.removeVariables()
    group = new THREE.Group();

    var geometryPrism = new THREE.CylinderGeometry(1.4, 1.4, 3, 3);
    var materialOuter;

    if (materialType === 'lambert') {
        materialOuter = new THREE.MeshLambertMaterial({
            color: pyramidColorPicker.value,
            side: THREE.DoubleSide
        });
    } else if (materialType === 'phong') {
        materialOuter = new THREE.MeshPhongMaterial({
            color: pyramidColorPicker.value,
            shininess: 100,
            side: THREE.DoubleSide
        });
    } else {
        materialOuter = new THREE.MeshBasicMaterial({
            color: pyramidColorPicker.value,
            side: THREE.DoubleSide
        });
    }
    var materialInner = new THREE.MeshBasicMaterial({
        visible: false
    });

    setMaterial(geometryPrism, materialOuter, materialInner, group);
    if (materialType !== 'basic') {
        setLight();
    }
    ThreeScene.scene.add(group);
    ThreeScene.updateVariables(prismMesh,group,light,currentCalendar,calendarType)
}
export function setMaterial(geometryPrism, materialOuter, materialInner, group){
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

        currentCalendar = ThreeScene.createYearlyCalendar(ThreeScene.currentYear);

    }else if(calendarType === "monthly" ){
        currentCalendar = ThreeScene.createMonthlyCalendar(ThreeScene.currentYear, ThreeScene.currentMonth, false, true);
    }else {
        currentCalendar = ThreeScene.createWeeklyCalendar(ThreeScene.currentYear,ThreeScene.currentMonth,ThreeScene.currentDay,true);

    }
    positionCalendarOnFace(currentCalendar, prismMesh, Math.PI / 2, -Math.PI / 6, 0.33, 0.75, -0.62);
    group.add(currentCalendar);
}

function setLight(){
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 2, 0.5, 0 ).normalize();
    ThreeScene.scene.add(light);
}
