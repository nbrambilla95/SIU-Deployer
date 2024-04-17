#!/bin/bash
#This script was tested on Ubuntu 20.04

set -x

#Adding repository from ondrej
echo 'Adding repository from ondrej'
add-apt-repository -y ppa:ondrej/php
apt update

#Apache installation
echo 'Installing apache'
apt-get -y install apache2 libapache2-mod-php7.4 openssl
a2enmod rewrite
a2enmod setenvif
service apache2 restart


#PHP installation
echo 'Installing PHP'
apt update
apt-get -y install php7.4-cli php7.4-pgsql php7.4-gd php7.4-curl php7.4-apcu php7.4-mbstring php7.4-xml php7.4-zip php7.4-fpm
apt-get -y install php-memcached
apt-get -y install ssmtp

#Subversion
echo 'Installing Subversion'
apt-get -y install subversion

#Git
echo 'Installing Git'
apt-get -y install git

#Composer
echo 'Installing Composer'
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') ===
'756890a4488ce9024fc62c56153228907f1545c228516cbf63f885e036d37e9a59d27d63f46a
f1d4d07ee0f76181c7d3') { echo 'Installer verified'; } else { echo 'Installer corrupt';
unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php --version=1.10.22
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/local/bin/composer
apt-get install zip
apt-get install unzip

#Yarn
echo 'Installing Yarn'
apt -y install curl
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee
/etc/apt/sources.list.d/yarn.list
apt update && apt-get -y install yarn

#Graphviz
echo 'Installing Graphviz'
apt-get -y install graphviz

#Java
echo 'Installing Java'
apt-get -y install default-jdk

