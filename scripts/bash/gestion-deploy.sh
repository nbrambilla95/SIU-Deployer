#!/bin/bash 
#Debugging instance ON
set -x

# Directorios del modulo Gestion
export SCRIPTS_DIR="$1"
export CONFIG_FILE="$2"

export GESTION="$(jq -r '.selectedPath' "$CONFIG_FILE")/gestion"
echo $GESTION

# Apache2 directorio para sites-available
export APACHE2_AVAILABLE="/etc/apache2/sites-available/"

# Ejecutar composer install en el directorio GESTION sin interacción
composer install --no-interaction --working-dir=$GESTION

# Exportar las variables de entorno necesarias para la instalación de Toba
export TOBA_INSTANCIA=desarrollo
export TOBA_INSTALACION_DIR="$GESTION/instalacion"

# # Ejecutar el script de expect para manejar la instalación interactiva de Toba
"$SCRIPTS_DIR/expect/instalacion-toba.expect"

# Cambiar el propietario y el grupo de los directorios
cd $GESTION && chown -R www-data:www-data www temp instalacion vendor

# Cambiar los permisos de los directorios especificados a 775
cd $GESTION && chmod 775 -R www temp instalacion vendor

INSTALACION_INI="$GESTION/instalacion/instalacion.ini"

FOP_LINE="[xslfo]\nfop=$GESTION/php/3ros/fop/fop"

# Agregar la línea al final del archivo instalacion.ini
echo -e "$FOP_LINE" >> "$INSTALACION_INI"

INSTANCIA_INI="$GESTION/instalacion/i__desarrollo/instancia.ini"

"$SCRIPTS_DIR/expect/cargar-guarani.expect"
systemctl restart apache2.service
"$SCRIPTS_DIR/expect/instalar-guarani.expect"

# Modificar la linea url dentro del bloque de Guarani
sed -i '/^\[guarani\]/,/^\[/ {/url =/s|url =.*|url = "/guarani/3.21"|}' $INSTANCIA_INI

# Copiar conf de toba al apache
cp $TOBA_INSTALACION_DIR/toba.conf $APACHE2_AVAILABLE/gestion.conf
a2ensite gestion.conf
service apache2 reload