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

    this.db.query(
      "CREATE TABLE IF NOT EXISTS event (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, userid TEXT, tag TEXT, description TEXT, day TEXT, month TEXT, year TEXT, date TIMESTAMP)",
    );

    this.db.query(
      "CREATE TABLE IF NOT EXISTS ruccevent (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, userid TEXT, tag TEXT, description TEXT, day TEXT)",
    );
  }

  addClip = (options: { content: any; tag: string; userid: bigint }) => {
    this.db.query("INSERT INTO clips (content, tag, userid) VALUES (?, ?, ?)", [
      options.content.value,
      options.tag,
      options.userid,
    ]);
  };

  deleteClip = (id: any) => {
    this.db.query("DELETE FROM clips where id = ?", [id]);
  };

  getClips = (tag: string) => {
    const result = [];
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

  createEvent = (options: any) => {
    const date = new Date(
      options.year.value,
      options.month.value,
      options.day.value,
    );
    this.db.query(
      "INSERT INTO event (title, description, day, month, year, date) VALUES(?, ?, ?, ?, ?, ?)",
      [
        options.title,
        options.description,
        options.day,
        options.month,
        options.year,
        date,
      ],
    );
  };

  deleteEvent = (id: any) => {
    this.db.query("DELETE FROM event where id = ?", [id]);
  };

  createRuccEvent = (options: any) => {
    this.db.query(
      "INSERT INTO ruccevent (title, description, day) VALUES(?, ?, ?)",
      [options.title, options.description, options.day],
    );
  };

  deleteRuccEvent = (id: any) => {
    this.db.query("DELETE FROM ruccevent where id = ?", [id]);
  };
}
