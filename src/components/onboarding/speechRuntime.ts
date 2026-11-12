export async function connectSpeechRuntime(
  probe: () => Promise<void>,
  enable: (
    key: "remote_transcription_speech_runtime" | "remote_transcription_enabled",
  ) => Promise<void>,
) {
  await probe();
  await enable("remote_transcription_speech_runtime");
  await enable("remote_transcription_enabled");
}
