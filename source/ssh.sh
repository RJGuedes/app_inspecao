#!/bin/bash

chmod 400 ./cert/SEY-WEB01.pem
ssh-add ./cert/SEY-WEB01.pem

ssh sey-web@ec2-18-228-62-195.sa-east-1.compute.amazonaws.com



#chmod 400 ./seyconeloldkey.pem
#ssh-add ./seyconeloldkey.pem

#ssh bitnami@3.212.184.119

#rsync -avz -e ssh bitnami@3.212.184.119:/home/bitnami/seyconel/shared/files /home/sey-web/seyconel-app/shared
