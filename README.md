# Mailman
Open-source Discord bot that allows you to verify and whitelist emails for your Discord server.

Mailman was made to allow anyone to host their own instance of the bot. This allows you to have full control over the bot and its data.

### Requirements
**Node.js 18.18.0 or higher is required.**

| Package | Version |
| ------- | ------- |
| better-sqlite3 | ^8.6.0 |
| discord.js | ^14.13.0 |
| nodemailer | ^6.9.5 |

### Setup
1. Clone the [repository](https://github.com/UnidentifiedX/Mailman) or use the built JavaScript files through [releases](https://github.com/UnidentifiedX/Mailman/releases/latest).
2. Run `npm install` to install the required packages.
3. Create a `config.json` file in the `/src/` folder.
4. Build the TypeScript files (skip this step if you are using the built JavaScript files).
5. Run `node src/index.js` to start the bot.

**config.json**
```json
{
    "token": "your-bot-token-here",
    "sender_email": "your-email-here",
    "sender_password": "your-email-password-here"
}
```
<sup><sub>Currently, only Gmail is supported.</sub></sup>

Note: If you are using Gmail, you will need to enable [less secure apps](https://myaccount.google.com/lesssecureapps) for the bot to be able to send emails.