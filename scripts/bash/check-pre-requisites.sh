#!/bin/bash

set -euxo pipefail

export SCRIPTS_DIR="$1"
export CONFIG_FILE="$2"
export APACHE_DIR="$3"

# Separador para ordenar mejor el output 
print_separator() {
    local message=$1
    echo "###########################################"
    echo "# $message"
}

# Ruta al archivo de configuración JSON
if [[ -f "$CONFIG_FILE" ]]; then
  selected_path=$(jq -r '.selectedPath' "$CONFIG_FILE")
else
  echo "Error: Config file not found"
  exit 1
fi

# Verificar si el path de instalación es válido
if [ -z "$selected_path" ]; then
  echo "Path de instalación no proporcionado"
  exit 1
fi

print_separator "Path de instalación: $selected_path"

# Funcion para checkear los packages instalados
is_package_installed() {
    dpkg -l | grep -q "$1"
}

# Chequeando e instalando jq si no esta instalado
if ! is_package_installed jq; then
    print_separator 'Installing jq'
    apt-get install -y jq
else
    print_separator 'jq already installed'
fi

# Chequeando e instalando expect si no esta instalado
if ! is_package_installed expect; then
    print_separator 'Installing expect'
    apt-get install -y expect
else
    print_separator 'expect already installed'
fi

# Funcion para checkear si PPA esta agregado
is_ppa_added() {
    grep -h "^deb .*ondrej/php" /etc/apt/sources.list.d/* > /dev/null 2>&1
}

#Chequeando y agregando Ondrej PHP repositorio
if ! is_ppa_added; then
    add-apt-repository -y ppa:ondrej/php
    apt-get update
else
    print_separator 'Ondrej PHP repository is already added'
fi

# Chequeando e instalando Apache si no esta instalado
if ! is_package_installed apache2; then
    print_separator 'Installing apache'
    apt-get install -y apache2 libapache2-mod-php7.4 openssl
    a2enmod rewrite setenvif
    systemctl restart apache2
else
    print_separator 'Apache already installed'
fi

# Instalar modulos de PHP solo si no se encuentra la version requerida
if ! is_package_installed php7.4-cli; then
    print_separator 'Installing PHP and required modules'
    apt-get install -y php7.4-cli php7.4-pgsql php7.4-gd php7.4-curl php7.4-apcu \
                       php7.4-mbstring php7.4-xml php7.4-zip php7.4-fpm php-memcached \
                       ssmtp subversion git zip unzip graphviz default-jdk
else
    print_separator 'Required PHP version is already installed'
fi

# Chequear e instalar Composer
if ! command -v composer >/dev/null; then
    print_separator 'Installing Composer'
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php -r "if (hash_file('sha384', 'composer-setup.php') === '756890a4488ce9024fc62c56153228907f1545c228516cbf63f885e036d37e9a59d27d63f46af1d4d07ee0f76181c7d3') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); exit(1); }"
    php composer-setup.php --version=1.10.22
    php -r "unlink('composer-setup.php');"
    mv composer.phar /usr/local/bin/composer
else
    print_separator 'Composer is already installed'
fi

# Chequear e instalar Yarn
if ! command -v yarn >/dev/null; then
    print_separator 'Installing Yarn'
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    apt-get update && apt-get install -y yarn
else
    print_separator 'Yarn is already installed'
fi

print_separator 'Setup completed successfully'
exit 0