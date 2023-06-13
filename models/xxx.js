const { nanoid } = require("nanoid");
const fs = require("fs/promises");
const path = require("path");
console.log(__dirname)
const contactsPath = path.join(__dirname, "../models/contacts.json");
console.log(contactsPath)

// TODO: задокументировать каждую функцию
async function listContacts() {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data)    
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result || null;
}

async function removeContact(id) {
   const contacts = await listContacts();
   const index = contacts.findIndex(contact => contact.id === id);
   if (index === -1) {
    return null;
    }
   const [result] = contacts.splice(index, 1);
   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
   return result;
}

async function addContact(data) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...data,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateById(id, data) {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { id, ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  updateById,
  addContact
}