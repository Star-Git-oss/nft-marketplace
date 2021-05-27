import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import style from './Landing.module.scss';
import Hero from './Hero';
import ArtCreators from './ArtCreators';
import Footer from 'components/base/Footer';
import FloatingHeader from 'components/base/FloatingHeader';
import { UserType, NftType } from 'interfaces/index';
import dynamic from 'next/dynamic';
import { getUser } from 'actions/user';
const Showcase = dynamic(() => import('./Showcase'), {
  ssr: false,
});

export interface LandingProps {
  user: UserType;
  users: UserType[];
  setModalExpand: (b: boolean) => void;
  setNotAvailable: (b: boolean) => void;
  NFTSET1: NftType[];
  NFTSET2: NftType[];
  NFTCreators: NftType[];
  series: { [serieId: string]: number };
}

const Landing: React.FC<LandingProps> = ({
  setModalExpand,
  setNotAvailable,
  user,
  users,
  NFTSET1,
  NFTSET2,
  NFTCreators,
  series,
}) => {
  const [walletUser, setWalletUser] = useState(user);
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
    <div className={style.Container}>
      <Hero users={users} />
      <Showcase category="Most popular" NFTs={NFTSET1} series={series} />
      <Showcase category="Best sellers" NFTs={NFTSET2} series={series} />
      <ArtCreators NFTs={NFTCreators} creators={users} series={series} />
      <Link href="/explore">
        <a className={style.Button}>See more</a>
      </Link>
      <Footer setNotAvailable={setNotAvailable} />
      <FloatingHeader user={walletUser} setModalExpand={setModalExpand} />
    </div>
  );
};

export default Landing;
