import React from "react";
import Head from "next/head";
import ProfilePage from "../components/ProfilePage";

function Profile() {
  return (
    <>
      <Head>
        <title>BilsemAI | Profil</title>
        <meta name="questions" content="Profil" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <ProfilePage />
    </>
  );
}

export default Profile;
