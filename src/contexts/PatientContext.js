import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { Loading } from "../components/Loading";
import { createPublicPatient } from "../helper";
import { publicPatientPlaceholder } from "../config";
import { usePublicPatient } from "./PublicPatientContext";
import { createContext, useContext, useState, useEffect } from "react";

const PatientContext = createContext();

function usePatient() {
    return useContext(PatientContext);
}

function PatientProvider({ children }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const ref = db.collection("patients");
    const { isAuth } = useAuth();
    const { addPublicPatient, deletePublicPatient, updatePublicPatient } = usePublicPatient();

    async function addPatient(newPatient) {
        // Create a new public patient
        const newPublicPatient = createPublicPatient(newPatient);
        // Add the new public patient
        const res = await addPublicPatient(newPublicPatient);
        // Update the public patient id in the patient
        newPatient.public_patient_id = res.id;
        // Add the patient
        return ref.add(newPatient);
    }

    async function deletePatient(_id) {
        // Get the public patient id
        const publicPatientId = patients.find(patient => patient._id === _id).public_patient_id;
        // Delete the public patient
        await deletePublicPatient(publicPatientId);
        // Delete the patient
        return ref.doc(_id).delete();
    }

    // fields: an object containing fields and values that need to be updated
    async function updatePatient(_id, fields) {
        // Get the public patient id
        const publicPatientId = patients.find(patient => patient._id === _id).public_patient_id;
        // Create an object to be populated with fields of the public patient that need to be updated
        const publicFields = {};
        // Populate the public patient fields
        Object.keys(publicPatientPlaceholder).forEach(key => {
            if (fields[key] !== undefined)
                publicFields[key] = fields[key];
        });
        // Update the public patient
        await updatePublicPatient(publicPatientId, publicFields);
        // Update the patient
        return ref.doc(_id).update(fields);
    }

    const value = {
        patients,
        addPatient,
        deletePatient,
        updatePatient
    };

    useEffect(() => {
        // Required auth
        if (!isAuth())
            return setLoading(false);

        // Get Patients
        setLoading(true);
        const unsubscribe = db.collection("patients").onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                items.push({ ...doc.data(), _id: doc.id });
            });
            setPatients(items);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [isAuth]);

    return (
        <PatientContext.Provider value={value}>
            {loading ? <Loading /> : children}
        </PatientContext.Provider>
    );
}

export { PatientProvider, usePatient };