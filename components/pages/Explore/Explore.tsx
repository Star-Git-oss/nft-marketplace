import React from 'react';
import style from './Explore.module.scss';

import NFTCard from 'components/base/NftCard';
import NoNFTImage from 'components/assets/NoNFTImage';

import { NftType } from 'interfaces/index';

export interface ExploreProps {
  NFTS: NftType[];
  series: { [serieId: string]: number };
}

const Explore: React.FC<ExploreProps> = ({ NFTS, series }) => {
  function returnNFTs() {
    return NFTS.map((item) => (
      <div key={item.id} className={style.NFTShell}>
        <NFTCard mode="grid" item={item} serieCount={series[item.serieId]} />
      </div>
    ));
  }

  function returnNoNFT() {
    return (
      <div className={style.SoldOutContainer}>
        <NoNFTImage className={style.SoldOutImage}/>
        <div className={style.SoldOutTitle}>
          All NFTs are sold !
        </div>
        <div className={style.SoldOutLabel}>
          Come later to discover new NFTs.
        </div>
        <div className={style.SoldOutLabel}>
          Thanks !
        </div>
      </div>
    )
  }

  return (
    <>
      <div id="explore" className={style.Wrapper}>
        <div className={style.Top}>
          <h3 className={style.Title}>Explore</h3>
          <div className={style.Hide}>
            <span className={style.Filter}>
              <span role="img" className={style.Emoji} aria-label="art">
                🎨
              </span>
              Art
            </span>
            <span className={style.Filter}>
              <span role="img" className={style.Emoji} aria-label="photo">
                📸
              </span>
              Photo
            </span>
            <span className={style.Filter}>
              <span role="img" className={style.Emoji} aria-label="games">
                👾
              </span>
              Games
            </span>
            <span className={style.Filter}>
              <span role="img" className={style.Emoji} aria-label="games">
                🎷
              </span>
              Music
            </span>
            <span className={style.Filter}>
              <span role="img" className={style.Emoji} aria-label="design">
                🖌
              </span>
              Design
            </span>
            <span className={style.Filter}>
              <span role="img" className={style.Emoji} aria-label="photo">
                📷
              </span>
              Photo
            </span>
          </div>
        </div>
        <div className={style.NFTWrapper}>
          {NFTS.length === 0 ?
            returnNFTs()
            :
            returnNoNFT()
          }
        </div>
        <div className={style.Hide}>Load more...</div>
      </div>
    </>
  );
};

export default Explore;
