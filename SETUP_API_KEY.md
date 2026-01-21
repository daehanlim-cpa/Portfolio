# How to Get Your Google API Key

To enable the AI Resume Chat feature, you need a Google Gemini API key. It's free and easy to get!

## Step 1: Get the Key
1. Go to **[Google AI Studio](https://makersuite.google.com/app/apikey)** (you may need to sign in with a Google account).
2. Click the blue **"Create API key"** button.
3. Select **"Create API key in new project"**.
4. Copy the generated key string (it starts with `AIza...`).

## Step 2: Save it to Your Project
1. Open your project folder in VS Code.
2. Look for a file named `.env.local`. 
   - *If it doesn't exist, create a new file named `.env.local` in the root folder (same level as `package.json`).*
3. Paste your key into the file like this:

```bash
GOOGLE_API_KEY=AIzaSyD... (paste your actual key here)
```

4. Save the file.

## Step 3: Enable the Chat
Once the key is saved:
1. Open your terminal in VS Code.
2. Run this command to "teach" the AI about your resume:

```bash
npm run build:embeddings
```

3. You should see a success message! Now your resume chat is ready to answer questions.
