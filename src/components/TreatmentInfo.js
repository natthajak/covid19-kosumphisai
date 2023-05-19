import { Loading } from "./Loading";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PatientInfoBrief } from "./PatientInfoBrief";
import { Card, Button, Table } from "react-bootstrap";
import { usePatient } from "../contexts/PatientContext";

const buildTreatmentTable = patient => {
    // Check if the timeline entries array is empty
    if (patient.treatment_entries.length === 0)
        return <div className="text-center">
            <h2 className="m-0">ไม่มีข้อมูล</h2>
            เลือก "เพิ่มรายการการดูแล" เพื่อเพิ่มข้อมูล
        </div>

    return <>
        <Table bordered hover responsive>
            <thead className="text-center">
                <tr className="table-dark">
                    <th>วันที่</th>
                    <th>ประเภทการดูแล</th>
                    <th>T</th>
                    <th>P</th>
                    <th>R</th>
                    <th>BP บน</th>
                    <th>BP ล่าง</th>
                    <th>SpO2</th>
                    <th>ประเมินผล</th>
                    <th>หมายเหตุ</th>
                    <th>ตัวเลือก</th>
                </tr>
            </thead>
            <tbody>
                {
                    patient.treatment_entries.map((treatment, index) => {
                        return (
                            <tr key={index}>
                                <td className="text-center">{`${treatment.treatment_date.date} ${treatment.treatment_date.month} ${treatment.treatment_date.year}`}</td>
                                <td className="text-center">{treatment.treatment_type}</td>
                                <td className={treatment.temperature >= 37.5 ? "text-center text-danger" : "text-center"}>{treatment.temperature}</td>
                                <td className="text-center">{treatment.pulse}</td>
                                <td className={treatment.heart_rate >= 24 ? "text-center text-danger" : "text-center"} >{treatment.heart_rate}</td>
                                <td className="text-center">{treatment.top_blood_pressure}</td>
                                <td className="text-center">{treatment.bottom_blood_pressure}</td>
                                <td className="text-center">{treatment.oxygen_level}</td>
                                <td className="text-center">{treatment.assessment}</td>
                                <td className="text-center">{treatment.note}</td>
                                <td className="text-center"><Link to={`/patients/treatments/edit/${patient._id}/${treatment.treatmentId}`}><Button className="p-0 h-100" variant="warning" style={{ fontSize: "20px", minWidth: "80px" }}>แก้ไข</Button></Link></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
        <h5>หมายเหตุ: T=Temperature, P=Pulse, R=Respiratory rate, BP=Blood pressure</h5>
    </>
};

export const TreatmentInfo = () => {
    const [patient, setPatient] = useState();
    const { _id } = useParams();
    const { patients } = usePatient();

    useEffect(() => {
        setPatient(patients.filter(patient => patient._id === _id)[0]);
    }, [_id, patients]);

    if (!patient) {
        return <Loading />
    }

    return (
        <div className="h-auto py-5 px-3">
            <h1 className="text-center mb-5">การดูแลหลังการจำหน่าย</h1>
            <h2 className="text-center mb-5">{`${patient.name_prefix} ${patient.first_name} ${patient.last_name}`}</h2>
            <PatientInfoBrief patient={patient} />
            <div className="my-3">
                <Link to={`/patients/treatments/add/${_id}`}><Button variant="success">เพิ่มรายการการดูแล</Button></Link>
            </div>
            <Card className="py-3 card-form shadow-sm">
                <Card.Body>
                    {buildTreatmentTable(patient)}
                </Card.Body>
            </Card>
            <div className="my-3 text-center">
                <Link to={`/patients/info/${_id}`}><Button variant="secondary">ย้อนกลับ</Button></Link>
            </div>
        </div>
    )
}
