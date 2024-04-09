#!/bin/bash 
#Debugging instance ON
set -x

# opt proyectos variables
export PROJECT="/opt/proyectos/preinscripcion"

# Obtiene el directorio actual donde se encuentra el script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Armar los archivos de configuracion a partir de los templates
cd $PROJECT/instalacion && cp config_template.php config.php
cd $PROJECT/instalacion && cp login_template.php login.php

DBNAME_PREINSCRIPCION="DBNAME_PREINSCRIPCION"
DBNAME_GUARANI="DBNAME_GUARANI"
SCHEMA_GUARANI="negocio"
HOST="HOST"
PORT=5432
PDO_USER="PDO_USER"
PDO_PASSWD="PDO_PASSWD"
CONFIG_PHP="$PROJECT/instalacion/config.php"

# Actualizaciones para la sección 'database'
sed -i "s|'dbname' => 'nombre_base_preinscripcion',|'dbname' => '$DBNAME_PREINSCRIPCION',|" $CONFIG_PHP
sed -i "s|'host' => 'host_base_preinscripcion',|'host' => '$HOST',|" $CONFIG_PHP
sed -i "s|'port' => 'puerto_base_preinscripcion',|'port' => '$PORT',|" $CONFIG_PHP
sed -i "s|'pdo_user' => 'usuario_base_preinscripcion',|'pdo_user' => '$PDO_USER',|" $CONFIG_PHP
sed -i "s|'pdo_passwd' => 'password_base_preinscripcion',|'pdo_passwd' => '$PDO_PASSWD',|" $CONFIG_PHP

# Actualizaciones para la sección 'database_guarani'
sed -i "s|'dbname' => 'nombre_base_gestion',|'dbname' => '$DBNAME_GUARANI',|" $CONFIG_PHP
sed -i "s|'schema' => 'schema_base_gestion',|'schema' => '$SCHEMA_GUARANI',|" $CONFIG_PHP
sed -i "s|'host' => 'host_base_gestion',|'host' => '$HOST',|" $CONFIG_PHP
sed -i "s|'port' => 'puerto_base_gestion',|'port' => '$PORT',|" $CONFIG_PHP
sed -i "s|'pdo_user' => 'usuario_base_gestion',|'pdo_user' => '$PDO_USER',|" $CONFIG_PHP
sed -i "s|'pdo_passwd' => 'password_base_gestion',|'pdo_passwd' => '$PDO_PASSWD',|" $CONFIG_PHP

# Cambiar el propietario y el grupo de los directorios
cd $PROJECT && chown -R www-data:www-data instalacion/temp instalacion/log instalacion/cache src/siu/www

# Ejecutar composer install en el directorio del proyecto sin interacción
composer install --no-interaction --working-dir=$PROJECT

systemctl restart apache2.service
