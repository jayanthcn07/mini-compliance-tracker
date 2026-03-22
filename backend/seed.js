require("dotenv").config();
const mongoose = require("mongoose");
const Client = require("./models/Client");
const Task = require("./models/Task");

const clients = [
  { company_name: "Acme Corp", country: "India", entity_type: "Corporation" },
  { company_name: "BlueSky LLC", country: "USA", entity_type: "LLC" },
  { company_name: "NovaTech Partners", country: "UK", entity_type: "Partnership" },
];

const now = new Date();
const daysAgo = (d) => new Date(now - d * 86400000);
const daysAhead = (d) => new Date(now.getTime() + d * 86400000);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Client.deleteMany();
  await Task.deleteMany();

  const created = await Client.insertMany(clients);

  const tasks = [
    { client_id: created[0]._id, title: "Q1 GST Filing", category: "Tax Filing", due_date: daysAgo(5), status: "Pending", priority: "High", description: "File quarterly GST returns" },
    { client_id: created[0]._id, title: "Annual Audit", category: "Audit", due_date: daysAhead(10), status: "In Progress", priority: "High", description: "Coordinate with auditors" },
    { client_id: created[0]._id, title: "Payroll March", category: "Payroll", due_date: daysAhead(2), status: "Pending", priority: "Medium", description: "Process March payroll" },
    { client_id: created[1]._id, title: "Federal Tax Return", category: "Tax Filing", due_date: daysAgo(3), status: "Pending", priority: "High", description: "File federal returns" },
    { client_id: created[1]._id, title: "Board Compliance Report", category: "Legal", due_date: daysAhead(15), status: "Completed", priority: "Low", description: "Quarterly board report" },
    { client_id: created[2]._id, title: "VAT Submission", category: "Tax Filing", due_date: daysAhead(7), status: "Pending", priority: "Medium", description: "Submit VAT returns to HMRC" },
    { client_id: created[2]._id, title: "Employment Contract Review", category: "Legal", due_date: daysAgo(1), status: "Pending", priority: "High", description: "Review updated contracts" },
  ];

  await Task.insertMany(tasks);
  console.log("Seeded successfully");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });