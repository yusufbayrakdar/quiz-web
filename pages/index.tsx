import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useRedux from "../hooks/useRedux";

const Home: NextPage = () => {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const confirmUserId = router.query?.confirm;

  useEffect(() => {
    if (confirmUserId) {
      dispatchAction($.EMAIL_CONFIRM, confirmUserId);
    }
  }, [confirmUserId]);

  return (
    <div>
      <Head>
        <title>Ana Sayfa</title>
        <meta name="description" content="Best for your tooth" />
        <link rel="icon" href="/ideas.png" />
      </Head>

      <main>
        {/* <h1 className="text-center text-4xl font-bold text-blue-900">
          BilsemIQ'e Hoşgeldiniz
        </h1> */}
        <img src="ideas.png" alt="ideas" />
      </main>
    </div>
  );
};

export default Home;
