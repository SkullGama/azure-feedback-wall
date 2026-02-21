const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

function getTableClient() {
  const conn = process.env.TABLE_CONNECTION_STRING;
  const tableName = process.env.TABLE_NAME || "appdata";
  if (!conn) throw new Error("Missing TABLE_CONNECTION_STRING");
  return TableClient.fromConnectionString(conn, tableName);
}

function safeText(s, max) {
  const t = String(s ?? "").trim();
  return t.length > max ? t.slice(0, max) : t;
}

app.http("feedback", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request) => {
    const table = getTableClient();

    if (request.method === "POST") {
      const body = await request.json();
      const name = safeText(body.name || "Anonymous", 40) || "Anonymous";
      const message = safeText(body.message, 280);

      if (!message) {
        return { status: 400, jsonBody: { error: "Message is required" } };
      }

      const now = new Date();
      const rowKey = `${now.toISOString()}_${Math.random().toString(16).slice(2)}`;

      await table.createEntity({
        partitionKey: "feedback",
        rowKey,
        name,
        message
      });

      return { status: 201, jsonBody: { ok: true } };
    }

    // GET: return latest ~10
    const items = [];
    for await (const e of table.listEntities({
      queryOptions: { filter: `PartitionKey eq 'feedback'` }
    })) {
      items.push({ name: e.name, message: e.message, rowKey: e.rowKey });
    }

    items.sort((a, b) => (a.rowKey < b.rowKey ? 1 : -1));
    return { jsonBody: { items: items.slice(0, 10) } };
  }
});