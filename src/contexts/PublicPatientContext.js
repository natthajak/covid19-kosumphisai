import { db } from "../firebase";
import { Loading } from "../components/Loading";
import { createContext, useContext, useState, useEffect } from "react";

const PublicPatientContext = createContext();

function usePublicPatient() {
    return useContext(PublicPatientContext);
}

function PublicPatientProvider({ children }) {
    const [publicPatients, setPublicPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const ref = db.collection("public_patients");

    function addPublicPatient(newPublicPatient) {
        return ref.add(newPublicPatient);
    }

    function deletePublicPatient(_id) {
        return ref.doc(_id).delete();
    }

    // fields: an object containing fields and values that need to be updated
    function updatePublicPatient(_id, fields) {
        return ref.doc(_id).update(fields);
    }

    const value = {
        publicPatients,
        addPublicPatient,
        deletePublicPatient,
        updatePublicPatient
    };

    useEffect(() => {
        // Get Public Patients
        setLoading(true);
        const unsubscribe = db.collection("public_patients").onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                items.push({ ...doc.data(), _id: doc.id });
            });
            setPublicPatients(items);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <PublicPatientContext.Provider value={value}>
            {loading ? <Loading /> : children}
        </PublicPatientContext.Provider>
    );
}

export { PublicPatientProvider, usePublicPatient };