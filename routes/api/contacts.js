const express = require('express');

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const { authenticate, isValidId, validateBody } = require("../../midlewares");

const { schemas } = require("../../models/contact.model");

router.get('/', authenticate, ctrl.getAllContacts )

router.get('/:id', authenticate, isValidId, ctrl.getContactsById)

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.addContact)

router.delete('/:id', authenticate, isValidId, ctrl.deleteContact)

router.put('/:id', authenticate, isValidId, validateBody(schemas.addSchema), ctrl.updateContactById)

router.patch('/:id/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite)
module.exports = router
