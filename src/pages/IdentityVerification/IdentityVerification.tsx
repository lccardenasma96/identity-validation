import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IdentityVerification.scss";
import { usePhotos } from "../../context/PhotoContext";
import createFormData from "../../utils/createFormData";
import { useAuth } from "../../auth/AuthContext";

interface IdentityVerificationProps {
  progress?: number;
  onBack?: () => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = () => {
  const { photos } = usePhotos();
  const { userId, step1, step2, step3 }: any = photos;
  const navigate = useNavigate();
  const { approve } = useAuth();
  const url_api = "https://mubis.app/api/cedula/validate-complete?user_id="

  createFormData(userId!, step1!, step2!, step3!);
  useEffect(() => {
    async function createPost() {
      try {
        const formData = new FormData();
        formData.append("cedula_frente", step1);
        formData.append("cedula_reverso", step2);
        formData.append("selfie", step3);
        const response = await fetch(
          url_api + userId,
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) {
          alert("Error en la solicitud");
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.result?.approved === true) {
          approve(data.result);
          navigate("/identity-sucess", {
            state: {
              result: data.result
            }
          });
        } else {
          navigate("/identity-error");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    createPost();
  }, []);


  return (<div className="identity-verification">

    <header className="identity-verification-header">
      <button className="identity-verification-header-back-btn" >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
      </button>
      <h2 className="identity-verification-header-title">Verificación de Identidad</h2>
    </header>
    <div className="identity-verification-content">
      <div className="identity-verification-loader">
        <div className="identity-verification-loader-ring identity-verification-loader-ring--bg" />
        <div className="identity-verification-loader-ring identity-verification-loader-ring--spin" />
        <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#137FEC"><path d="M481-781q106 0 200 45.5T838-604q7 9 4.5 16t-8.5 12q-6 5-14 4.5t-14-8.5q-55-78-141.5-119.5T481-741q-97 0-182 41.5T158-580q-6 9-14 10t-14-4q-7-5-8.5-12.5T126-602q62-85 155.5-132T481-781Zm0 94q135 0 232 90t97 223q0 50-35.5 83.5T688-257q-51 0-87.5-33.5T564-374q0-33-24.5-55.5T481-452q-34 0-58.5 22.5T398-374q0 97 57.5 162T604-121q9 3 12 10t1 15q-2 7-8 12t-15 3q-104-26-170-103.5T358-374q0-50 36-84t87-34q51 0 87 34t36 84q0 33 25 55.5t59 22.5q34 0 58-22.5t24-55.5q0-116-85-195t-203-79q-118 0-203 79t-85 194q0 24 4.5 60t21.5 84q3 9-.5 16T208-205q-8 3-15.5-.5T182-217q-15-39-21.5-77.5T154-374q0-133 96.5-223T481-687Zm0-192q64 0 125 15.5T724-819q9 5 10.5 12t-1.5 14q-3 7-10 11t-17-1q-53-27-109.5-41.5T481-839q-58 0-114 13.5T260-783q-8 5-16 2.5T232-791q-4-8-2-14.5t10-11.5q56-30 117-46t124-16Zm0 289q93 0 160 62.5T708-374q0 9-5.5 14.5T688-354q-8 0-14-5.5t-6-14.5q0-75-55.5-125.5T481-550q-76 0-130.5 50.5T296-374q0 81 28 137.5T406-123q6 6 6 14t-6 14q-6 6-14 6t-14-6q-59-62-90.5-126.5T256-374q0-91 66-153.5T481-590Zm-1 196q9 0 14.5 6t5.5 14q0 75 54 123t126 48q6 0 17-1t23-3q9-2 15.5 2.5T744-191q2 8-3 14t-13 8q-18 5-31.5 5.5t-16.5.5q-89 0-154.5-60T460-374q0-8 5.5-14t14.5-6Z" /></svg>
      </div>
      <h4 className="identity-verifitacion-status">Procesando...</h4>
      <h3 className="identity-verifitacion-headline">
        Validando identidad, por favor espere...
      </h3>
      <p className="identity-verifitacion-description">
        Estamos confirmando tus datos de forma segura con la Registraduría
        Nacional de Colombia.
      </p>
    </div>
    <footer className="identity-verifitacion-footer">
      <div className="identity-verifitacion-footer_image">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#617589"><path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" /></svg>
      </div>
      <p className="identity-verifitacion-footer-text">CONEXIÓN SEGURA Y ENCRIPTADA</p>
    </footer>
    <div className="bg-blob bg-blob--top" />
    <div className="bg-blob bg-blob--bottom" />
  </div>
  );
};

export default IdentityVerification;
