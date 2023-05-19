import { Loading } from "./Loading";
import { smallMedia } from "../config";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useParams } from "react-router-dom";
import { PatientInfoBrief } from "./PatientInfoBrief";
import { Card, Button, Table } from "react-bootstrap";
import { usePatient } from "../contexts/PatientContext";

const buildTimelineTable = patient => {
    // Check if the timeline entries array is empty
    if (patient.timeline_entries.length === 0)
        return <div className="text-center">
            <h2 className="m-0">ไม่มีข้อมูล</h2>
            เลือก "เพิ่ม Timeline" เพื่อเพิ่มข้อมูล
        </div>

    return <Table bordered hover responsive>
        <thead className="text-center">
            <tr className="table-dark">
                <th>ลำดับที่</th>
                <th>วันที่</th>
                <th>รายละเอียดการเดินทาง</th>
                <th>ตัวเลือก</th>
            </tr>
        </thead>
        <tbody>
            {
                patient.timeline_entries.map((timeline, index) => {
                    return (
                        <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center" style={{ whiteSpace: "pre" }}>
                                {
                                    timeline.date_type === "1" ?
                                        `${timeline.date_begin.date} ${timeline.date_begin.month} ${timeline.date_begin.year}`
                                        :
                                        <>
                                            <div>{`จาก: ${timeline.date_begin.date} ${timeline.date_begin.month} ${timeline.date_begin.year}`}</div>
                                            <div>{`ถึง: ${timeline.date_end.date} ${timeline.date_end.month} ${timeline.date_end.year}`}</div>
                                        </>
                                }
                            </td>
                            <td style={{ whiteSpace: "pre-wrap" }}>{timeline.activity}</td>
                            <td className="text-center"><Link to={`/patients/timelines/edit/${patient._id}/${timeline.timeline_id}`}><Button className="p-0 h-100" variant="warning" style={{ fontSize: "20px", minWidth: "80px" }}>แก้ไข</Button></Link></td>
                        </tr>
                    )
                })
            }
        </tbody>
    </Table>
};

export const TimelineInfo = () => {
    const [patient, setPatient] = useState();
    const { _id } = useParams();
    const { patients } = usePatient();

    // Media query
    const isSmall = useMediaQuery(smallMedia);

    useEffect(() => {
        setPatient(patients.filter(patient => patient._id === _id)[0]);
    }, [_id, patients]);

    if (!patient) {
        return <Loading />
    }

    return (
        <div className="h-auto py-5 px-3">
            <h1 className="text-center mb-5">Timelines</h1>
            <h2 className="text-center mb-5">{`${patient.name_prefix} ${patient.first_name} ${patient.last_name}`}</h2>
            <PatientInfoBrief patient={patient} />
            <div className="my-3">
                <Link to={`/patients/timelines/add/${_id}`}><Button variant="success" >เพิ่ม Timeline</Button></Link>
                <Link to={`/patients/timelines/print/${_id}`} className={patient.timeline_entries.length === 0 ? "disabled-link" : undefined}><Button className={isSmall ? "" : "mx-3"} variant="primary" disabled={patient.timeline_entries.length === 0}>พิมพ์ Timeline</Button></Link>
            </div>
            <Card className="py-3 card-form shadow-sm">
                <Card.Body>
                    {buildTimelineTable(patient)}
                </Card.Body>
            </Card>
            <div className="my-3 text-center">
                <Link to={`/patients/info/${_id}`}><Button variant="secondary">ย้อนกลับ</Button></Link>
            </div>
        </div>
    )
}
