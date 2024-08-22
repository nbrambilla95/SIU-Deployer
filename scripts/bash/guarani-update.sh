#!/bin/bash 
#Debugging instance ON
set -x

# Directorios del modulo Gestion
export CONFIG_FILE="$2"

# opt proyectos variables
export GESTION="$(jq -r '.selectedPath' "$CONFIG_FILE")/gestion"
echo $GESTION

#Mover carpeta de procesos background de <path_guarani>/temp a <path_guarani>/instalacion/i__desarrollo/p__guarani/logs/
mv $GESTION/temp $GESTION/instalacion/i__desarrollo/p__guarani/logs/

# #Cambiar la versión del código a la nueva versión del sistema. (Requiere a svn working copy)
cd $GESTION && svn switch https://colab.siu.edu.ar/svn/guarani3/nodos/uncor/gestion/trunk/3.21.1/ --ignore-ancestry #ingresar credenciales o solicitar input

# #Instalar dependencia via composer.
cd $GESTION && composer install

# #Regenerar la instancia Toba dentro de la carpeta 'bin':
cd $GESTION && ./toba instancia regenerar -i desarrollo

# #Migrar la base de datos de negocio dentro de la carpeta 'bin':
cd $GESTION && ./guarani migrar_base