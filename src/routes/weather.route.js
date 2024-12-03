import { Router } from 'express';
import * as controller from '../controllers/weather.controller.js';
import inputValidation from '../middlewares/inputValidation.middleware.js';
import * as schema from '../schemas/weather.schema.js';
const router = Router();

router
  .route('/')
  .get(inputValidation(schema.getCityNameSchema), controller.getCurrentWeather);
router
  .route('/forecast')
  .get(
    inputValidation(schema.getCityNameSchema),
    controller.getForecastWeather,
  );
export default router;
