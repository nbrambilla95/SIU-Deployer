#!/bin/bash 
#Debugging instance ON
set -x

# Directorios del modulo Preinscripcion
export SCRIPTS_DIR="$1"
export CONFIG_FILE="$2"
export APACHE_DIR="$3"

export KOLLA="$(jq -r '.selectedPath' "$CONFIG_FILE")/kolla"
echo $KOLLA

# Apache2 directorio para sites-available
export APACHE2_SITES_AVAILABLE="/etc/apache2/sites-available"

# Ejecutar composer install en el directorio del proyecto sin interacción
composer install --no-interaction --working-dir=$KOLLA

# Armar el archivo de configuracion env a partir del template
cd $KOLLA && cp instalador.env.dist instalador.env

# Editar el archivo de configuracion env
# con las variables correspondientes
PROYECTO_DB_HOST="$(jq -r '.database.host' "$CONFIG_FILE")"
PROYECTO_DB_PORT="$(jq -r '.database.port' "$CONFIG_FILE")"
PROYECTO_DB_DBNAME="$(jq -r '.database.kolla.dbname' "$CONFIG_FILE")"
PROYECTO_DB_USERNAME="$(jq -r '.database.kolla.dbusername' "$CONFIG_FILE")"
PROYECTO_DB_PASSWORD="$(jq -r '.database.kolla.dbpassword' "$CONFIG_FILE")"
TOBA_DB_HOST="$(jq -r '.database.host' "$CONFIG_FILE")"
TOBA_DB_PORT="$(jq -r '.database.port' "$CONFIG_FILE")"
TOBA_DB_DBNAME="$(jq -r '.database.kolla.toba_dbname' "$CONFIG_FILE")"
TOBA_DB_USERNAME="$(jq -r '.database.kolla.toba_dbusername' "$CONFIG_FILE")"
TOBA_DB_PASSWORD="$(jq -r '.database.kolla.toba_dbpassword' "$CONFIG_FILE")"
TOBA_PROYECTO_DIR="$KOLLA"
TOBA_INSTALACION_DIR="$KOLLA/instalacion"
TOBA_ALIAS_NUCLEO="/toba_kolla"
TOBA_ALIAS_TOBA_USUARIOS="/kolla_toba_usuarios"

INSTALADOR_ENV="$KOLLA/instalador.env"

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
cd $KOLLA && chmod +x $KOLLA/bin/instalador

# Ejecutar el script de expect para manejar la instalación interactiva de Kolla
"$SCRIPTS_DIR/expect/instalacion-kolla.expect"

# Cambiar el propietario y el grupo de los directorios
chown -R www-data:www-data $KOLLA/*

cp $APACHE_DIR/kolla.conf $APACHE2_SITES_AVAILABLE/kolla.conf
a2ensite kolla.conf
systemctl restart apache2.service