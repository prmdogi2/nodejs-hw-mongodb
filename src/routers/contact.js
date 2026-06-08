import { Router } from 'express';
import * as contactsControllers from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.use(authenticate);

// GET ALL
router.get('/', ctrlWrapper(contactsControllers.getContactsController));

// GET BY ID
router.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsControllers.getContactByIdController),
);

// CREATE (photo upload middleware burada olmalı)
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(contactsControllers.createContactController),
);

// PATCH
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(contactsControllers.patchContactController),
);

// DELETE
router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsControllers.deleteContactController),
);

export default router;