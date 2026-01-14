# Identity Validation App

Aplicación frontend desarrollada en **React + TypeScript** que gestiona un flujo completo de **validación de identidad**, incluyendo captura de fotos por pasos, validación biométrica y visualización del resultado (aprobado / rechazado).

El proyecto está pensado para ejecutarse en entornos web modernos y puede integrarse con servicios externos de validación de identidad.

---

## 🚀 Tecnologías

* **React 18**
* **TypeScript**
* **Vite**
* **React Router DOM**
* **SCSS (Sass)**
* **Context API**
* **MediaPipe (detección / cámara)**
* **Cloudinary (opcional para uploads)**

---

## 📂 Estructura del proyecto

```bash
src/
├── auth/                 # Contexto y servicios de autenticación
│   ├── AuthContext.tsx
│   ├── auth.service.ts
│   └── ProtectecRoute.tsx|   
│
├── context/              # Contextos globales (ej: fotos)
│   └── PhotoContext.tsx
│
├── components/           # Componentes reutilizables
│   └── WebCamera.tsx
│
├── pages/                # Pantallas principales
│   ├── Capture/
│   │   ├── Capture.tsx
│   │   └── Capture.scss
│   ├── Home/
│   │   ├── Home.tsx
│   │   └── Home.scss
│   ├── IdentityError/
│   │   ├── IdentityError.tsx
│   │   └── IdentityError.scss
│   ├── IdentitySucess/
│   │   ├── IdentitySucess.tsx
│   │   └── IdentitySucess.scss
│   ├── IdentityVerification/
│   │   ├── IdentityVerification.tsx
│   │   └── IdentityVerification.scss
│   └── StartValidation/
│       ├── StartValidation.tsx
│       └── StartValidation.scss
│
├── routes/               # Configuración de rutas
│   └── AppRoutes.tsx
│
├── App.tsx               # Providers globales
└── main.tsx              # Punto de entrada
```

---

## 🔐 Contextos principales

### AuthContext

Gestiona el estado de aprobación del usuario tras la validación:

* `isApproved`
* `approve(result)`
* `logout()`

Trae los datos del usuario después de la validacion:

* `identityResult`

Se utiliza para controlar acceso a pantallas y mostrar información según el estado de validación.

### PhotoContext

Administra las fotos capturadas en cada paso del proceso:

* Paso 1
* Paso 2
* Paso 3

Cada imagen se guarda como `Blob` y se asocian a un `userId`.

---

## 🧭 Rutas principales

```text
/                         → Inicio del proceso
/capture                  → Captura de fotos
/identity-verification    → Validación por parte del backend
/identity-sucess          → Resultado de validación exitosa (protegida)
/identity-error           → Error en la validación
/home                     → Home después de la validación (protegida)
```

Las rutas protegidas dependen del estado `isApproved`.

---

## ✅ Flujo de validación

1. Inicio del proceso
2. Captura de fotos (frontal / documento / selfie)
3. Envío a API de validación
4. Recepción del resultado
5. Según resultado se visualiza pantalla de éxito o error
6. Si resultado es exitoso, se permite ir al home

---

## 🎨 Estilos

* Se utiliza **SCSS anidado**
* Convención de nombres: BEM
* First-mobile

---


## ▶️ Ejecutar el proyecto

```bash
npm install
npm run dev
```

Abrir en el navegador:

```
http://localhost:5173
```

---

## 🧪 Desarrollo

* React Strict Mode habilitado
* ESLint recomendado
* Separación clara entre lógica, vista y estilos

---

## 🚀 Instrucciones de ejecución

### Requisitos previos

* Node.js >= 18
* npm o yarn

### Pasos para ejecutar el proyecto en local

```bash
# Clonar el repositorio
git clone https://github.com/lccardenasma96/identity-validation

# Entrar al proyecto
cd identity-validation

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación se ejecutará por defecto en:

```
http://localhost:5173
```

---

## 🧠 Decisiones técnicas

### React + TypeScript

Se utiliza React con TypeScript para asegurar tipado fuerte, mejor mantenibilidad y detección temprana de errores.

### Context API

Se implementan contextos (`AuthContext`, `PhotoContext`) para manejar estado global como autenticación y fotos por pasos.

### React Router

Permite separar flujos (éxito, error, validación) y pasar información entre pantallas usando `location.state`.

### SCSS + BEM

SCSS facilita la anidación y BEM garantiza clases escalables, legibles y sin colisiones.

### Arquitectura

Separación clara entre componentes, contextos, servicios y rutas para mejorar escalabilidad y mantenimiento.
