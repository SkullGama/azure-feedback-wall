const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

function getTableClient() {
  const conn = process.env.TABLE_CONNECTION_STRING;
  const tableName = process.env.TABLE_NAME || "appdata";
  if (!conn) throw new Error("Missing TABLE_CONNECTION_STRING");
  return TableClient.fromConnectionString(conn, tableName);
}

app.http("visits", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request) => {
    const table = getTableClient();

    const partitionKey = "counter";
    const rowKey = "visits";

    let entity;
    try {
      entity = await table.getEntity(partitionKey, rowKey);
    } catch (e) {
      if (e.statusCode === 404) {
        entity = { partitionKey, rowKey, count: 0 };
      } else {
        throw e;
      }
    }

    if (request.method === "POST") {
      entity.count = (Number(entity.count) || 0) + 1;
      await table.upsertEntity(entity, "Replace");
    }

    return {
      headers: { "cache-control": "no-store" },
      jsonBody: { count: Number(entity.count) || 0 }
    };
  }
});