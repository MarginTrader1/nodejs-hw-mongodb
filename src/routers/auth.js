import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import { userSignupSchema, userSigninSchema } from '../validation/users.js';
import {
  signupController,
  signinController,
  refreshController,
  signoutController,
} from '../controllers/auth.js';

const authRouter = Router();

// роут для реєстрації
authRouter.post(
  '/auth/register',
  validateBody(userSignupSchema),
  ctrlWrapper(signupController),
);

// роут для логіну
authRouter.post(
  '/auth/login',
  validateBody(userSigninSchema),
  ctrlWrapper(signinController),
);

// роут для оновлення токену
authRouter.post('/auth/refresh', ctrlWrapper(refreshController));

// роут для розлогінювання 
authRouter.post('/auth/signout', ctrlWrapper(signoutController));

export default authRouter;
