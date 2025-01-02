# SIU-Deployer

## Introducción

**SIU-Deployer** es una herramienta automatizada diseñada para simplificar el despliegue y la actualización de módulos del Ecosistema SIU, como Guaraní y Kolla. Utiliza una interfaz gráfica basada en Electron y scripts automatizados en Bash y Expect, reduciendo significativamente el tiempo y los errores asociados con procesos manuales.

---

## Requisitos Previos

Antes de iniciar, asegúrate de cumplir con los siguientes requisitos:

### Para el desarrollo

1. **Sistema Operativo**: Ubuntu 18.04 o superior (compatible con distribuciones basadas en Linux).
2. **Dependencias necesarias**:
   - PHP 7.4 con módulos adicionales (pgsql, gd, curl, etc.).
   - Apache2 con soporte para módulos como `mod_rewrite`.
   - PostgreSQL configurado para los módulos requeridos.
   - Composer (gestor de dependencias de PHP).
   - Yarn (gestor de paquetes para frontend).
   - Node.js para ejecutar aplicaciones en Electron.
3. **Repositorios**:
   - Acceso al repositorio privado del SIU para obtener los módulos.
   - Permisos en el sistema para ejecutar scripts con privilegios elevados.

---

## Instalación

### Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/SIU-Deployer.git
cd SIU-Deployer
```

### Instalar Dependencias
Ejecuta los siguientes comandos para instalar las dependencias necesarias:
```bash
npm install
npm run dist
```

Esto generará un archivo ejecutable en el directorio `dist/`.

---

## Ejecución

Para iniciar la aplicación, ejecuta el siguiente comando desde el directorio generado:
```bash
./dist/siu-deployer-1.0.1.AppImage --no-sandbox
```

---

## Funcionalidades de la Aplicación

La interfaz gráfica de **SIU-Deployer** incluye varias funcionalidades distribuidas en botones y secciones. A continuación, se detalla cada una:

### 1. **Selección de Directorio**
- **Descripción**: Al iniciar la aplicación, aparecerá una ventana para seleccionar el directorio donde se instalarán los módulos.
- **Uso**: Selecciona una carpeta en el sistema de archivos que servirá como ruta base para todos los despliegues.

### 2. **Check Pre-Requisites**
- **Descripción**: Verifica que todas las dependencias y configuraciones necesarias estén presentes.
- **Uso**:
  - Haz clic en el botón `Check Pre-Requisites`.
  - La consola mostrará el progreso de la verificación.
  - Si falta alguna dependencia, la consola indicará el paquete necesario.

### 3. **Deploy**
- **Descripción**: Permite desplegar módulos del Ecosistema SIU.
- **Módulos disponibles**:
  - Gestión
  - Autogestión
  - Preinscripción
  - Kolla
- **Uso**:
  - Haz clic en el botón `Deploy`.
  - Selecciona el módulo que deseas desplegar.
  - Introduce los datos solicitados, como nombre de la base de datos, usuario, contraseña, etc.
  - La consola mostrará el progreso del despliegue.

### 4. **Update**
- **Descripción**: Facilita la actualización de módulos a nuevas versiones.
- **Módulos disponibles**:
  - Guaraní (Gestión, Autogestión, Preinscripción).
  - Kolla.
- **Uso**:
  - Haz clic en `Update`.
  - Selecciona el módulo y proporciona los datos solicitados, como la URL del repositorio o el paquete comprimido.

### 5. **Database**
- **Descripción**: Configura las bases de datos necesarias para los módulos.
- **Uso**:
  - Haz clic en `Database`.
  - Completa los campos, como host, puerto, usuario, contraseña, y esquema de las bases de datos.

### 6. **Settings**
- **Descripción**: (Opcional) Configura parámetros globales, como credenciales del repositorio o rutas de acceso.
- **Uso**:
  - Completa las configuraciones para facilitar el acceso a los módulos directamente desde la aplicación.

---

## Ejemplo de Uso

### Desplegar el Módulo Gestión
1. Selecciona el directorio base.
2. Haz clic en `Check Pre-Requisites` y asegura que todo esté configurado.
3. Haz clic en `Deploy` y selecciona `Gestión`.
4. Introduce los datos solicitados (base de datos, usuario, contraseña).
5. Sigue el progreso del despliegue en la consola.

---

## Soporte

Si encuentras problemas durante el uso de la aplicación, verifica:
1. La configuración de tu entorno (PHP, Apache, PostgreSQL).
2. Los permisos del sistema y dependencias instaladas.

Para problemas relacionados con los módulos SIU, consulta la documentación oficial: [SIU Documentación](https://www.siu.edu.ar/).

---

## Contribuciones

Este proyecto es de código abierto. Si deseas contribuir:
1. Haz un fork del repositorio.
2. Crea una nueva rama para tus cambios.
3. Envía un pull request.

---
