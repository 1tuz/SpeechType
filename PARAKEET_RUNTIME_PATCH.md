# Handy + Speech Runtime: Parakeet-only patch

The integration intentionally uses only `parakeet-ultra`. The previously
editable model name remains in persisted settings only for compatibility,
but the Speech Runtime client ignores it. Generic external Whisper-server
mode stays available for other users of the upstream fork.

Changes:
- Preflight starts at recording start, validates the Runtime model catalog,
  and attempts to warm Parakeet Ultra while the microphone is recording.
- Batch-on-release dictation uses the Runtime's `interactive` priority.
- File imports and history retranscription use Runtime `batch` priority,
  without loading an additional Handy ASR model.
- In Parakeet mode, failures are visible; **no Whisper fallback**.
- Cancel drops the client's in-flight HTTP request; for one-shot batch calls,
  Runtime may keep working until its current job completes.
- The language hint is deliberately omitted for the mixed RU/EN Parakeet
  configuration. Post-recognition word corrections remain local to Handy.

Not included in this patch: a real streaming UI with utterance events,
word-by-word interim hypotheses, automatic Smart Turn, per-app presets,
and the shared dictionary format. Those require additional client work
or separate Runtime contracts and are covered in the agent prompt.

The existing built-in model selection elsewhere in Handy is not removed:
other OSes and the generic upstream external-server mode still use it.
