import axios from "axios";
import { IconContext } from "react-icons";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { ddcApiUrl, smallMedia } from "../config";
import { Card, Container, Spinner, Row, Col, Alert } from "react-bootstrap";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

export const DdcApi = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [apiData, setApiData] = useState();
    const [apiData15, setApiData15] = useState();

    // Media query
    const isSmall = useMediaQuery(smallMedia);

    useEffect(() => {
        setLoading(true);
        var unmounted = false;

        const source = axios.CancelToken.source();
        const timeout = 5000; // Timeout 5 seconds

        // Get the data
        axios(ddcApiUrl, { timeout: timeout, cancelToken: source.token })
            .then(res => {
                // Make sure the component is not unmounted
                if (!unmounted) {
                    setApiData(res.data.slice(-1)[0]);
                    setApiData15(res.data.slice(1).slice(-30));
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!unmounted) {
                    setError("ไม่สามารถเรียกข้อมูลได้ กรุณาลองใหม่อีกครั้งในภายหลัง")
                    setLoading(false);
                    console.log(err);
                }
            });

        return () => {
            unmounted = true;
            source.cancel("Cancelling in cleanup");
        };
    }, []);

    return (
        <Card className="text-center my-3 shadow-sm">
            <Card.Body>
                <div className="rounded bg-warning p-2">
                    <h2 className="m-0">ข้อมูลสถานการณ์โควิด-19 ในประเทศไทย</h2>
                </div>

                {
                    loading ?
                        <div className="mt-4 text-center">
                            <Spinner animation="border" role="status" variant="primary"></Spinner>
                        </div>
                        :
                        error ?
                            <div className="mt-3"> <Alert className="m-0" variant="info">{error}</Alert></div>
                            :
                            <IconContext.Provider value={{ size: "3rem" }}>
                                <Container id="dashboard">
                                    <div className="mt-3">
                                        <div>ข้อมูลจาก covid19.ddc.moph.go.th</div> <div>วันที่อัพเดทล่าสุด  : {apiData.txn_date}</div>
                                    </div>

                                    {/* Stats from API */}
                                    <Row>
                                        <Col sm={true}>
                                            <Card className="my-3">
                                                <h4 className="card-header bg-danger text-white">จำนวนผู้ติดเชื้อรายใหม่</h4>
                                                <div className="py-3">
                                                    <h2>{`${apiData.new_case.toLocaleString()} คน`}</h2>
                                                </div>
                                            </Card>
                                            <Card className="my-3">
                                                <h4 className="card-header bg-danger text-white">จำนวนผู้ติดเชื้อสะสม</h4>
                                                <div className="py-3">
                                                    <h2>{`${apiData.total_case.toLocaleString()} คน`}</h2>
                                                </div>
                                            </Card>
                                        </Col>

                                        <Col sm={true}>
                                            <Card className="my-3">
                                                <h4 className="card-header bg-dark text-white">จำนวนผู้เสียชีวิตรายใหม่</h4>
                                                <div className="py-3">
                                                    <h2>{`${apiData.new_death.toLocaleString()} คน`}</h2>
                                                </div>
                                            </Card>
                                            <Card className="my-3">
                                                <h4 className="card-header bg-dark text-white">จำนวนผู้เสียสะสม</h4>
                                                <div className="py-3">
                                                    <h2>{`${apiData.total_death.toLocaleString()} คน`}</h2>
                                                </div>
                                            </Card>
                                        </Col>

                                        <Col sm={true}>
                                            <Card className="my-3">
                                                <h4 className="card-header bg-success text-white">รักษาหาย</h4>
                                                <div className="py-3">
                                                    <h2>{`${apiData.new_recovered.toLocaleString()} คน`}</h2>
                                                </div>
                                            </Card>
                                            <Card className="my-3">
                                                <h4 className="card-header bg-success text-white">รักษาหายสะสม</h4>
                                                <div className="py-3">
                                                    <h2>{`${apiData.total_recovered.toLocaleString()} คน`}</h2>
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>

                                    {/* Graph */}
                                    {
                                        !isSmall &&
                                        <Row>
                                            <h2 className="my-3">กราฟแสดงจำนวนผู้ติดเชื้อโควิด-19 ย้อนหลัง 30 วัน</h2>
                                            <Col sm={true}>
                                                <ResponsiveContainer width="100%" height={500}>
                                                    <LineChart width={730} height={250} data={apiData15}
                                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="txn_date" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Line
                                                            isAnimationActive={false}
                                                            name="ผู้ติดเชื้อรายใหม่"
                                                            dataKey="new_case"
                                                            stroke="#E74C3C"
                                                            legendType="circle"
                                                            strokeWidth={2}
                                                            unit=" ราย" />
                                                        <Line
                                                            isAnimationActive={false}
                                                            name="รักษาหาย"
                                                            dataKey="new_recovered"
                                                            stroke="#1E8449"
                                                            legendType="circle"
                                                            strokeWidth={2}
                                                            unit=" ราย" />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </Col>
                                        </Row>
                                    }
                                </Container>
                            </IconContext.Provider>
                }
            </Card.Body>
        </Card >
    )
}