import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';

const swaggerRouter = Router();

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('docs/swagger.json'), 'utf-8'),
);

swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default swaggerRouter;