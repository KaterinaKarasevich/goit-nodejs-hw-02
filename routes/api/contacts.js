const express = require('express');

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const { validateBody } = require("../../midlewares");

const schemas = require("../../schemas/contacts");
router.get('/', ctrl.getAllContacts )

router.get('/:id', ctrl.getContactsById)

router.post('/', validateBody(schemas.addSchema), ctrl.addContact)

router.delete('/:id', ctrl.deleteContact)

router.put('/:id', validateBody(schemas.addSchema), ctrl.updateContactById)


module.exports = router
