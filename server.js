const express = require('express');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');
const cors = require('cors'); // Add this line

const app = express();
const PORT = 5000;

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'Ankith123'));
const session = driver.session();

app.use(bodyParser.json());
app.use(cors()); // Add this line to enable CORS

app.post('/api/packages', async (req, res) => {
  const { numPackages, weight, deliveryMode, sourceCity, sourceHub, destinationCity, destinationHub } = req.body;
  console.log('Received package data:', req.body); // Log received data

  try {
    const result = await session.run(
      'CREATE (p:Package {numPackages: $numPackages, weight: $weight, deliveryMode: $deliveryMode, sourceCity: $sourceCity, sourceHub: $sourceHub, destinationCity: $destinationCity, destinationHub: $destinationHub}) RETURN p',
      { numPackages, weight, deliveryMode, sourceCity, sourceHub, destinationCity, destinationHub }
    );
    console.log('Neo4j response:', result); // Log Neo4j response
    res.status(200).json(result.records[0].get('p'));
  } catch (error) {
    console.error('Error saving to Neo4j:', error); // Log error
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
