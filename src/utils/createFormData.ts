const formData = new FormData();

const createFormData = (userId:number, frontId:Blob, backId:Blob, selfie:Blob) => {
    formData.append("user_id", String(userId));
    formData.append("cedula_frente", frontId);
    formData.append("cedula_reverso", backId);
    formData.append("selfie", selfie);
    console.log("FormData entries:", formData.getAll("user_id"), formData.getAll("cedula_frente"), formData.getAll("cedula_reverso"), formData.getAll("selfie"));
    return formData;

};

export default createFormData;
