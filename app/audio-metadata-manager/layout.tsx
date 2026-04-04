import { audioMetadataManagerMetadata } from "@/lib/audio-metadata-tool-seo";

export const metadata = audioMetadataManagerMetadata;

export default function AudioMetadataManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
