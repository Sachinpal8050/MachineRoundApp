// ── config ────────────────────────────────────────────────────────
// Change this to your server IP when running on a physical device
// e.g. 'http://192.168.1.42:3000'
export const BASE_URL = 'http://192.168.1.7:3000';

// ── chat ──────────────────────────────────────────────────────────

/**
 * Send a chat message to Spoke.
 * Supports both regular JSON and streaming responses.
 *
 * @param {Object[]} messages  - Full conversation history
 * @param {string}   rawInput  - Raw user input string
 * @param {Object}   options
 * @param {Function} options.onChunk   - Called with each streamed text chunk
 * @param {Function} options.onDone    - Called with final parsed result object
 * @param {Function} options.onError   - Called on network/parse error
 * @param {AbortSignal} options.signal - AbortController signal for cancellation
 */
export async function sendChat(
  messages,
  rawInput,
  {onChunk, onDone, onError, signal} = {},
) {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages, raw_input: rawInput}),
      signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({error: `HTTP ${res.status}`}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || '';

    // ── streaming path ────────────────────────────────────────────
    if (
      contentType.includes('text/event-stream') ||
      contentType.includes('text/plain')
    ) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, {stream: true});
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              // OpenAI-style streaming delta
              const chunk =
                parsed.choices?.[0]?.delta?.content || parsed.chunk || '';
              if (chunk) {
                accumulated += chunk;
                onChunk?.(chunk, accumulated);
              }
              // Final result object from Spoke
              if (parsed.reply !== undefined) {
                onDone?.(parsed);
              }
            } catch {
              // raw text chunk
              if (data) {
                accumulated += data;
                onChunk?.(data, accumulated);
              }
            }
          }
        }
      }

      // If stream ended without explicit done event, synthesize result
      if (accumulated && !accumulated.includes('[DONE]')) {
        onDone?.({reply: accumulated, action: null, saved: false});
      }
      return;
    }

    // ── regular JSON path ─────────────────────────────────────────
    const data = await res.json();
    // Simulate streaming for a smoother UX even on non-streaming responses
    if (onChunk && data.reply) {
      const words = data.reply.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? '' : ' ') + words[i];
        onChunk(chunk, words.slice(0, i + 1).join(' '));
        await sleep(18); // ~55 words/sec
      }
    }
    onDone?.(data);
  } catch (err) {
    if (err.name === 'AbortError') return;
    onError?.(err);
  }
}

// ── reminders ─────────────────────────────────────────────────────

export async function fetchReminders() {
  const res = await fetch(`${BASE_URL}/reminders`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.ok;
}

// ── utils ─────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));
