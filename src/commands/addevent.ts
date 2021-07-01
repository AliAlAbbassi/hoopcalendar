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
  name: `addevent`,
  guildOnly: true,
  slash: {
    enabled: true,
    guild: true,
    global: false,
    advanced: true,
    options: [
      {
        required: true,
        name: "title",
        description: "Title of the event",
        type: DiscordApplicationCommandOptionTypes.String,
      },
      {
        required: true,
        name: "description",
        description: "Description of the event",
        type: DiscordApplicationCommandOptionTypes.String,
      },
      {
        required: true,
        name: "hour",
        description: "Time of the event in 24-hour military time",
        type: DiscordApplicationCommandOptionTypes.String,
      },
      {
        required: true,
        name: "day",
        description: "Day of the event",
        type: DiscordApplicationCommandOptionTypes.String,
      },
      {
        required: true,
        name: "month",
        description: "Month of the event",
        type: DiscordApplicationCommandOptionTypes.String,
        choices: [
          {
            name: "January",
            value: "Jan",
          },
          {
            name: "February",
            value: "Feb",
          },
          {
            name: "March",
            value: "Mar",
          },
          {
            name: "April",
            value: "Apr",
          },
          {
            name: "May",
            value: "May",
          },
          {
            name: "June",
            value: "Jun",
          },
          {
            name: "July",
            value: "July",
          },
          {
            name: "August",
            value: "Aug",
          },
          {
            name: "September",
            value: "Sep",
          },
          {
            name: "October",
            value: "Oct",
          },
          {
            name: "November",
            value: "Nov",
          },
          {
            name: "December",
            value: "Dec",
          },
        ],
      },
      {
        required: true,
        name: "year",
        description: "Year of the event",
        type: DiscordApplicationCommandOptionTypes.String,
      },
    ],
    execute: async (data) => {
      const title = data.data?.options?.[0];
      const description = data.data?.options?.[1];
      const day = data.data?.options?.[2];
      const month = data.data?.options?.[3];
      const year = data.data?.options?.[4];

      const db = new ClientDB();
      if (title && description && day && month && year) {
        db.createEvent({ title, description, day, month, year });
      }
      return await sendInteractionResponse(
        snowflakeToBigint(data.id),
        data.token,
        {
          type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
          data: {
            embeds: [
              {
                title: `Event added!`,
              },
            ],
          },
        },
      ).catch(log.error);
    },
  },
});
