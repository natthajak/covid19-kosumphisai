import { thaiMonths, publicPatientPlaceholder } from "./config";

// id: a string
export function idCardNumberValidate(id) {
    var lastid = parseInt(id.charAt(id.length - 1));
    let posnum = 0;

    for (let i = 0; i < 12; i++)
        posnum += id[i] * (13 - i);

    var checklast = (11 - (posnum % 11)) % 10;
    var IDnumber = /^\d{13}$/;

    if (id === null || id === "")
        return { result: false, errorMessage: "กรุณากรอกเลขบัตรประจำตัวประชาชน" };
    else if (isNaN(id) || id.indexOf(" ") !== -1)
        return { result: false, errorMessage: "กรุณากรอกเลขบัตรประจำตัวประชาชนเป็นตัวเลขเท่านั้น" };
    else if (id.length !== 13)
        return { result: false, errorMessage: "กรุณากรอกเลขบัตรประจำตัวประชาชนเป็นจำนวนเลข 13 หลัก" };
    else if (id.match(IDnumber) && (lastid !== checklast))
        return { result: false, errorMessage: "เลขบัตรประจำตัวประชาชนไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" };
    else
        return { result: true, errorMessage: "" };
}

// number: a string
export function phoneNumberValidate(number) {
    var phonenumber = /^\d{10}$/;

    if (number === null || number === "")
        return { result: false, errorMessage: "กรุณากรอกเบอร์โทรศัพท์" };
    else if (isNaN(number) || number.indexOf(" ") !== -1)
        return { result: false, errorMessage: "กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น" };
    else if (number.length !== 10)
        return { result: false, errorMessage: "กรุณากรอกเบอร์โทรศัพท์จำนวนเลข 10 หลัก" };
    else if (number.match(phonenumber))
        return { result: true, errorMessage: "" };
    else
        return { result: false, errorMessage: "เบอร์โทรศัพท์ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" };
}

// birthDate: a custom date object
export function getAge(birthDate) {
    var today = new Date();
    var birthDay = new Date(toJsDate(birthDate));
    var age = today.getFullYear() - birthDay.getFullYear();
    var m = today.getMonth() - birthDay.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDay.getDate()))
        age--;
    return age;
}

// Calculate the difference duration between two dates in days
// firstDate and secondDate: a custom date object
export function getDiffDays(firstDate, secondDate) {
    var firstDay = toJsDate(firstDate);
    var secondDay = toJsDate(secondDate);
    var diffTimes = secondDay.getTime() - firstDay.getTime();
    var diffDays = Math.round(diffTimes / (1000 * 3600 * 24));
    return diffDays;
}

// patients: an array of objects
// newPatient: an object
export function checkDuplicate(patients, newPatient) {
    for (const patient of patients) {
        if (newPatient.id_card_number === patient.id_card_number)
            return { result: false, errorMessage: "มีผู้ป่วยที่มีเลขบัตรประชาชนดังกล่าวอยู่แล้ว" };

        if (newPatient.district_number === patient.district_number)
            return { result: false, errorMessage: "มีผู้ป่วยที่มีลำดับอำเภอดังกล่าวอยู่แล้ว" };

        if (newPatient.province_number === patient.province_number)
            return { result: false, errorMessage: "มีผู้ป่วยที่มีลำดับจังหวัดดังกล่าวอยู่แล้ว" };

        if (newPatient.month === patient.month && newPatient.month_number === patient.month_number)
            return { result: false, errorMessage: "มีผู้ป่วยที่มีลำดับเดือนดังกล่าวอยู่แล้ว" };
    }
    return { result: true, errorMessage: "" };
}

// This function returns an array of fields that have different values between two objects
// ignore: an array containing fields that will be ignored by the function
export function getDiffFields(obj1, obj2, ignore) {
    const result = [];
    for (const field in obj1) {
        if (ignore.includes(field))
            continue;
        if (obj1[field] !== obj2[field])
            result.push(field);
    }
    return result;
}

// This function is to map Thai months to integers *** Return a month number starting from 1 to 12 ***
// month: a string (Thai month)
export function mapThaiMonths(month) {
    const foundIndex = thaiMonths.findIndex(item => item === month);
    if (foundIndex === -1)
        throw new Error("mapThaiMonths(): Invalid input (month not found)");
    return foundIndex + 1;
}

// This function is to convert a custom date object to a js date object
// date: a custom date object ({date: "", month: "", year: ""})
export function toJsDate(date) {
    if ((typeof (date.date) === undefined) || (typeof (date.month) === undefined) || (typeof (date.year) === undefined))
        throw new Error("toStringDate(): Invalid input (expected a custom date)");
    return new Date(parseInt(date.year) - 543, mapThaiMonths(date.month) - 1, parseInt(date.date));
}

// This function is to sort a timeline array by date
// entries: an array containing timeline objects
export function sortTimelinesByDate(entries) {
    if (!Array.isArray(entries)) throw new Error("sortTimelinesByDate(): Invalid input (expected an array)");
    return entries.sort((a, b) => toJsDate(a.date_begin) - toJsDate(b.date_begin));
}

// This function is to sort a treatment array by date
// entries: an array containing treatment objects
export function sortTreatmentsByDate(entries) {
    if (!Array.isArray(entries)) throw new Error("sortTreatmentsByDate: Invalid input (expected an array)");
    return entries.sort((a, b) => toJsDate(a.treatment_date) - toJsDate(b.treatment_date));
}

// Trim all string values in an object
// obj: an object
export function trimAllString(obj) {
    for (const key in obj)
        if (typeof (obj[key]) === "string")
            obj[key] = obj[key].replace(/^\s+|\s+$/gm, "");
    return obj;
}

// This function is to get a name out of an email address
// email: a string
export function getNameFromEmail(email) {
    return email.substring(0, email.lastIndexOf("@"));
}

// This function is to create a PublicPatient object from a Patient object
// patient: a Patient object
export function createPublicPatient(patient) {
    var publicPatient = publicPatientPlaceholder;
    Object.keys(publicPatient).forEach(key => { publicPatient[key] = patient[key]; });
    return publicPatient;
}

// This function is to convert a custom date object to a date string in form of dd/mm/yyyy
// date: a custom date object ({date: "", month: "", year: ""})
export function toStringDate(date) {
    if ((typeof (date.date) === undefined) || (typeof (date.month) === undefined) || (typeof (date.year) === undefined))
        throw new Error("toStringDate(): Invalid input (expected a custom date)");
    if (date.date === "" || date.month === "" || date.year === "")
        return "";
    return `${parseInt(date.date)}/${mapThaiMonths(date.month)}/${parseInt(date.year) - 543}`;
}

// This function is to sort a patient array by admission or discharge date
// entries: an array containing treatment objects
export function sortPatientByDate(patients, dateType) {
    if (!Array.isArray(patients)) throw new Error("sortPatientByDate(): Invalid input (expected an array)");
    return patients.sort((a, b) => toJsDate(a[dateType][dateType + "_date"]) - toJsDate(b[dateType][dateType + "_date"]));
}

// This function is to return an array containing year numbers from <range> to the current year
// range: an integer
export function getCurrentYearRange(range) {
    // Get current year (in Buddhist Era)
    const currYear = new Date().getFullYear() + 543;
    // Populate the array with the past <range> year numbers
    const output = [];
    for (var i = 0; i <= range; i++)
        output.push(currYear - i);
    return output;
}

// This function is to return an array containing date from 1 to 31
export function getDateInMonth() {
    // Populate the array with dates
    const output = [];
    for (var i = 1; i <= 31; i++)
        output.push(i);
    return output;
}

const helper = {};

export default helper;
