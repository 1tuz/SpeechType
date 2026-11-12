import { expect, test } from "bun:test";
import { connectSpeechRuntime } from "../src/components/onboarding/speechRuntime";

test("enables Speech Runtime only after a successful probe", async () => {
  const changes: string[] = [];
  await expect(
    connectSpeechRuntime(
      async () => {
        throw new Error("offline");
      },
      async (key) => {
        changes.push(key);
      },
    ),
  ).rejects.toThrow("offline");
  expect(changes).toEqual([]);
  await connectSpeechRuntime(
    async () => {},
    async (key) => {
      changes.push(key);
    },
  );
  expect(changes).toEqual([
    "remote_transcription_speech_runtime",
    "remote_transcription_enabled",
  ]);
});
