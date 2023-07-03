
const { Contact } = require("../models/contact.model");

const {HttpError, ctrlWrapper} = require("../helpers")


const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 18, ...query } = req.query;
  const skip = (page - 1) * limit;
    const result = await Contact.find({owner, ...query}, null, {skip, limit});
    res.json(result);  
}

const getContactsById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
}

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);
}

const deleteContact =  async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({
      message: "contact deleted"
    })
}

const updateContactById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  
}

const updateFavorite = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  
}

module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactsById: ctrlWrapper(getContactsById),
    addContact: ctrlWrapper(addContact),
    deleteContact: ctrlWrapper(deleteContact),
    updateContactById: ctrlWrapper(updateContactById),
    updateFavorite: ctrlWrapper(updateFavorite),
}