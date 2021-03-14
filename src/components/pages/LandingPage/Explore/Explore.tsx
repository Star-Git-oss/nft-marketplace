import React from 'react';
import style from './Explore.module.scss';

import NFTCard from '../../../common/NftCard/NftCard';

const Explore: React.FC<any> = ({ NFTs }) => {
  function returnNFTs() {
    return NFTs.map((item: any) => (
      <div key={item.id} className={style.NFTShell}>
        <NFTCard item={item} />
      </div>
    ));
  }

  return (
    <>
      <div className={style.Wrapper}>
        <div className={style.Top}>
          <h3 className={style.Title}>Explore</h3>
          <div className={style.Filters}>
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
        <div className={style.NFTWrapper}>{returnNFTs()}</div>
        <div className={style.Button}>Load more...</div>
      </div>
    </>
  );
};

export default Explore;
