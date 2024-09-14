import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteStudentController,
  updateStudentController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts', ctrlWrapper(createContactController));

router.patch('/students/:studentId', ctrlWrapper(updateStudentController));

router.delete('/students/:studentId', ctrlWrapper(deleteStudentController));

export default router;
