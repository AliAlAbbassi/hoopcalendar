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
  name: `clip`,
  guildOnly: true,
  slash: {
    enabled: true,
    guild: true,
    global: false,
    advanced: true,
    options: [
      {
        required: true,
        name: "content",
        description: "content to add to your clipboard",
        type: DiscordApplicationCommandOptionTypes.String,
      },
    ],
    execute: async (data, member) => {
      const arg = data.data?.options?.[0];

      const db = new ClientDB();
      if (data && member) {
        db.clipContent({
          content: arg,
          tag: member?.tag,
          userid: member?.id!,
        });
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
                description: data.message?.content,
              },
            ],
          },
        },
      ).catch(log.error);
    },
  },
});
