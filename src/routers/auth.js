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

authRouter.post(
  '/auth/register',
  validateBody(userSignupSchema),
  ctrlWrapper(signupController),
);

authRouter.post(
  '/auth/login',
  validateBody(userSigninSchema),
  ctrlWrapper(signinController),
);

authRouter.post('/auth/refresh', ctrlWrapper(refreshController));

authRouter.post('/auth/signout', ctrlWrapper(signoutController));

export default authRouter;
