import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Dynamically load all route files except index.ts
const routesPath = path.join(__dirname);
fs.readdirSync(routesPath)
  .filter((file) => file !== 'index.ts' && file.endsWith('.ts'))
  .forEach((file) => {
    const route = require(path.join(routesPath, file));
    router.use(`/${file.replace('Routes.ts', '').toLowerCase()}`, route.default);
  });

export default router;
