#!/bin/bash

# Variables
MODULE="$1"

HOST="$(jq -r ".database.host." "$CONFIG_FILE")"
PORT="$(jq -r '.database.port' "$CONFIG_FILE")"
USER="$(jq -r ".database.$MODULE.dbusername" "$CONFIG_FILE")"
DATABASE="$(jq -r ".database.$MODULE.dbname" "$CONFIG_FILE")"
PASSWORD="$(jq -r ".database.$MODULE.dbpassword" "$CONFIG_FILE")"

# Se requiere el psql tools instalado por lo que agrego dicha revision
install_psql() {
    if ! command -v psql > /dev/null; then
        echo "psql is not installed. Installing now..."
        apt update
        apt install -y postgresql-client
    else
        echo "psql is already installed."
    fi
}

# Funcion para testear la conexion PostgreSQL
test_pg_connection() {
    PGPASSWORD=$PASSWORD psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DATABASE" -c "\q" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "Connection to PostgreSQL database '$DATABASE' on '$HOST:$PORT' as user '$USER' succeeded."
        return 0
    else
        echo "Connection to PostgreSQL database '$DATABASE' on '$HOST:$PORT' as user '$USER' failed."
        return 1
    fi
}

# Revisar e instalar psql tool
install_psql

# Testear la conexion
test_pg_connection