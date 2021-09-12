import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AlphaBanner from 'components/base/AlphaBanner';
import MainHeader from 'components/base/MainHeader';
import Landing from 'components/pages/Landing';
import TernoaWallet from 'components/base/TernoaWallet';
import NotAvailableModal from 'components/base/NotAvailable';
import Cookies from 'js-cookie';
import arrayShuffle from 'array-shuffle';
import cookies from 'next-cookies';

import { getUser, getUsers } from 'actions/user';
import { getCategoryNFTs } from 'actions/nft';
import { NftType, UserType } from 'interfaces';
import { NextPageContext } from 'next';

export interface LandingProps {
  user: UserType;
  users: UserType[];
  popularNfts: NftType[];
  bestSellingNfts: NftType[];
  betaNfts: NftType[];
  NFTCreators: NftType[];
  totalCountNFT: number;
}

const LandingPage: React.FC<LandingProps> = ({
  user,
  users,
  popularNfts,
  bestSellingNfts,
  betaNfts,
  NFTCreators,
  totalCountNFT,
}) => {
  const [modalExpand, setModalExpand] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);

  useEffect(() => {
    if (window.isRNApp && window.walletId && (!Cookies.get('token') || Cookies.get('token')!==window.walletId)){
      Cookies.remove('token')
      Cookies.set('token', window.walletId, { expires: 1 });
    }
  }, []);

  return (
    <>
      <Head>
        <title>SecretNFT - Welcome</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="SecretNFT Marketplace, by Ternoa." />
        <meta name="og:image" content="ternoa-social-banner.jpg" />
        <meta property="og:image" content="ternoa-social-banner.jpg" />
      </Head>
      {modalExpand && <TernoaWallet setModalExpand={setModalExpand} />}
      {notAvailable && <NotAvailableModal setNotAvailable={setNotAvailable} />}
      <AlphaBanner />
      <MainHeader user={user} setModalExpand={setModalExpand} />
      <Landing
        setModalExpand={setModalExpand}
        setNotAvailable={setNotAvailable}
        user={user}
        users={users}
        popularNfts={popularNfts}
        bestSellingNfts={bestSellingNfts}
        betaNfts={betaNfts}
        NFTCreators={NFTCreators}
        totalCountNFT={totalCountNFT}
      />
    </>
  );
};
export async function getServerSideProps(ctx: NextPageContext) {
  const token = ctx.query.walletId as string || cookies(ctx).token;
  // category code for beta testers NFTs
  const BETA_CODE = '001';
  let users: UserType[] = [], user: UserType | null = null, regularNfts: NftType[] = [], betaNfts: NftType[] = [];
  const promises = [];
  promises.push(new Promise<void>((success) => {
    getUsers().then(_users => {
      users = _users
      success();
    }).catch(success);
  }));
  if (token) {
    promises.push(new Promise<void>((success) => {
      getUser(token).then(_user => {
        user = _user
        success();
      }).catch(success);
    }));
  }
  promises.push(new Promise<void>((success) => {
    getCategoryNFTs().then(result => {
      regularNfts = result.nodes
      success();
    }).catch(success);
  }));
  promises.push(new Promise<void>((success) => {
    getCategoryNFTs(BETA_CODE).then(result => {
      betaNfts = result.nodes
      success();
    }).catch(success);
  }));
  await Promise.all(promises);
  users = arrayShuffle(users);
  betaNfts = arrayShuffle(betaNfts || []).slice(0, 8);
  let popularNfts = arrayShuffle((regularNfts || []).slice(0, 8));
  let bestSellingNfts = arrayShuffle((regularNfts || []).slice(9, 17));
  let NFTCreators = arrayShuffle((regularNfts || []).slice(18, 21));
  let totalCountNFT = (regularNfts || []).length + (betaNfts || []).length;
  return {
    props: {
      user,
      users,
      popularNfts,
      bestSellingNfts,
      NFTCreators,
      betaNfts,
      totalCountNFT,
    },
  }
}

export default LandingPage;
