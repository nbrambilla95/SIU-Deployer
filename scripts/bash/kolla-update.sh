#!/bin/bash 
#Debugging instance ON
set -x

# opt proyectos variables.
export SCRIPTS_DIR="$1"
export CONFIG_FILE="$2"
export APACHE_DIR="$3"

export OLDKOLLA="$(jq -r '.database.kolla.kolla_old' "$CONFIG_FILE")"
echo $OLDKOLLA
export INSTALL="$(jq -r '.database.kolla.kolla_rar' "$CONFIG_FILE")"
echo $INSTALL
export KOLLA="$(jq -r '.database.kolla.kolla_new' "$CONFIG_FILE")"
echo $KOLLA

# Obtiene el directorio actual donde se encuentra kolla-upgrade.sh
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

#En caso de tener una instalacion con auditoria.
#pg_dump -a --disable-triggers -n <schema_kolla>_auditoria -h <host> -U <usuario> -p <puerto> -d <base_kolla> -f /path/al/archivo.sql

#Descomprimir el instalador en el directorio en cuestion.
unrar x $INSTALL $KOLLA

#Encontrar la carpeta generada por la extraccion.
NEW_FOLDER=$(find "$KOLLA" -mindepth 1 -maxdepth 1 -type d -print -quit)

#Mover el contenido de la extraccion directamente a la carpeta del proyecto.
cd $NEW_FOLDER && mv * $KOLLA

#Eliminar la carpeta en cuestion.
rm -R $NEW_FOLDER

#Instalar dependencia via composer.
cd $KOLLA && composer install --no-dev

#Antes del siguiente paso se podria agregar un respaldo de backup.

#Copiar el archivo instalador.env.dist y renombrar a instalador.env.
#Para facilitar el proceso se realiza una copia del instalador anterior.
cp $OLDKOLLA/instalador.env $KOLLA

#Reemplazar los datos correspondientes.
INSTALADOR_ENV="$KOLLA/instalador.env"

sed -i "s~TOBA_PROYECTO_DIR=".*"~TOBA_PROYECTO_DIR=\"$KOLLA\"~" $INSTALADOR_ENV
sed -i "s~TOBA_INSTALACION_DIR=".*"~TOBA_INSTALACION_DIR=\"$KOLLA/instalacion\"~" $INSTALADOR_ENV

#Cambiar owner de los archivos.
chown -R www-data:www-data $KOLLA

#Dar permisos de ejecución al archivo toba que se encuentra en el directorio bin del framework Toba.
chmod +x $KOLLA/vendor/siu-toba/framework/bin/toba

#El archivo "OLDKOLLA/instalacion/i__produccion/instancia.ini" debe tener configurado el parámetro usar_perfiles_propios = "1" en la entrada [kolla]
sed -i '/^\[kolla\]/a\usar_perfiles_propios = "1"' $OLDKOLLA/instalacion/i__produccion/instancia.ini

#Actualizar (tomado de referencia Documentacion UNC).
"$SCRIPT_DIR/expect/actualizar-kolla.expect"

#Cambiar owner de los archivos.
chown -R www-data:www-data $KOLLA

#Configurar el servidor web
# Apache2 directorio para sites-available
export APACHE2_SITES_AVAILABLE="/etc/apache2/sites-available"

sed -i "s|$OLDKOLLA|$KOLLA|g" $APACHE2_SITES_AVAILABLE/kolla.conf

#Quitar el modo mantenimiento del proyecto.
"$SCRIPT_DIR/expect/modo-mantenimiento-off.expect"

#Reiniciar el servidor web para que tome los nuevos cambios.
systemctl restart apache2.service