import api from "./api";

export const verifyEvidence = async (

    evidenceId,

    formData

) => {

    const response = await api.post(

        `/verify/${evidenceId}`,

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data",

            },

        }

    );

    return response.data;

};