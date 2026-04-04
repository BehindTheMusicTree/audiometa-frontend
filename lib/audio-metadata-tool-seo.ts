import type { Metadata } from "next";

export const audioMetadataManagerTitle = "Audio Metadata Manager";

export const audioMetadataManagerDescription =
  "Online audio metadata manager: upload a track to inspect metadata, edit writable tags, and download your changes in a short, private browser session.";

const toolOgTitle = `${audioMetadataManagerTitle} | Audiometa`;

export const audioMetadataManagerMetadata: Metadata = {
  title: audioMetadataManagerTitle,
  description: audioMetadataManagerDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: toolOgTitle,
    description: audioMetadataManagerDescription,
  },
  twitter: {
    title: toolOgTitle,
    description: audioMetadataManagerDescription,
  },
};
