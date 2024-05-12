#!/bin/bash 
#Debugging instance ON
set -x

# opt proyectos variables
export PROJECT="/opt/proyectos/autogestion"

# Obtiene el directorio actual donde se encuentra el script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Armar los archivos de configuracion a partir de los templates
cd $PROJECT/instalacion && cp config_template.php config.php
cd $PROJECT/instalacion && cp login_template.php login.php

DBNAME="toba_prueba"
SCHEMA="business"
SCHEMA_TOBA="desarrollo"
HOST="prueba.unc.edu.ar"
PORT=8080
PDO_USER="tesis"
PDO_PASSWD="siste"
CONFIG_PHP="$PROJECT/instalacion/config.php"

sed -i "s/'dbname' => '.*'/'dbname' => '$DBNAME'/" $CONFIG_PHP
sed -i "s/'schema' => '.*'/'schema' => '$SCHEMA'/" $CONFIG_PHP
sed -i "s/'schema_toba' => '.*'/'schema_toba' => '$SCHEMA_TOBA'/" $CONFIG_PHP
sed -i "s/'host' => '.*'/'host' => '$HOST'/" $CONFIG_PHP
sed -i "s/'port' => [^,]*/'port' => $PORT/" $CONFIG_PHP
sed -i "s/'pdo_user' => '.*'/'pdo_user' => '$PDO_USER'/" $CONFIG_PHP
sed -i "s/'pdo_passwd' => '.*'/'pdo_passwd' => '$PDO_PASSWD'/" $CONFIG_PHP

# Cambiar el propietario y el grupo de los directorios
cd $PROJECT && chown -R www-data:www-data instalacion src

# Cambiar los permisos de los directorios especificados a 775
cd $PROJECT && chmod 775 -R instalacion src

# Ejecutar composer install en el directorio del proyecto sin interacción
composer install --no-interaction --working-dir=$PROJECT

# Recomendado usar un solo archivo de conf, de lo contrario cargar el conf del projecto para apache.
#ln -s $PROJECT/instalacion/alias.conf /etc/apache2/sites-enabled/autogestion.conf

# Se agregar 'url3w = "https://<url de Autogestion>"'
# antes del bloque [xslfo] del archivo instalacion.ini de Gestion.
INSTALACION_INI="/opt/proyectos/gestion/instalacion/instalacion.ini"
sed -i '/^\[xslfo\]/i url3w = "/autogestion"' $INSTALACION_INI

systemctl restart apache2.service
