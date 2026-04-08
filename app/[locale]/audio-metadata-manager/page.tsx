import AudioMetadataManagerClient from "@/app/audio-metadata-manager/AudioMetadataManagerClient";

export default function AudioMetadataManagerPage() {
  const audiometaPythonGithubUrl =
    process.env.AUDIOMETA_GITHUB_REPO_URL!.trim();
  return (
    <AudioMetadataManagerClient
      audiometaPythonGithubUrl={audiometaPythonGithubUrl}
    />
  );
}
