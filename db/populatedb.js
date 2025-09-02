const { Client } = require("pg");

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();

  await client.query("BEGIN");

  await client.end();
  console.log("done");
}

main();
