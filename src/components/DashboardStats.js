import { smallMedia } from "../config";
import { useMediaQuery } from "react-responsive";
import { Container, Card, Table } from "react-bootstrap";
import { usePublicPatient } from "../contexts/PublicPatientContext";
import { Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, ResponsiveContainer, BarChart } from "recharts";

// Display percentage on the pie chart
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

function buildAgeCountTable(maleAgeCnt, femaleAgeCnt) {
    return Array(11).fill(0).map((temp, index) => {
        var range = `${index * 10 + 1}-${index * 10 + 10}`;
        if (index === 0) {
            range = "ต่ำกว่า 10";
        } else if (index === 10) {
            range = "มากกว่า 100";
        }

        const currMaleAgeCnt = maleAgeCnt[index];
        const currFemaleAgeCnt = femaleAgeCnt[index];
        const sum = currMaleAgeCnt + currFemaleAgeCnt;
        const malePercentage = sum === 0 ? 0 : (currMaleAgeCnt / sum * 100).toFixed(2);
        const femalePercentage = sum === 0 ? 0 : (currFemaleAgeCnt / sum * 100).toFixed(2);

        return (
            <tr key={index}>
                <td>{range}</td>
                <td>{currMaleAgeCnt}</td>
                <td>{currFemaleAgeCnt}</td>
                <td>{sum}</td>
                <td>{malePercentage}</td>
                <td>{femalePercentage}</td>
            </tr>
        )
    })
};

export const DashboardStats = () => {
    const { publicPatients } = usePublicPatient();

    // Media query
    const isSmall = useMediaQuery(smallMedia);

    // Counters
    var malePatientCnt = 0;
    var femalePatientCnt = 0;
    var patientTypeCnt = [0, 0, 0];
    var maleAgeCnt = Array(11).fill(0);
    var femaleAgeCnt = Array(11).fill(0);

    // Count the patients
    publicPatients.forEach(patient => {
        // Count by sex
        if (patient.sex === "ชาย")
            malePatientCnt++;
        else if (patient.sex === "หญิง")
            femalePatientCnt++;

        // Count by patient types
        if (patient.patient_type === "ผู้ป่วยขอกลับมารักษา")
            patientTypeCnt[0]++;
        else if (patient.patient_type === "ผู้ป่วยอยู่ระหว่างการกักตัว")
            patientTypeCnt[1]++;
        else if (patient.patient_type === "มีประวัติสัมผัสผู้ป่วย/ตรวจเชิงรุก")
            patientTypeCnt[2]++;
        else
            console.log(`${patient.patient_type} is not a valid value`); // Invalid value

        // Count by age ranges
        const age = parseInt(patient.age);
        if (age < 10)
            patient.sex === "ชาย" ? maleAgeCnt[0]++ : femaleAgeCnt[0]++;
        else if (age <= 14)
            patient.sex === "ชาย" ? maleAgeCnt[1]++ : femaleAgeCnt[1]++;
        else if (age <= 19)
            patient.sex === "ชาย" ? maleAgeCnt[2]++ : femaleAgeCnt[2]++;
        else if (age <= 29)
            patient.sex === "ชาย" ? maleAgeCnt[3]++ : femaleAgeCnt[3]++;
        else if (age <= 39)
            patient.sex === "ชาย" ? maleAgeCnt[4]++ : femaleAgeCnt[4]++;
        else if (age <= 49)
            patient.sex === "ชาย" ? maleAgeCnt[5]++ : femaleAgeCnt[5]++;
        else if (age <= 59)
            patient.sex === "ชาย" ? maleAgeCnt[6]++ : femaleAgeCnt[6]++;
        else if (age <= 69)
            patient.sex === "ชาย" ? maleAgeCnt[7]++ : femaleAgeCnt[7]++;
        else if (age <= 79)
            patient.sex === "ชาย" ? maleAgeCnt[8]++ : femaleAgeCnt[8]++;
        else if (age <= 89)
            patient.sex === "ชาย" ? maleAgeCnt[9]++ : femaleAgeCnt[9]++;
        else if (age <= 99)
            patient.sex === "ชาย" ? maleAgeCnt[10]++ : femaleAgeCnt[10]++;
        else // >= 100
            patient.sex === "ชาย" ? maleAgeCnt[11]++ : femaleAgeCnt[11]++;
    });

    const sumAll = malePatientCnt + femalePatientCnt;

    const male = parseInt((malePatientCnt / sumAll * 100).toFixed([0]))
    const female = parseInt((femalePatientCnt / sumAll * 100).toFixed([0]))

    const data = [
        {
            name: "ชาย",
            value: sumAll === 0 ? 0 : male
        },
        {
            name: "หญิง",
            value: sumAll === 0 ? 0 : female
        },
    ];

    const patientTypeData = [
        {
            name: "ผู้ป่วยขอกลับมารักษา",
            จำนวนผู้ป่วย: patientTypeCnt[0],
        },
        {
            name: "ผู้ป่วยอยู่ระหว่างการกักตัว",
            จำนวนผู้ป่วย: patientTypeCnt[1],
        },
        {
            name: "สัมผัสผู้ป่วย/ตรวจเชิงรุก",
            จำนวนผู้ป่วย: patientTypeCnt[2],
        },
    ]

    return (
        <Card className="text-center my-3 shadow-sm">
            <Card.Body>
                <div className="rounded bg-warning p-2">
                    <h2 className="m-0">ข้อมูลผู้ป่วยติดเชื้อโควิด-19 อำเภอโกสุมพิสัย</h2>
                </div>

                {/* Count able */}
                <Table className="my-3 mx-auto" striped bordered hover responsive size="sm" style={{ maxWidth: "45rem", fontSize: "1.2rem" }}>
                    <thead>
                        <tr className="table-dark">
                            <th>ช่วงอายุ</th>
                            <th>ชาย</th>
                            <th>หญิง</th>
                            <th>รวม</th>
                            <th>ร้อยละชาย</th>
                            <th>ร้อยละหญิง</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buildAgeCountTable(maleAgeCnt, femaleAgeCnt)}
                    </tbody>
                </Table>

                {
                    !isSmall &&
                    <Container className="p-0" style={{ width: "45rem" }}>
                        {/* Bar chart */}
                        <div className="mx-auto border rounded p-3">
                            <h4 className="text-center my-3">จำนวนผู้ป่วยแยกตามประเภท</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    layout="vertical"
                                    data={patientTypeData}
                                >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <XAxis type="number" height={50} />
                                    <YAxis dataKey="name" type="category" scale="band" width={160} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="จำนวนผู้ป่วย" unit=" ราย" barSize={50} fill="#B2485F" label={{ fill: "white", fontSize: "1.2rem" }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie chart */}
                        <div className="mx-auto border rounded p-3 my-3" style={{ fontSize: "1.2rem" }}>
                            <h4 className="text-center my-3">อัตราส่วนผู้ป่วย ชาย หญิง</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Legend />
                                    <Pie
                                        data={data}
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={110}
                                        fill="#8884d8"
                                        dataKey="value"
                                        isAnimationActive={false}
                                    >
                                        <Cell fill="#1094d8" />
                                        <Cell fill="#FF9AA2" />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Container>
                }
            </Card.Body>
        </Card >
    )
}
