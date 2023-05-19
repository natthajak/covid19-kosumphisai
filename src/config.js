export const ddcApiUrl = "https://covid19.ddc.moph.go.th/api/Cases/timeline-cases-all";

export const smallMedia = {
    query: "(max-width: 568px)"
};

export const mediumMedia = {
    query: "(max-width: 1024px)"
};

export const namePrefix = [
    "นาย",
    "นาง",
    "นางสาว"
];

export const sexTypes = [
    "ชาย",
    "หญิง"
];

export const patientTypes = [
    "ผู้ป่วยขอกลับมารักษา",
    "ผู้ป่วยอยู่ระหว่างการกักตัว",
    "มีประวัติสัมผัสผู้ป่วย/ตรวจเชิงรุก"
];

export const firstTreatmentList = [
    "โรงพยาบาล",
    "โรงพยาบาลสนาม",
    "ศูนย์พักคอยอำเภอ",
    "Home Isolation",
    "ศูนย์พักคอยตำบล"
];

export const lastTreatmentList = [
    "โรงพยาบาล",
    "โรงพยาบาลสนาม",
    "ศูนย์พักคอยอำเภอ",
    "Home Isolation",
    "ศูนย์พักคอยตำบล",
    "Local Quarantine(LQ) หรือ Home Quarantine(HQ)",
    "ไม่ทราบ/ออกนอกพื้นที่"
];

export const treatmentTypes = [
    "Step down ใน CI ตำบล",
    "Step down HI",
    "Local Quarantine (LQ)",
    "Home Quarantine (HQ)"
];

export const treatmentAssessments = [
    "ปกติ",
    "ผิดปกติ/รายงานแพทย์",
    "ส่งต่อ",
    "จำหน่ายครบ 14 วัน"
];

export const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
];

export const atkTestResults = [
    "ไม่ได้ตรวจ",
    "ผลลบ",
    "ผลบวก"
];

export const patientPlaceholder = {
    id_card_number: "",
    district_number: "",
    province_number: "",
    year: "",
    month: "",
    month_number: "",
    name_prefix: "",
    first_name: "",
    last_name: "",
    sex: "",
    dob: { date: "", month: "", year: "" },
    age: "",
    address: "",
    current_address: "",
    occupation: "",
    workplace: "",
    phone_number: "",
    patient_type: "",
    note: "",
    atk1_date: { date: "", month: "", year: "" },
    atk1_result: "",
    atk2_date: { date: "", month: "", year: "" },
    atk2_result: "",
    pcrDate: { date: "", month: "", year: "" },
    pcr_ct: "",
    timeline_entries: [],
    admission: { admission_date: { date: "", month: "", year: "" }, first_treatment: "" },
    discharge: { discharge_date: { date: "", month: "", year: "" }, last_treatment: "", treatment_duration: "" },
    treatment_entries: [],
    public_patient_id: "",
    createdAt: "",
    createdBy: "",
    lastUpdate: "",
    updatedBy: ""
};

export const timelinePlaceholder = {
    date_type: "1",
    date_begin: { date: "", month: "", year: "" },
    date_end: { date: "", month: "", year: "" },
    activity: "",
    timeline_id: ""
};

export const treatmentPlaceholder = {
    treatment_date: { date: "", month: "", year: "" },
    treatment_type: "",
    temperature: "",
    pulse: "",
    heart_rate: "",
    top_blood_pressure: "",
    bottom_blood_pressure: "",
    oxygen_level: "",
    assessment: "",
    note: "",
    treatmentId: ""
};

export const publicPatientPlaceholder = {
    createdAt: "",
    lastUpdate: "",
    province_number: "",
    district_number: "",
    year: "",
    month: "",
    month_number: "",
    sex: "",
    age: "",
    patient_type: "",
    timeline_entries: []
};