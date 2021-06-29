import {
  DiscordApplicationCommandOptionTypes,
  DiscordInteractionResponseTypes,
  sendInteractionResponse,
  snowflakeToBigint,
} from "../../deps.ts";
import { createCommand } from "../utils/helpers.ts";
import { ClientDB } from "../database/ClientDb.ts";
import { log } from "../utils/logger.ts";

createCommand({
  name: `getclips`,
  guildOnly: true,
  slash: {
    enabled: true,
    guild: true,
    global: false,
    advanced: true,
    execute: async (data, member) => {
      const db = new ClientDB();
      let clips;
      if (member) {
        clips = db.getClips(member.tag);
        log.info(clips);
      }

      if (clips) {
        let content: string | undefined;
        clips?.forEach((clip) => {
          content += clip + "\n";
        });
        return await sendInteractionResponse(
          snowflakeToBigint(data.id),
          data.token,
          {
            type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: content,
              embeds: [
                {
                  author: {
                    name: member?.tag,
                  },
                },
              ],
            },
          },
        ).catch(log.error);
      }

      return await sendInteractionResponse(
        snowflakeToBigint(data.id),
        data.token,
        {
          type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
          data: {
            embeds: [
              {
                author: {
                  name: member?.tag,
                },
                description: "nothing in there",
              },
            ],
          },
        },
      ).catch(log.error);
    },
  },
});
