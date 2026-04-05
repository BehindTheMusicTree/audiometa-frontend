import type { ReactNode } from "react";
import "./globals.css";
import "@behindthemusictree/assets/styles/icon-links.css";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
