import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import { userSignupSchema } from '../validation/users.js';
import { signupController } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/auth/register',
  validateBody(userSignupSchema),
  ctrlWrapper(signupController),
);

export default authRouter;
