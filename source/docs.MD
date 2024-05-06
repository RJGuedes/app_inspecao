# Server setup

```sh
mkdir seyconel
sudo chown bitnami seyconel
sudo npm install -g npm
sudo npm install -g pm2
sudo npm install -g @nrwl/cli

sudo cp ~/stack/apache2/conf/vhosts/sample-vhost.conf.disabled ~/stack/apache2/conf/vhosts/sample-vhost.conf
sudo cp ~/stack/apache2/conf/vhosts/sample-https-vhost.conf.disabled ~/stack/apache2/conf/vhosts/sample-https-vhost.conf

sudo nano sample-vhost.conf
sudo nano sample-https-vhost.conf

sudo /opt/bitnami/ctlscript.sh restart apache

ssh-keygen
cat /home/bitnami/.ssh/id_rsa.pub
ssh -T git@github.com

export NODE_OPTIONS=--max_old_space_size=1024
https://aws.amazon.com/premiumsupport/knowledge-center/ec2-memory-swap-file/

pm2 deploy production setup

```


## nimbletext

```
<% $0 %>: {1: <% $1.replace(',', '') %>, 2: <% $2.replace(',', '') %>, 3: <% $3.replace(',', '') %>},
```
