
const app = require('./app')


app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000")
})

// const PATH_TO_FILE = path.join(__dirname, "./models/contacts.json")

// const readContacts = async (path) => JSON.parse(await fs.readFile(PATH_TO_FILE));

// app.get("/contacts", async (req, res) => {
//   const contacts = await readContacts(PATH_TO_FILE);
//   res.json({contacts})
// })

// //
// app.get("/contacts/:id", async (req, res) => {
//   const { id } = req.params;

//   const contacts = await readContacts(PATH_TO_FILE);
//   const contact = contacts.filter((contact) => contact.id === id)
 
//   res.json({contact})
// })


// app.delete("/contacts/:id", async (req, res) => {
//   const { id } = req.params;

//   const contacts = await readContacts(PATH_TO_FILE);
//   const updatedContacts = contacts.filter((contact) => contact.id !== id)

//   await fs.writeFile(PATH_TO_FILE, JSON.stringify(updatedContacts));
  
//   res.json({updatedContacts})
// })

// app.post("/contacts", async (req, res) => {
//   const body = req.body;

//   const contact = { id: crypto.randomUUID(), ...body };
//   const contacts = await readContacts(PATH_TO_FILE);
 
//   contacts.push(contact);

//   await fs.writeFile(PATH_TO_FILE, JSON.stringify(contacts));
  
//   res.json({contact})
// })

// app.put("/contacts/:id", async (req, res) => {
//   const { id } = req.params;

//   const contacts = await readContacts(PATH_TO_FILE);
//   const findIndexContacts = contacts.findIndex((contact) => contact.id === id)

//   // await fs.writeFile(PATH_TO_FILE, JSON.stringify(findIndexContacts));
//   //  const body = req.body;
//   res.json({findIndexContacts})
// })