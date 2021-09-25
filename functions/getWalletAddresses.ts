import { Handler } from '@netlify/functions';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const channelId = process.env.CHANNEL_ID;
const token = process.env.DISCORD_TOKEN;

type Response = {
  body: string;
  statusCode: number;
};

const loop = async (beforeCursor?: string, allMessages = []) => {
  const { data: messages } = await axios(
    `https://discord.com/api/channels/${channelId}/messages?limit=100${`${
      beforeCursor ? `&before=${beforeCursor}` : ''
    }`}`,
    {
      headers: { Authorization: `Bot ${token}` },
    },
  );

  const addressesAndUsers = messages.map(message => {
    const { author, content } = message;
    const { discriminator, username } = author;

    return {
      user: `${username}#${discriminator}`,
      walletAddress: content,
    };
  });

  allMessages.push(addressesAndUsers);

  if (messages.length === 100) {
    return loop(messages[messages.length - 1].id, allMessages);
  } else {
    return allMessages.flat();
  }
};

const handler: Handler = async (): Promise<Response> => {
  const allMessages = await loop();

  return {
    statusCode: 200,
    body: JSON.stringify(allMessages),
  };
};

export { handler };
