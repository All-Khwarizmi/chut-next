import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import AuthRouter from "./authRouter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Chut",
  description:
    "Stay on task and keep noise levels in check with the Chut app. Chut is a noise meter app designed to help students stay productive during group work. When surrounding conversations get too loud, Chut emits an audible alert to gently remind students to lower their voices. By monitoring noise levels in real time, Chut allows students to self-regulate their volume and stay focused on the task at hand.",
  icons: [{ rel: "icon", url: "/chut-carre.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        {" "}
        <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
