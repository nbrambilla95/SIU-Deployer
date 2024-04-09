#!/bin/bash 
#Debugging instance ON
set -x

# opt proyectos variables
export PROJECT="/opt/proyectos/kolla"

# Obtiene el directorio actual donde se encuentra el script

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Ejecutar composer install en el directorio del proyecto sin interacción
composer install --no-interaction --working-dir=$PROJECT

# Armar el archivo de configuracion env a partir del template
cd $PROJECT && cp instalador.env.dist instalador.env

# Editar el archivo de configuracion env
# con las variables correspondientes
PROYECTO_DB_HOST="PROYECTO_DB_HOST"
PROYECTO_DB_PORT="5432"
PROYECTO_DB_DBNAME="PROYECTO_DB_DBNAME"
PROYECTO_DB_USERNAME="PROYECTO_DB_USERNAME"
PROYECTO_DB_PASSWORD="PROYECTO_DB_PASSWORD"
TOBA_DB_HOST="TOBA_DB_HOST"
TOBA_DB_PORT="TOBA_DB_PORT"
TOBA_DB_DBNAME="TOBA_DB_DBNAME"
TOBA_DB_USERNAME="TOBA_DB_USERNAME"
TOBA_DB_PASSWORD="TOBA_DB_PASSWORD"
TOBA_PROYECTO_DIR="/opt/proyectos/kolla"
TOBA_INSTALACION_DIR="/opt/proyectos/kolla/instalacion"
TOBA_ALIAS_NUCLEO="/toba_kolla"
TOBA_ALIAS_TOBA_USUARIOS="/kolla_toba_usuarios"

INSTALADOR_ENV="$PROJECT/instalador.env"

sed -i "s/PROYECTO_DB_HOST=".*"/PROYECTO_DB_HOST=\"$PROYECTO_DB_HOST\"/" $INSTALADOR_ENV
sed -i "s/PROYECTO_DB_PORT=[^,]*/PROYECTO_DB_PORT=\"$PROYECTO_DB_PORT\"/" $INSTALADOR_ENV
sed -i "s/PROYECTO_DB_DBNAME=".*"/PROYECTO_DB_DBNAME=\"$PROYECTO_DB_DBNAME\"/" $INSTALADOR_ENV
sed -i "s/PROYECTO_DB_USERNAME=".*"/PROYECTO_DB_USERNAME=\"$PROYECTO_DB_USERNAME\"/" $INSTALADOR_ENV
sed -i "s/PROYECTO_DB_PASSWORD=".*"/PROYECTO_DB_PASSWORD=\"$PROYECTO_DB_PASSWORD\"/" $INSTALADOR_ENV
sed -i "s/TOBA_DB_HOST=".*"/TOBA_DB_HOST=\"$TOBA_DB_HOST\"/" $INSTALADOR_ENV
sed -i "s/TOBA_DB_PORT=".*"/TOBA_DB_PORT=\"$TOBA_DB_PORT\"/" $INSTALADOR_ENV
sed -i "s/TOBA_DB_DBNAME=".*"/TOBA_DB_DBNAME=\"$TOBA_DB_DBNAME\"/" $INSTALADOR_ENV
sed -i "s/TOBA_DB_USERNAME=".*"/TOBA_DB_USERNAME=\"$TOBA_DB_USERNAME\"/" $INSTALADOR_ENV
sed -i "s/TOBA_DB_PASSWORD=".*"/TOBA_DB_PASSWORD=\"$TOBA_DB_PASSWORD\"/" $INSTALADOR_ENV
sed -i "s~#TOBA_PROYECTO_DIR=".*"~TOBA_PROYECTO_DIR=\"$TOBA_PROYECTO_DIR\"~" $INSTALADOR_ENV
sed -i "s~#TOBA_INSTALACION_DIR=".*"~TOBA_INSTALACION_DIR=\"$TOBA_INSTALACION_DIR\"~" $INSTALADOR_ENV
sed -i "s~TOBA_ALIAS_NUCLEO=".*"~TOBA_ALIAS_NUCLEO=\"$TOBA_ALIAS_NUCLEO\"~" $INSTALADOR_ENV
sed -i "s~TOBA_ALIAS_TOBA_USUARIOS=".*"~TOBA_ALIAS_TOBA_USUARIOS=\"$TOBA_ALIAS_TOBA_USUARIOS\"~" $INSTALADOR_ENV

# Otorgar permiso de ejecucion al instalador
cd $PROJECT && chmod +x $PROJECT/bin/instalador

# Ejecutar el instalador del bin
cd $PROJECT && ./bin/instalador proyecto:instalar 

# Cambiar el propietario y el grupo de los directorios
chown -R www-data:www-data $PROJECT/*
