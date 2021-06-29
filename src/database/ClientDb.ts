import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { log } from "../utils/logger.ts";

export class ClientDB {
  db!: DB;

  constructor() {
    this.connectDB();
  }

  connectDB() {
    this.db = new DB("hoopcalendar.db");
    this.db.query(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, tag TEXT, userid TEXT)",
    );
    this.db.query(
      "CREATE TABLE IF NOT EXISTS clips (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, userid TEXT, tag TEXT)",
    );
  }

  clipContent = (options: { content: any; tag: string; userid: bigint }) => {
    this.db.query("INSERT INTO clips (content, tag, userid) VALUES (?, ?, ?)", [
      options.content.value,
      options.tag,
      options.userid,
    ]);
  };

  getClips = (tag: string) => {
    let result = [];
    for (
      const [
        content,
      ] of this.db.query("select content from clips where tag = ?", [tag])
    ) {
      log.info(content);
      result.push(content);
    }
    return result;
  };
}
