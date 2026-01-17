// npm i mongodb
const { MongoClient } = require('mongodb');

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const orderingArray = [
    
  {
    "heading": "1. Configuration",
    "children": [
      "Smart Audit- Creating Template",
      "Smart Audit- Creating An Audit Checklist Using AI",
      "Smart Audit - Enable Section Summary in Smart Food Safe Audit",
      "Smart Audit- How to add a checklist?",
      "Smart Audit - How to configure  Audit Guidance for section headings, main questions, and conditional questions.",
      "Smart Audit- Ways To Create A Template",
      "Smart Audit- How to setup an audit result?",
      "Smart Audit- Why do we have multiple checklist option?",
      "Smart Audit- How to add a department & production line",
      "Smart Audit-Difference between list & button type response?",
      "Smart Audit- How does the default response help?",
      "Smart Audit- How to add a section?",
      "Smart Audit- How to add/delete a question?",
      "Smart Audit- How to enable section summary? Why it is used?",
      "Smart Audit- How to set up a validation?",
      "Smart Audit - Enable Scoring logic",
      "Smart Audit: What are the different ways of creating a response?",
      "Smart Audit- Configure Audit Response (Button Type)",
      "Smart Audit- Configure Audit Responses (List Type)"
    ]
  },
  {
    "heading": "2. Audit record",
    "children": [
      "Smart Audit- Creating Audit record",
      "Smart Audit and Smart IAM - What to do if the user does not appear in the Auditee dropdown",
      "Smart Audit- Assigning Non Conformance"
    ]
  },
  {
    "heading": "3. Non Conformance",
    "children": [
      "Smart Audit: Update Non-Conformances",
      "Smart Audit - How can we extend the NC due date"
    ]
  },
  {
    "heading": "4. Schedule",
    "children": [
      "Smart Audit: Scheduling a template"
    ]
  },
  {
    "heading": "5. Workflow",
    "children": [
      "Smart Audit: Creating Audit Workflow",
      "Smart Audit- Create a Non-Conformance Workflow"
    ]
  },
  {
    "heading": "6. Audit Library",
    "children": [
      "Smart Audit- Clone a Checklist in Audit Library"
    ]
  },
  {
    "heading": "7. Notification management",
    "children": [
      "Smart Audit - Configure Reminder Notifications"
    ]
  },
  {
    "heading": "8. Dashboard",
    "children": [
      "Smart Audit - Dashboard and its functionalities"
    ]
  },
  {
    "heading": "9. Mobile Application",
    "children": [
      "Smart Audit App - Download the App and Login",
      "Smart Audit App - Settings (Site, Language, Version, Log-out)",
      "Smart Audit App - Record creation",
      "Smart Audit App-How to find Non conformances assigned",
      "Audit Record Recovery (If record not syncing)"
    ]
  }

];

async function insertOrdering(uri, guideName, orderingArray) {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('userguide');
  const guides = db.collection('guides');

  // convert children strings -> objects with normalizedLabel
  const ordering = orderingArray.map(section => ({
    heading: section.heading,
    children: (section.children || []).map(label => ({
      label,
      label,
      normalizedLabel: normalize(label)
    }))
  }));

  const doc = {
    name: guideName,
    version: 1,
    ordering,
    status: 'active',
    dateCreated: new Date(),
    lastMatchedAt: null,
    matchedBy: null
  };

  // upsert by name
  await guides.updateOne({ name: guideName }, { $set: doc }, { upsert: true });
  await client.close();
}

// usage:
insertOrdering(process.env.MONGO_URI, 'Smart Audit - TOC', orderingArray)
  .then(() => console.log('Guides script finished.'))
  .catch(err => {
    console.error('Guides script failed:', err);
    process.exit(1);
  });
