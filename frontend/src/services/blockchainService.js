import api from "./api";

export const proceedBlockchain = async (evidenceId) => {

    const response = await api.post(

        `/evidence/${evidenceId}/proceed`

    );

    return response.data;

};

export const cancelBlockchain = async (evidenceId) => {

    const response = await api.post(

        `/evidence/${evidenceId}/cancel`

    );

    return response.data;

};