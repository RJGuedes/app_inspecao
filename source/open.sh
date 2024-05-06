#!/bin/bash

nx build app --prod && cd apps/app && cap sync android && cd .. && cd ..
