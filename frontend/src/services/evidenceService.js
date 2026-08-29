import api from "./api";

export const uploadEvidence = async (caseId, formData) => {

    const response = await api.post(

        `/upload/${caseId}`,

        formData,

        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

    );

    return response.data;

};

export const getEvidence = async () => {

    const response = await api.get("/evidence");

    return response.data;

};