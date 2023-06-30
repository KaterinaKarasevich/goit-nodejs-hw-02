const express = require('express');

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const validateBody = require("../../midlewares/validateBody");

const isValidId = require("../../midlewares/isValidId");

const {schemas} = require("../../models/contact.model");
router.get('/', ctrl.getAllContacts )

router.get('/:id', isValidId, ctrl.getContactsById)

router.post('/', validateBody(schemas.addSchema), ctrl.addContact)

router.delete('/:id', isValidId, ctrl.deleteContact)

router.put('/:id', isValidId, validateBody(schemas.addSchema), ctrl.updateContactById)

router.patch('/:id/favorite', isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite)
module.exports = router
