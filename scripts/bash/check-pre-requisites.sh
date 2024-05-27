#!/bin/bash

set -euxo pipefail

#!/bin/bash

# Ruta al archivo de configuración JSON
config_file="src/config_files/config.json"
if [[ -f "$config_file" ]]; then
  selected_path=$(jq -r '.selectedPath' "$config_file")
else
  echo "Error: Config file not found"
  exit 1
fi

# Verificar si el path de instalación es válido
if [ -z "$selected_path" ]; then
  echo "Path de instalación no proporcionado"
  exit 1
fi

# Aquí puedes continuar con el resto de tu script de pre-requisitos
# Por ejemplo:
# Tu lógica de verificación de pre-requisitos aquí
# # Function to check if a package is installed
# is_package_installed() {
#     dpkg -l "$1" &>/dev/null
# }

# # Function to check if a PPA is already added
# is_ppa_added() {
#     grep -h "^deb .*ondrej/php" /etc/apt/sources.list.d/* > /dev/null 2>&1
# }

# echo 'Checking and adding Ondrej PHP repository'
# if ! is_ppa_added; then
#     add-apt-repository -y ppa:ondrej/php
#     apt-get update
# else
#     echo 'Ondrej PHP repository is already added'
# fi

# # Check and install Apache if not installed
# if ! is_package_installed apache2; then
#     echo 'Installing apache'
#     apt-get install -y apache2 libapache2-mod-php7.4 openssl
#     a2enmod rewrite setenvif
#     systemctl restart apache2
# else
#     echo 'Apache already installed'
# fi

# # Install PHP modules only if PHP is not at the required version
# if ! is_package_installed php7.4-cli; then
#     echo 'Installing PHP and required modules'
#     apt-get install -y php7.4-cli php7.4-pgsql php7.4-gd php7.4-curl php7.4-apcu \
#                        php7.4-mbstring php7.4-xml php7.4-zip php7.4-fpm php-memcached \
#                        ssmtp subversion git zip unzip graphviz default-jdk
# else
#     echo 'Required PHP version is already installed'
# fi

# # Check and install Composer
# if ! command -v composer >/dev/null; then
#     echo 'Installing Composer'
#     php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
#     php -r "if (hash_file('sha384', 'composer-setup.php') === '756890a4488ce9024fc62c56153228907f1545c228516cbf63f885e036d37e9a59d27d63f46af1d4d07ee0f76181c7d3') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); exit(1); }"
#     php composer-setup.php --version=1.10.22
#     php -r "unlink('composer-setup.php');"
#     mv composer.phar /usr/local/bin/composer
# else
#     echo 'Composer is already installed'
# fi

# # Check and install Yarn
# if ! command -v yarn >/dev/null; then
#     echo 'Installing Yarn'
#     curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
#     echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
#     apt-get update && apt-get install -y yarn
# else
#     echo 'Yarn is already installed'
# fi

# echo 'Setup completed successfully'

exit 0