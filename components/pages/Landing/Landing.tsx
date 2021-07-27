import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import style from './Landing.module.scss';
import Hero from './Hero';
import ArtCreators from './ArtCreators';
import Footer from 'components/base/Footer';
import FloatingHeader from 'components/base/FloatingHeader';
import NoNFTComponent from 'components/base/NoNFTComponent';
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
  popularNfts: NftType[];
  bestSellingNfts: NftType[];
  betaNfts: NftType[];
  NFTCreators: NftType[];
  totalCountNFT: number;
}

const Landing: React.FC<LandingProps> = ({
  setModalExpand,
  setNotAvailable,
  user,
  users,
  popularNfts,
  bestSellingNfts,
  betaNfts,
  NFTCreators,
  totalCountNFT,
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
      {totalCountNFT === 0 && <NoNFTComponent/>}
      <Showcase category="Beta Testers" NFTs={betaNfts}/>
      <Showcase category="Most popular" NFTs={popularNfts}/>
      <Showcase category="Best sellers" NFTs={bestSellingNfts}/>
      <ArtCreators NFTs={NFTCreators} creators={users}/>
      <Link href="/explore">
        <a className={style.Button}>See more</a>
      </Link>
      <Footer setNotAvailable={setNotAvailable} />
      <FloatingHeader user={walletUser} setModalExpand={setModalExpand} />
    </div>
  );
};

export default Landing;
