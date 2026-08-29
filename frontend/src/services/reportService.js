import api from "./api";

export const getForensicReport = async (

    evidenceId

) => {

    const response = await api.get(

        `/forensic-report/${evidenceId}`

    );

    return response.data;

};