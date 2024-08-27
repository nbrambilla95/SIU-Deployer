#!/bin/bash 
#Debugging instance ON
set -x

# Directorios del modulo Autogestion
export SCRIPTS_DIR="$1"
export CONFIG_FILE="$2"
export APACHE_DIR="$3"

export GESTION="$(jq -r '.selectedPath' "$CONFIG_FILE")/gestion"
echo $GESTION

export AUTOGESTION="$(jq -r '.selectedPath' "$CONFIG_FILE")/autogestion"
echo $AUTOGESTION

export EMAIL_AYUDA="$(jq -r '.database.autogestion.email' "$CONFIG_FILE")"
echo $EMAIL_AYUDA

# Apache2 directorio para sites-available
export APACHE2_SITES_AVAILABLE="/etc/apache2/sites-available"

# Armar los archivos de configuracion a partir de los templates
cd $AUTOGESTION/instalacion && cp config_template.php config.php
cd $AUTOGESTION/instalacion && cp login_template.php login.php

DBNAME="$(jq -r '.database.autogestion.dbname' "$CONFIG_FILE")"
SCHEMA="$(jq -r '.database.autogestion.schema' "$CONFIG_FILE")"
SCHEMA_TOBA="$(jq -r '.database.gestion.schema' "$CONFIG_FILE")"
HOST="$(jq -r '.database.host' "$CONFIG_FILE")"
PORT="$(jq -r '.database.port' "$CONFIG_FILE")"
PDO_USER="$(jq -r '.database.autogestion.dbusername' "$CONFIG_FILE")"
PDO_PASSWD="$(jq -r '.database.autogestion.dbpassword' "$CONFIG_FILE")"
CONFIG_PHP="$AUTOGESTION/instalacion/config.php"

sed -i "s/'dbname' => '.*'/'dbname' => '$DBNAME'/" $CONFIG_PHP
sed -i "s/'schema' => '.*'/'schema' => '$SCHEMA'/" $CONFIG_PHP
sed -i "s/'schema_toba' => '.*'/'schema_toba' => '$SCHEMA_TOBA'/" $CONFIG_PHP
sed -i "s/'host' => '.*'/'host' => '$HOST'/" $CONFIG_PHP
sed -i "s/'port' => [^,]*/'port' => $PORT/" $CONFIG_PHP
sed -i "s/'pdo_user' => '.*'/'pdo_user' => '$PDO_USER'/" $CONFIG_PHP
sed -i "s/'pdo_passwd' => '.*'/'pdo_passwd' => '$PDO_PASSWD'/" $CONFIG_PHP

# Cambiar el propietario y el grupo de los directorios
cd $AUTOGESTION && chown -R www-data:www-data instalacion src

# Cambiar los permisos de los directorios especificados a 775
cd $AUTOGESTION && chmod 775 -R instalacion src

# Ejecutar composer install en el directorio del proyecto sin interacción
composer install --no-interaction --working-dir=$AUTOGESTION

# Se agregar 'url3w = "https://<url de Autogestion>"'
# antes del bloque [xslfo] del archivo instalacion.ini de Gestion.
INSTALACION_INI="$GESTION/instalacion/instalacion.ini"
sed -i '/^\[xslfo\]/i url3w = "/autogestion"' $INSTALACION_INI

# Modificar el email de ayuda en el archivo de configuracion config.php
sed -i "s|'email_ayuda' => '',|'email_ayuda' => '$EMAIL_AYUDA',|" $CONFIG_PHP

cp $APACHE_DIR/autogestion.conf $APACHE2_SITES_AVAILABLE/autogestion.conf
a2ensite autogestion.conf
systemctl restart apache2.service