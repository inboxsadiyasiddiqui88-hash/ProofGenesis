import api from "./api";

export const createCase = async (caseData) => {

    const response = await api.post("/create-case", caseData);

    return response.data;

};

export const getCases = async () => {

    const response = await api.get("/cases");

    return response.data;

};