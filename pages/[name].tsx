import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AlphaBanner from 'components/base/AlphaBanner';
import MainHeader from 'components/base/MainHeader';
import TernoaWallet from 'components/base/TernoaWallet';
import PublicProfile from 'components/pages/PublicProfile';
import NotAvailableModal from 'components/base/NotAvailable';
import cookies from 'next-cookies';

import { getUser, getProfile } from 'actions/user';
import { getProfileNFTS } from 'actions/nft';
import { NftType, UserType } from 'interfaces';
import { NextPageContext } from 'next';

export interface PublicProfileProps {
  user: UserType;
  profile: UserType;
  data: NftType[];
}

const PublicProfilePage: React.FC<PublicProfileProps> = ({
  user,
  data,
  profile,
}) => {
  const [modalExpand, setModalExpand] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);
  const [walletUser, setWalletUser] = useState(user);
  const [viewProfile, setViewProfile] = useState(profile);

  useEffect(() => {
    async function callBack() {
      try {
        let res = await getUser(window.walletId);
        setWalletUser(res);
      } catch (error) {
        console.error(error);
      }
    }
    if (window.isRNApp && window.walletId) callBack();
  }, []);

  return (
    <>
      <Head>
        <title>SecretNFT - {viewProfile.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content={`Ternoart - ${viewProfile.name} profile page.`}
        />
        <meta name="og:image" content="ternoa-social-banner.jpg" />
      </Head>
      {modalExpand && <TernoaWallet setModalExpand={setModalExpand} />}
      {notAvailable && <NotAvailableModal setNotAvailable={setNotAvailable} />}
      <AlphaBanner />
      <MainHeader user={walletUser} setModalExpand={setModalExpand} />
      <PublicProfile
        user={walletUser}
        setUser={setWalletUser}
        profile={viewProfile}
        setProfile={setViewProfile}
        NFTS={data}
        setModalExpand={setModalExpand}
        setNotAvailable={setNotAvailable}
      />
    </>
  );
};
export async function getServerSideProps(ctx: NextPageContext) {
  try {
    let user = null;
    let data: NftType[] = [];
    try {
      const token = cookies(ctx).token;
      if (token) {
        user = await getUser(token);
      }
    } catch (error) {
      console.error(error);
    }
    const profile = await getProfile(ctx.query.name as string);
    data = await getProfileNFTS(ctx.query.name as string).catch(() => []);

    return {
      props: { user, profile, data },
    };
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
}

export default PublicProfilePage;
