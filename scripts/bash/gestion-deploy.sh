#!/bin/bash 
#Debugging instance ON
set -x

# opt proyectos variables
export GESTION="/opt/proyectos/gestion"

# apache2 directorio
export APACHE2_AVAILABLE="/etc/apache2/sites-available/"

# Ejecutar composer install en el directorio GESTION sin interacción
composer install --no-interaction --working-dir=$GESTION

# Exportar las variables de entorno necesarias para la instalación de Toba
export TOBA_INSTANCIA=desarrollo
export TOBA_INSTALACION_DIR="$GESTION/instalacion"

# Obtiene el directorio actual donde se encuentra gestion-deploy.sh
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Ejecutar el script de expect para manejar la instalación interactiva de Toba
# Utiliza la ruta completa al script de expect basado en el directorio actual
"$SCRIPT_DIR/instalacion-toba.expect"

# Cambiar el propietario y el grupo de los directorios
cd $GESTION && chown -R www-data:www-data www temp instalacion vendor

# Cambiar los permisos de los directorios especificados a 775
cd $GESTION && chmod 775 -R www temp instalacion vendor

INSTALACION_INI="$GESTION/instalacion/instalacion.ini"

FOP_LINE="[xslfo]\nfop=$GESTION/php/3ros/fop/fop"

# Agregar la línea al final del archivo instalacion.ini
echo -e "$FOP_LINE" >> "$INSTALACION_INI"

INSTANCIA_INI="$GESTION/instalacion/i__desarrollo/instancia.ini"

# Modificar la linea url dentro del bloque de Guarani
sed -i '/^\[guarani\]/,/^\[/ {/url =/s|url =.*|url = "/guarani/3.21"|}' $INSTANCIA_INI

"$SCRIPT_DIR/cargar-guarani.expect"
systemctl restart apache2.service
"$SCRIPT_DIR/instalar-guarani.expect"

# Copiar conf de toba al apache
cp $TOBA_INSTALACION_DIR/toba.conf $APACHE2_AVAILABLE/gestion.conf
a2ensite gestion.conf
service apache2 reload