import { Router } from 'express';
import * as contactsControllers from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js'; // 1. Importlar en yukarıda toplanmalı

const router = Router(); // 2. Önce router oluşturulmalı

router.use(authenticate); // 3. Sonra tüm rotaları koruması için middleware eklenmeli

// 4. Rotalar en son tanımlanmalı
router.get('/', ctrlWrapper(contactsControllers.getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(contactsControllers.getContactByIdController));

router.post('/', validateBody(createContactSchema), ctrlWrapper(contactsControllers.createContactController));

router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(contactsControllers.patchContactController));

router.delete('/:contactId', isValidId, ctrlWrapper(contactsControllers.deleteContactController));

export default router;