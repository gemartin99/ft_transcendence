#!/bin/sh

#nest new app --package-manager npm 
#rm app/src/app.module.ts
#rm app/src/app.service.ts
cp ./src/app.service.ts /app/src/app.service.ts
npm run start:dev
