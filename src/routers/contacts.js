import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';

import {
  getAllContactsController,
  getContactController,
  createContactController,
  deleteContactController,
  updateContactController,
} from '../controllers/contacts.js';

/* блок для валидации */
import { validateBodySchema } from '../validation/validateBodySchema.js';
import { validateBody } from '../utils/validateBody.js';
import { isValidId } from '../middlewares/checkId.js';

const router = Router();

// мидлвара для проверки токена - если хотим применить ее ко всем роутам contacts
// то используем ее отдельно с помощью router.use()
// если токен не валидный - выбросит в мидлвару обработки ошибок
router.use(authenticate);

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactController),
);

router.post(
  '/contacts',
  validateBody(validateBodySchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(validateBodySchema),
  ctrlWrapper(updateContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
