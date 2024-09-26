import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import {
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

import { userSignupSchema, userSigninSchema } from '../validation/users.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const authRouter = Router();

// роут для реєстрації
authRouter.post(
  '/auth/register',
  validateBody(userSignupSchema),
  ctrlWrapper(registerController),
);

// роут для логіну
authRouter.post(
  '/auth/login',
  validateBody(userSigninSchema),
  ctrlWrapper(loginController),
);

// роут для оновлення токену
authRouter.post('/auth/refresh', ctrlWrapper(refreshController));

// роут для розлогінювання
authRouter.post('/auth/logout', ctrlWrapper(logoutController));

// роут для надсилання email скидування паролю
authRouter.post(
  '/auth/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

// роут для скидування паролю
authRouter.post(
  '/auth/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
