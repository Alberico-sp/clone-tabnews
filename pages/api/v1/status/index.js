import database from "infra/database.js";

async function status(request, response){
  const updatedAt = new Date().toISOString();

  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersionResult.rows[0].server_version;

  const dbMaxConnResult = await database.query("SHOW max_connections;");
  const dbMaxConnValue = dbMaxConnResult.rows[0].max_connections;
  
  const dbName = process.env.POSTGRES_DB;
  const dbOpenedConnResult = await database.query({
    text:"SELECT count(*)::int cont FROM pg_stat_activity where datname = $1;",
    values: [dbName],
  });
  const dbOpenedConnValue = dbOpenedConnResult.rows[0].cont;

  response.status (200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: dbMaxConnValue,
        opened_connections: dbOpenedConnValue,
      }
    }
  });
}

export default status;