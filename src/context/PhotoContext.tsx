import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

/* Tipos */
export type Step = 1 | 2 | 3;

export interface PhotosState {
  userId: number | null;
  step1: string | null;
  step2: string | null;
  step3: string | null;
}

interface PhotoContextType {
  setUserId: (id: number) => void;
  photos: PhotosState;
  currentStep: Step;
  setPhotoByStep: (step: Step, photo: string | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetPhotos: () => void;
}

/* Estado inicial */
const initialPhotos: PhotosState = {
  userId: null,
  step1: null,
  step2: null,
  step3: null,
};

/* Context */
const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

/* Provider */
export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<PhotosState>(initialPhotos);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const setUserId = (id: number) => {
    setPhotos((prev) => ({
      ...prev,
      userId: id,
    }));
  }

  const setPhotoByStep = (step: Step, photo: string | null) => {
    setPhotos((prev) => ({
      ...prev,
      [`step${step}`]: photo,
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => (prev < 3 ? (prev + 1) as Step : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? (prev - 1) as Step : prev));
  };

  const resetPhotos = () => {
    setPhotos(initialPhotos);
    setCurrentStep(1);
  };

  return (
    <PhotoContext.Provider
      value={{
        setUserId,
        photos,
        currentStep,
        setPhotoByStep,
        nextStep,
        prevStep,
        resetPhotos,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

/* Hook personalizado */
export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error("usePhotos debe usarse dentro de PhotoProvider");
  }
  return context;
};
