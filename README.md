### SMP Bot

SMP Bot is an utility bot for my SMP Minecraft Server.

## Features

- **React Yes/No**: Allows owners to choose between accepting or rejecting whitelist applications.
- **Sticky Messages**: Let the bot send a message to a channel, and when someone requests whitelist, it will be pinned to latest messages.

## Setup

Follow these step to setup the bot:

1. Download and install Node.js (version 16 or above) from the official website.

2. Install the required dependencies by running the following command:
```
npm install
```

3. Modify the configuration in the `src/config.json` file according to your requirements. This file contains various settings that can be customized for your server.

4. Rename the file `.env.example` to `.env` and provide your secret information in this file. Make sure to update the necessary environment variables with your specific values.

5. Build source TS to JS and start the bot by running the following command:
```
npm run build
npm start
```

The bot will now be up and running.