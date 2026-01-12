# Environment Variables Setup

## Quick Start

1. **Create a `.env` file** in the root directory of the project:
   ```bash
   touch .env
   ```

2. **Add your OpenAI API key** to the `.env` file:
   ```
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Restart your Expo development server** for changes to take effect:
   ```bash
   npm start
   # Then press 'r' to reload, or restart completely
   ```

## Environment Variables

### Required

- `EXPO_PUBLIC_OPENAI_API_KEY` - Your OpenAI API key from https://platform.openai.com/api-keys

### Optional

- `EXPO_PUBLIC_ENVIRONMENT` - Set to `development`, `staging`, or `production` (defaults to `development` in dev mode)
- `EXPO_PUBLIC_API_URL` - Backend API URL (defaults to `http://localhost:3000`)

## Important Notes

1. **`.env` file is gitignored** - Your API keys will NOT be committed to the repository
2. **Use `EXPO_PUBLIC_` prefix** - Only variables with this prefix are exposed to your app
3. **Restart required** - After creating/modifying `.env`, restart the Expo dev server
4. **For production builds** - Use EAS Secrets or CI/CD environment variables

## Alternative: app.json (Not Recommended for Secrets)

You can also add config to `app.json` under the `extra` field, but this is **NOT recommended for API keys** as it will be committed to git:

```json
{
  "expo": {
    "extra": {
      "openaiApiKey": "your-key-here"
    }
  }
}
```

## Getting Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and add it to your `.env` file

## Troubleshooting

- **"OpenAI API key not configured"** - Make sure your `.env` file exists and has `EXPO_PUBLIC_OPENAI_API_KEY` set
- **Changes not taking effect** - Restart the Expo dev server completely
- **Key not found** - Check that the variable name starts with `EXPO_PUBLIC_`
