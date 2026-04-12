# Spoke – React Native UI

Clean, dark chat interface for the Spoke personal reminder assistant backend.

## File structure

```
SpokeApp/
├── App.js                    # Navigation shell (bottom tabs)
├── theme.js                  # Design tokens — colors, radii, fonts
├── api.js                    # HTTP layer with streaming support
├── screens/
│   ├── ChatScreen.js         # Main chat UI with streaming + action badges
│   └── RemindersScreen.js    # Pending reminders queue with pull-to-refresh
└── package.json
```

## Setup

### 1. Create a new React Native project

```bash
npx react-native@latest init SpokeApp
cd SpokeApp
```

### 2. Install dependencies

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs \
            react-native-screens react-native-safe-area-context
```

For iOS:
```bash
cd ios && pod install && cd ..
```

### 3. Copy these files into your project

Replace `App.js` and copy `theme.js`, `api.js`, and the `screens/` folder.

### 4. Point to your server

Edit `api.js` and change `BASE_URL`:

```js
// For Android emulator (localhost maps to 10.0.2.2)
export const BASE_URL = 'http://10.0.2.2:3000';

// For iOS simulator
export const BASE_URL = 'http://localhost:3000';

// For physical device (use your machine's local IP)
export const BASE_URL = 'http://192.168.x.x:3000';
```

### 5. Run

```bash
# Start Metro bundler
npx react-native start

# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

---

## Features

### Chat screen
- Full conversation history sent to the backend on every turn
- **Streaming support** — handles both `text/event-stream` (SSE) and regular JSON
- When the server returns plain JSON, the reply is word-by-word animated for a smooth feel
- Blinking cursor shown while streaming
- **Action badges** inline in bot messages:
  - ✓ Green badge when a reminder is saved (shows `#id`)
  - ✕ Red badge when reminder(s) are deleted
  - ⚠ Yellow badge when a duplicate was blocked (shows conflicting entry)
- Typing dots indicator while waiting for first token
- Quick-prompt chips on first load
- Haptic feedback on send + on reminder saved/deleted
- AbortController — cancels in-flight request if user sends again

### Reminders screen
- Summary bar: total / urgent / overdue counts
- Pull-to-refresh
- Auto-refreshes whenever the tab is focused
- Each card shows: priority pill, category color dot, relative time ("in 23m"), absolute time, early-warning badge
- Overdue reminders get a red accent bar + red relative time
- Staggered entrance animation

---

## Streaming — server-side setup (optional)

The app is ready for streaming. To enable it in your Spoke backend, change the
DeepSeek call in `chat.js`:

```js
const stream = await deepseek.chat.completions.create({
  model: 'deepseek-chat',
  messages: [...],
  max_tokens: 400,
  temperature: 0.3,
  stream: true,   // ← add this
});

res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');

for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta?.content || '';
  if (delta) res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: delta } }] })}\n\n`);
}
res.write('data: [DONE]\n\n');
res.end();
```

The client already handles this format — no changes needed on the RN side.
