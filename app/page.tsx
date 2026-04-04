import AudioMetadataManagerClient from "@/app/audio-metadata-manager/AudioMetadataManagerClient";
import { audioMetadataManagerMetadata } from "@/lib/audio-metadata-tool-seo";

export const metadata = audioMetadataManagerMetadata;

export default function HomePage() {
  return <AudioMetadataManagerClient />;
}
