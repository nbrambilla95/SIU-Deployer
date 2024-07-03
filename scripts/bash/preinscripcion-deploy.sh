#!/bin/bash 
#Debugging instance ON
set -x

# Directorios del modulo Preinscripcion
export SCRIPTS_DIR="$1"
export CONFIG_FILE="$2"

export PREINSCRIPCION="$(jq -r '.selectedPath' "$CONFIG_FILE")/preinscripcion"
echo $PREINSCRIPCION

# Armar los archivos de configuracion a partir de los templates
cd $PREINSCRIPCION/instalacion && cp config_template.php config.php
cd $PREINSCRIPCION/instalacion && cp login_template.php login.php

DBNAME_PREINSCRIPCION="$(jq -r '.database.preinscripcion.dbname' "$CONFIG_FILE")"
DBNAME_GUARANI="$(jq -r '.database.gestion.dbname' "$CONFIG_FILE")"
SCHEMA_GUARANI="$(jq -r '.database.autogestion.schema' "$CONFIG_FILE")"
HOST="$(jq -r '.database.host' "$CONFIG_FILE")"
PORT="$(jq -r '.database.port' "$CONFIG_FILE")"
PDO_USER_PREINSCRIPCION="$(jq -r '.database.preinscripcion.dbusername' "$CONFIG_FILE")"
PDO_PASSWD_PREINSCRIPCION="$(jq -r '.database.preinscripcion.dbpassword' "$CONFIG_FILE")"
PDO_USER_GUARANI="$(jq -r '.database.autogestion.dbusername' "$CONFIG_FILE")"
PDO_PASSWD_GUARANI="$(jq -r '.database.autogestion.dbpassword' "$CONFIG_FILE")"
CONFIG_PHP="$PREINSCRIPCION/instalacion/config.php"

# Actualizaciones para la sección 'database'
sed -i "s|'dbname' => 'nombre_base_preinscripcion',|'dbname' => '$DBNAME_PREINSCRIPCION',|" $CONFIG_PHP
sed -i "s|'host' => 'host_base_preinscripcion',|'host' => '$HOST',|" $CONFIG_PHP
sed -i "s|'port' => 'puerto_base_preinscripcion',|'port' => '$PORT',|" $CONFIG_PHP
sed -i "s|'pdo_user' => 'usuario_base_preinscripcion',|'pdo_user' => '$PDO_USER_PREINSCRIPCION',|" $CONFIG_PHP
sed -i "s|'pdo_passwd' => 'password_base_preinscripcion',|'pdo_passwd' => '$PDO_PASSWD_PREINSCRIPCION',|" $CONFIG_PHP

# Actualizaciones para la sección 'database_guarani'
sed -i "s|'dbname' => 'nombre_base_gestion',|'dbname' => '$DBNAME_GUARANI',|" $CONFIG_PHP
sed -i "s|'schema' => 'schema_base_gestion',|'schema' => '$SCHEMA_GUARANI',|" $CONFIG_PHP
sed -i "s|'host' => 'host_base_gestion',|'host' => '$HOST',|" $CONFIG_PHP
sed -i "s|'port' => 'puerto_base_gestion',|'port' => '$PORT',|" $CONFIG_PHP
sed -i "s|'pdo_user' => 'usuario_base_gestion',|'pdo_user' => '$PDO_USER_GUARANI',|" $CONFIG_PHP
sed -i "s|'pdo_passwd' => 'password_base_gestion',|'pdo_passwd' => '$PDO_PASSWD_GUARANI',|" $CONFIG_PHP

# Cambiar el propietario y el grupo de los directorios
cd $PREINSCRIPCION && chown -R www-data:www-data instalacion/temp instalacion/log instalacion/cache src/siu/www

# Ejecutar composer install en el directorio del proyecto sin interacción
composer install --no-interaction --working-dir=$PREINSCRIPCION

systemctl restart apache2.service
