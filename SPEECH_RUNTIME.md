# Speech Runtime integration (macOS)

This patch targets `Hyroniem/handy-remote` at commit
`2edbd898f0dcdea8a9acea606665c8a4ef663e32`.

## Setup

1. Install and start [Speech Runtime](https://github.com/1tuz/Speech-Runtime).
2. Prepare `parakeet-ultra` or `gigaam` with `sr-model-prepare` / `wavo pull`,
   then confirm `sr health` and `sr models` work. First ANE load can take longer.
3. Build/install this patched Handy Remote; grant Microphone and Accessibility.
4. In Handy, go to **Models > Transcription Server**. Enable **Use External Server**,
   then **Use Speech Runtime (macOS)**.
5. Keep `parakeet-ultra` as the default model or enter `gigaam`.
6. Hold your dictation shortcut in any app, speak, release: Handy pastes the
   recognized text into the active text field through its normal paste path.

No API key needs to be pasted into Handy. The integration reads
`~/Library/Application Support/SpeechRuntime/token` on each dictation.
The request is sent only to `http://127.0.0.1:8477`:

- `GET /v1/models` to validate the selected model and check load state
- `POST /v1/models/load` when needed
- `POST /v1/audio/transcriptions?model=...&priority=interactive` with **raw WAV body**

The generic remote Whisper server remains available when the Speech Runtime
switch is off, with its unchanged multipart request and user API key.
Speech Runtime does not implement `/audio/translations` and this option explicitly
rejects Handy's **Translate to English** mode rather than silently ignoring it.
The existing Handy post-processing and custom-word correction still run after
transcription. The vocabulary hints themselves are not supported by Speech
Runtime's current transcription endpoint.

**Fallback:** The existing Handy local-model fallback can be enabled. Its
Whisper-specific busy deadline is intentionally disabled for Speech Runtime,
since an uncached ANE load may take tens of seconds. If the daemon cannot be
reached or returns an error, fallback works when a local Handy model is installed.
With fallback off, errors are reported instead of loading another model.

**Scope:** Current integration is batch-on-release, not live word-by-word text.
It does not modify the Speech Runtime daemon or any other Handy workflow.

## Applying

```sh
git apply --check handy-speech-runtime.patch
git apply handy-speech-runtime.patch
```

Build on macOS with the repository's documented Rust, Bun, and Xcode toolchain.
