import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import AuthRouter from "../utils/router/auth-router";
import Layout from "./_components/layout-component";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Chut",
  description:
    "Chut - Application de gestion sonore en classe. Chut aide les enseignants à maintenir un niveau sonore optimal dans les salles de classe grâce à des alertes audibles en temps réel et la possibilité de télécharger ou enregistrer jusqu'à 20 sons personnalisés avec Chut Premium. Améliorez votre environnement d'apprentissage dès aujourd'hui.",
  icons: [{ rel: "icon", url: "/chut-carre.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-primaryColor font-sans ${inter.variable}`}>
        {" "}
        <AuthRouter>
          <Layout>
            <TRPCReactProvider headers={headers()}>
              <Suspense fallback={<div>Loading...</div>}> {children}</Suspense>
            </TRPCReactProvider>
          </Layout>
        </AuthRouter>
      </body>
    </html>
  );
}
