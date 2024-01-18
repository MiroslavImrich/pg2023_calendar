export function getCurrentDay() {
    var currentDate = new Date();
    return currentDate.getDate();
}
export function getCurrentYear() {
    var currentDate = new Date();
    return currentDate.getFullYear();
}

export function getCurrentMonth() {
    var currentDate = new Date();
    return currentDate.getMonth();
}

export function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

export function getMonthName(month) {
    var months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
}

export function createFirstDayOfWeek(currentday,day,dayNumber){
    var firstDay;
    if(currentday === 0){
        firstDay = day-7
    }
    else{
        firstDay = day - (currentday);
    }
    return firstDay+dayNumber;
}

export function getISOWeeksInYear(year) {
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
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}



export function isHoliday(day, month) {
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

function getDayOfYear(month, day) {
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var dayOfYear = 0;
    for (var i = 0; i <= month; i++) {
        dayOfYear += daysInMonth[i];
    }

    dayOfYear += day;

    return dayOfYear;
}

export function getSlovakName(day, month) {
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
export function positionCalendarOnFace(calendar, prism, rotationY, rotationX, distanceFromCenterX, distanceFromCenterY, distanceFromCenterZ) {
    var faceCenter = new THREE.Vector3(distanceFromCenterX, 0.2 + distanceFromCenterY, 1.5 + distanceFromCenterZ);
    var quaternionY = new THREE.Quaternion();
    quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    var quaternionX = new THREE.Quaternion();
    quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rotationX);
    calendar.setRotationFromQuaternion(quaternionY.multiply(quaternionX));
    calendar.position.copy(faceCenter);
}