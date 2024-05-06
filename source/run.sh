#!/bin/bash

nx build app && cd apps/app && cap run android && cd .. && cd ..
