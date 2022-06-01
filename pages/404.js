import React from "react";
import Head from "next/head";
import Image from "next/image";

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Head>
        <title>Sayfa Bulunamadı • 404</title>
        <meta name="description" content="Sayfa bulunamadı" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Image
        src="/404.svg"
        height={400}
        width={400}
        alt="404-not-found-image"
      />
    </div>
  );
}

export default NotFound;
