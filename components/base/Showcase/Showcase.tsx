import React, { useState } from 'react';
import Switch from 'react-switch';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useMediaQuery } from 'react-responsive';
import { breakpointMap } from 'style/theme/base';

import style from './Showcase.module.scss';

import NFTCard from 'components/base/NftCard';
import ArrowLeft from 'components/assets/arrowLeft';
import ArrowRight from 'components/assets/arrowRight';

import { NftType, UserType } from 'interfaces/index';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: breakpointMap.xxl },
    items: 4.2,
  },
  tablet: {
    breakpoint: { max: breakpointMap.xxl, min: breakpointMap.md },
    items: 3.5,
  },
  mobile2: {
    breakpoint: { max: breakpointMap.md, min: breakpointMap.sm },
    items: 2.4,
  },
  mobile3: {
    breakpoint: { max: breakpointMap.sm, min: 0 },
    items: 1.8,
  },
};

export interface ShowcaseProps {
  NFTs: NftType[];
  category: string;
  user?: UserType;
  setUser?: (u: UserType) => void
}

const Showcase: React.FC<ShowcaseProps> = ({ NFTs, category, user, setUser }) => {
  const [isFiltered, setIsFiltered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isMobile = useMediaQuery({ query: `(max-device-width: ${breakpointMap.md}px)` });

  let carousel: Carousel | null = new Carousel({
    responsive: {},
    children: <></>,
  });
  function returnNFTs(key: string = 'show') {
    return NFTs.map((item) => (
      <div key={item.id} className={style.NFTShell}>
        <NFTCard
          mode={key}
          isDragging={isDragging}
          item={item}
          user={user}
          setUser={setUser}
        />
      </div>
    ));
  }

  return (
    <>
      {NFTs?.length > 0 &&
        <div className={style.Showcase}>
          <div className={style.Top}>
            <div className={style.Infos}>
              <h3 className={style.Title}>{category}</h3>
              <div className={`${style.Toggle} ${style.Hide}`}>
                <label>
                  <Switch
                    checked={isFiltered}
                    onChange={() => setIsFiltered(!isFiltered)}
                    offColor="#000000"
                    onColor="#7417ea"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    width={46}
                    handleDiameter={23}
                    className={style.SwitchShell}
                  />
                </label>
                <span className={style.Label}>Certified only</span>
              </div>
            </div>
            {!isMobile && (
              <div className={style.Nav}>
                <div
                  onClick={() => {
                    carousel?.previous(1);
                  }}
                  className={style.NavButton}
                >
                  <ArrowLeft className={style.ArrowSVG} />
                </div>

                <div
                  onClick={() => {
                    carousel?.next(1);
                  }}
                  className={style.NavButton}
                >
                  <ArrowRight className={style.ArrowSVG} />
                </div>
              </div>
            )}
          </div>
          <div className={style.Wrapper}>
            <div
              className={style.NFTContainer}
              onMouseDown={() => setIsDragging(false)}
              onMouseMove={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(false)}
              onTouchMove={() => setIsDragging(true)}
            >
              {isMobile ? (
                <>{returnNFTs('show')}</>
              ) : (
                  <>
                    <Carousel
                      ref={(el) => {
                        carousel = el;
                      }}
                      responsive={responsive}
                      infinite
                      ssr={false}
                      arrows={false}
                      className={style.CarouselContainer}
                      swipeable={true}
                    >
                      {returnNFTs('Carousel')}
                    </Carousel>
                  </>
                )}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Showcase;
