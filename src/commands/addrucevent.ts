import {
  DiscordApplicationCommandOptionTypes,
  DiscordInteractionResponseTypes,
  sendInteractionResponse,
  snowflakeToBigint,
} from '../../deps.ts'
import { createCommand } from '../utils/helpers.ts'
import { ClientDB } from '../database/ClientDb.ts'
import { log } from '../utils/logger.ts'

createCommand({
  name: `addruccevent`,
  guildOnly: true,
  slash: {
    enabled: true,
    guild: true,
    global: false,
    advanced: true,
    options: [
      {
        required: true,
        name: 'title',
        description: 'Title of the event',
        type: DiscordApplicationCommandOptionTypes.String,
      },
      {
        required: true,
        name: 'description',
        description: 'Description of the event',
        type: DiscordApplicationCommandOptionTypes.String,
      },
      {
        required: true,
        name: 'hour:',
        description: 'Time of the event in 24-hour military time',
        type: DiscordApplicationCommandOptionTypes.String,
      },
      {
        required: true,
        name: 'day',
        description: 'Day of the event',
        type: DiscordApplicationCommandOptionTypes.String,
        choices: [
          {
            name: 'Monday',
            value: 'Monday',
          },
          {
            name: 'Tuesday',
            value: 'Tuesday',
          },
          {
            name: 'Wednesday',
            value: 'Wednesday',
          },
          {
            name: 'Thursday',
            value: 'Thursday',
          },
          {
            name: 'Friday',
            value: 'Friday',
          },
          {
            name: 'Saturday',
            value: 'Saturday',
          },
          {
            name: 'Sunday',
            value: 'Sunday',
          },
        ],
      },
    ],
    execute: async (data) => {
      const title = data.data?.options?.[0]
      const description = data.data?.options?.[1]
      const day = data.data?.options?.[2]

      const db = new ClientDB()
      if (title && description && day) {
        db.createRuccEvent({ title, description, day })
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
        }
      ).catch(log.error)
    },
  },
})
