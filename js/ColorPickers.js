import { isHoliday } from './Helpers.js';
import { group, prismMesh, setCubeCol, setCubeHollidayCol, setMonthNamesCol, setSpecialDaysCol, setDayNamesCol, setPyramidCol, setRegularDaysCol, setYearNumberCol } from './ThreeScene.js';

export var cubeColorPicker = createColorPicker('cubeColorPicker', '270px', 'Cube Color:', '#cccccc');
export var cubeHollidayColorPicker = createColorPicker('cubeHollidayColorPicker', '310px', 'Cube Color Holliday:', '#ff0000');
export var pyramidColorPicker = createColorPicker('pyramidColorPicker', '350px', 'Pyramid Color:', '#dddddd');
export var regularDaysColorPicker = createColorPicker('regularDaysColorPicker', '70px', 'Regular Days:', '#000000');
export var specialDaysColorPicker = createColorPicker('specialDaysColorPicker', '110px', 'Special Days:', '#ffffff');
export var dayNamesColorPicker = createColorPicker('dayNamesColorPicker', '150px', 'Day Names:', '#000000');
export var monthNamesColorPicker = createColorPicker('monthNamesColorPicker', '190px', 'Month Names:', '#000000');
export var yearNumberColorPicker = createColorPicker('yearNumberColorPicker', '230px', 'Year number:', '#000000');

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

export function colorToThreeJSColor(hexColor) {
    var color = new THREE.Color();
    color.set(hexColor);
    return color;
}

export function updatePyramidColor() {
    var newColor = pyramidColorPicker.value;
    setPyramidCol(newColor)

    prismMesh.material[0].color.set(colorToThreeJSColor(newColor));
}

export function updateCubeColor() {
    var newColor = cubeColorPicker.value;
    // cubeCol = newColor;
    setCubeCol(newColor);

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

export function updateDayNamesColor() {
    var newColor = dayNamesColorPicker.value;
    setDayNamesCol(newColor);

    group.traverse(function (child) {
        if (child instanceof THREE.Mesh && child.userData.isDayName) {
            child.material.color.set(colorToThreeJSColor(newColor));
        }
    });
}
export function updateYearNumberColor() {
    var newColor = yearNumberColorPicker.value;
    setYearNumberCol(newColor);

    group.traverse(function (child) {
        if (child instanceof THREE.Mesh && child.userData.isYearNumber) {
            child.material.color.set(colorToThreeJSColor(newColor));
        }
    });
}
export function updateMonthNamesColor() {
    var newColor = monthNamesColorPicker.value;
    setMonthNamesCol(newColor);

    group.traverse(function (child) {
        if (child instanceof THREE.Mesh && child.userData.isMonthName) {
            child.material.color.set(colorToThreeJSColor(newColor));
        }
    });
}

export function updateRegularDaysColor() {
    updateColorForDays(regularDaysColorPicker, false, false, true);
}

export function updateSpecialDaysColor() {
    updateColorForDays(specialDaysColorPicker, true, true);
}

export function updateHollidayCubeColor() {
    var newColor = cubeHollidayColorPicker.value;
    setCubeHollidayCol(newColor);

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

function updateColorForDays(colorPicker, includeHolidays = false, includeSundays = false, includeRegularDays = false) {
    var newColor = colorPicker.value;
    if(includeHolidays === true){
        setSpecialDaysCol(newColor)
    }
    if(includeHolidays === false && includeSundays === false){
        setRegularDaysCol(newColor);
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