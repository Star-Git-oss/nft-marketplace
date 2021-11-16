import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BetaBanner from 'components/base/BetaBanner';
import MainHeader from 'components/base/MainHeader';
import Landing from 'components/pages/Landing';
import TernoaWallet from 'components/base/TernoaWallet';
import NotAvailableModal from 'components/base/NotAvailable';
import arrayShuffle from 'array-shuffle';
import cookies from 'next-cookies';

import { getUser, getUsers } from 'actions/user';
import { getNFTs } from 'actions/nft';
import { NftType, UserType } from 'interfaces';
import { NextPageContext } from 'next';
import { decryptCookie, setUserFromDApp } from 'utils/cookie';

export interface LandingProps {
  user: UserType;
  users: UserType[];
  popularNfts: NftType[];
  bestSellingNfts: NftType[];
  NFTCreators: NftType[];
  totalCountNFT: number;
}
const LandingPage: React.FC<LandingProps> = ({
  user,
  users,
  popularNfts,
  bestSellingNfts,
  NFTCreators,
  totalCountNFT,
}) => {
  const [modalExpand, setModalExpand] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);
  const [walletUser, setWalletUser] = useState(user);

  useEffect(() => {
    setUserFromDApp(setWalletUser)
  }, []);
  
  return (
    <>
      <Head>
        <title>
          {process.env.NEXT_PUBLIC_APP_NAME
            ? process.env.NEXT_PUBLIC_APP_NAME
            : 'SecretNFT'}{' '}
          - Welcome
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="SecretNFT Marketplace, by Ternoa." />
        <meta name="og:image" content="ternoa-social-banner.jpg" />
        <meta property="og:image" content="ternoa-social-banner.jpg" />
      </Head>
      {modalExpand && <TernoaWallet setModalExpand={setModalExpand} />}
      {notAvailable && <NotAvailableModal setNotAvailable={setNotAvailable} />}
      <BetaBanner />
      <MainHeader
        user={walletUser as UserType}
        setModalExpand={setModalExpand}
      />
      <Landing
        setModalExpand={setModalExpand}
        setNotAvailable={setNotAvailable}
        user={walletUser as UserType}
        users={users}
        popularNfts={popularNfts}
        bestSellingNfts={bestSellingNfts}
        NFTCreators={NFTCreators}
        totalCountNFT={totalCountNFT}
      />
    </>
  );
};
export async function getServerSideProps(ctx: NextPageContext) {
  const token =
    (ctx.query.walletId as string) ||
    (cookies(ctx).token && decryptCookie(cookies(ctx).token as string));
  let users: UserType[] = [],
    user: UserType | null = null,
    regularNfts: NftType[] = [];
  const promises = [];
  promises.push(
    new Promise<void>((success) => {
      getUsers(undefined,true)
        .then((result) => {
          users = result.data;
          success();
        })
        .catch(success);
    })
  );
  if (token) {
    promises.push(
      new Promise<void>((success) => {
        getUser(token)
          .then((_user) => {
            user = _user;
            success();
          })
          .catch(success);
      })
    );
  }
  promises.push(
    new Promise<void>((success) => {
      getNFTs(undefined, '1', '19', true, true)
        .then((result) => {
          regularNfts = result.data;
          success();
        })
        .catch(success);
    })
  );
  await Promise.all(promises);
  users = arrayShuffle(users);
  let popularNfts = arrayShuffle((regularNfts || []).slice(0, 8));
  let bestSellingNfts = arrayShuffle((regularNfts || []).slice(8, 16));
  let NFTCreators = arrayShuffle((regularNfts || []).slice(16, 19));
  let totalCountNFT = (regularNfts || []).length;
  return {
    props: {
      user,
      users,
      popularNfts,
      bestSellingNfts,
      NFTCreators,
      totalCountNFT,
    },
  };
}

export default LandingPage;
