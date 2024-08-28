#!/bin/bash 
#Debugging instance ON
set -x

# Directorios del modulo Gestion
export CONFIG_FILE="$2"

# opt proyectos variables
export GESTION="$(jq -r '.database.gestion.directory' "$CONFIG_FILE")"
echo $GESTION

export SVN_URL="$(jq -r '.repository.url' "$CONFIG_FILE")"
echo $SVN_URL

export SVN_USERNAME="$(jq -r '.repository.username' "$CONFIG_FILE")"
echo $SVN_USERNAME

export SVN_PASSWORD="$(jq -r '.repository.password' "$CONFIG_FILE")"
echo $SVN_PASSWORD

export GESTION_BIN="$GESTION/bin"

#Mover carpeta de procesos background de <path_guarani>/temp a <path_guarani>/instalacion/i__desarrollo/p__guarani/logs/
mv $GESTION/temp $GESTION/instalacion/i__desarrollo/p__guarani/logs/

# #Cambiar la versión del código a la nueva versión del sistema. (Requiere a svn working copy)
cd $GESTION && svn switch $SVN_URL --ignore-ancestry --username $SVN_USERNAME --password $SVN_PASSWORD

# #Instalar dependencia via composer.
cd $GESTION && composer install

# #Regenerar la instancia Toba dentro de la carpeta 'bin':
cd $GESTION_BIN && ./toba instancia regenerar -i desarrollo

# #Migrar la base de datos de negocio dentro de la carpeta 'bin':
cd $GESTION_BIN && ./guarani migrar_base