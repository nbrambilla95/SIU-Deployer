# SIU-Deployer

SIU-Deployer es una aplicación construida con Electron para facilitar el despliegue y la administración del Ecosistema SIU.

## Instalación

Para instalar y ejecutar SIU-Deployer, sigue estos pasos:

### Requisitos Previos

Asegúrate de tener instalado Git en tu sistema para clonar el repositorio. Además, necesitarás Node.js, que instalaremos usando NVM (Node Version Manager) para manejar fácilmente las versiones de Node.js.

### Paso 1: Instalar NVM y Node.js

Ejecuta el siguiente comando para instalar NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Después de instalar NVM, reinicia tu terminal y ejecuta los siguientes comandos para cargar NVM y verificar su instalación:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
command -v nvm
```

Ahora, instala la versión más reciente de Node.js con NVM:

```bash
nvm install node
```

Verifica que Node.js está instalado correctamente revisando su versión:

```bash
node -v
```
