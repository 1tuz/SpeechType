import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { SettingContainer } from "../ui/SettingContainer";
import { Input } from "../ui/Input";
import { Slider } from "../ui/Slider";
import { useSettings } from "../../hooks/useSettings";

interface RemoteTranscriptionProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
}

export const RemoteTranscription: React.FC<RemoteTranscriptionProps> =
  React.memo(({ descriptionMode = "tooltip", grouped = false }) => {
    const { t } = useTranslation();
    const { getSetting, updateSetting, isUpdating } = useSettings();

    const enabled = getSetting("remote_transcription_enabled") ?? false;
    const speechRuntime =
      getSetting("remote_transcription_speech_runtime") ?? false;
    const speechModel =
      getSetting("remote_transcription_speech_runtime_model") ??
      "parakeet-ultra";
    const url = getSetting("remote_transcription_url") ?? "";
    const apiKey = getSetting("remote_transcription_api_key") ?? "";
    const fallback = getSetting("remote_transcription_fallback") ?? true;
    const busyTimeoutMs =
      getSetting("remote_transcription_busy_timeout_ms") ?? 2000;
    const [localUrl, setLocalUrl] = useState(url);
    const [localApiKey, setLocalApiKey] = useState(apiKey);
    const [localSpeechModel, setLocalSpeechModel] = useState(speechModel);

    useEffect(() => {
      setLocalUrl(url);
    }, [url]);

    useEffect(() => {
      setLocalApiKey(apiKey);
    }, [apiKey]);

    useEffect(() => {
      setLocalSpeechModel(speechModel);
    }, [speechModel]);

    return (
      <>
        <ToggleSwitch
          checked={enabled}
          onChange={(enabled) =>
            updateSetting("remote_transcription_enabled", enabled)
          }
          isUpdating={isUpdating("remote_transcription_enabled")}
          label={t("settings.remoteTranscription.enabled.label")}
          description={t("settings.remoteTranscription.enabled.description")}
          descriptionMode={descriptionMode}
          grouped={grouped}
        />
        {enabled && (
          <ToggleSwitch
            checked={speechRuntime}
            onChange={(value) =>
              updateSetting("remote_transcription_speech_runtime", value)
            }
            isUpdating={isUpdating("remote_transcription_speech_runtime")}
            label={t("settings.remoteTranscription.speechRuntime.label")}
            description={t(
              "settings.remoteTranscription.speechRuntime.description",
            )}
            descriptionMode={descriptionMode}
            grouped={grouped}
          />
        )}
        {enabled && speechRuntime && (
          <SettingContainer
            title={t("settings.remoteTranscription.speechRuntime.modelTitle")}
            description={t(
              "settings.remoteTranscription.speechRuntime.modelDescription",
            )}
            descriptionMode={descriptionMode}
            grouped={grouped}
          >
            <Input
              type="text"
              value={localSpeechModel}
              onChange={(event) => setLocalSpeechModel(event.target.value)}
              onBlur={() => {
                const model = localSpeechModel.trim();
                if (model && model !== speechModel) {
                  updateSetting(
                    "remote_transcription_speech_runtime_model",
                    model,
                  );
                } else if (!model) {
                  setLocalSpeechModel(speechModel);
                }
              }}
              placeholder="parakeet-ultra"
              variant="compact"
              disabled={isUpdating("remote_transcription_speech_runtime_model")}
              className="flex-1 min-w-[280px]"
            />
          </SettingContainer>
        )}
        {enabled && !speechRuntime && (
          <SettingContainer
            title={t("settings.remoteTranscription.url.title")}
            description={t("settings.remoteTranscription.url.description")}
            descriptionMode={descriptionMode}
            grouped={grouped}
          >
            <Input
              type="text"
              value={localUrl}
              onChange={(event) => setLocalUrl(event.target.value)}
              onBlur={() => {
                if (localUrl !== url) {
                  updateSetting("remote_transcription_url", localUrl.trim());
                }
              }}
              placeholder="http://127.0.0.1:8000/v1"
              variant="compact"
              disabled={isUpdating("remote_transcription_url")}
              className="flex-1 min-w-[280px]"
            />
          </SettingContainer>
        )}
        {enabled && !speechRuntime && (
          <SettingContainer
            title={t("settings.remoteTranscription.apiKey.title")}
            description={t("settings.remoteTranscription.apiKey.description")}
            descriptionMode={descriptionMode}
            grouped={grouped}
          >
            <Input
              type="password"
              value={localApiKey}
              onChange={(event) => setLocalApiKey(event.target.value)}
              onBlur={() => {
                if (localApiKey !== apiKey) {
                  updateSetting(
                    "remote_transcription_api_key",
                    localApiKey.trim(),
                  );
                }
              }}
              placeholder={t("settings.remoteTranscription.apiKey.placeholder")}
              autoComplete="off"
              variant="compact"
              disabled={isUpdating("remote_transcription_api_key")}
              className="flex-1 min-w-[280px]"
            />
          </SettingContainer>
        )}
        {enabled && (
          <ToggleSwitch
            checked={fallback}
            onChange={(enabled) =>
              updateSetting("remote_transcription_fallback", enabled)
            }
            isUpdating={isUpdating("remote_transcription_fallback")}
            label={t("settings.remoteTranscription.fallback.label")}
            description={t("settings.remoteTranscription.fallback.description")}
            descriptionMode={descriptionMode}
            grouped={grouped}
          />
        )}
        {enabled && fallback && !speechRuntime && (
          <Slider
            value={busyTimeoutMs}
            onChange={(value) =>
              updateSetting("remote_transcription_busy_timeout_ms", value)
            }
            min={0}
            max={10000}
            step={500}
            label={t("settings.remoteTranscription.busyTimeout.label")}
            description={t(
              "settings.remoteTranscription.busyTimeout.description",
            )}
            descriptionMode={descriptionMode}
            grouped={grouped}
            formatValue={(v) =>
              v === 0
                ? t("settings.remoteTranscription.busyTimeout.off")
                : t("settings.remoteTranscription.busyTimeout.seconds", {
                    seconds: v / 1000,
                  })
            }
          />
        )}
      </>
    );
  });

RemoteTranscription.displayName = "RemoteTranscription";
