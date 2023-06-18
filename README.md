### Wildlands Bot

Misc for my smp minecraft server

## Features

- **React Yes/No**: If yes, the user who request whitelist will be received the whitelist role.
- **Sticky Messages**: Let the bot send a message to a channel, and when someone requests whitelist, it will be pinned to latest bot messages.

## Setup

Follow these step to setup the bot:

1. Download and install Node.js (v16.6+) from the official website.

2. Install the required dependencies by running the command:
```
npm install
```

3. Modify the configuration in the `src/config.json` file according to your requirements. 

4. Rename the file `.env.example` to `.env` and provide your secret information in this file.

5. Run the bot:
- Development (requries ts-node on your system):
```
ts-node .
``` 
- Production:
```
npm start
```

The bot will be started.