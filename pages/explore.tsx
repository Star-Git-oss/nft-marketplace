import React from 'react';
import Head from 'next/head';
import { NextPageContext } from 'next';
import dayjs from 'dayjs';

import BetaBanner from 'components/base/BetaBanner';
import MainHeader from 'components/base/MainHeader';
import Explore from 'components/pages/Explore';
import Footer from 'components/base/Footer';
import FloatingHeader from 'components/base/FloatingHeader';
import { getNFTs, getTotalOnSaleOnMarketplace } from 'actions/nft';
import { NftType } from 'interfaces';
import { useMarketplaceData } from 'redux/hooks';

export interface ExplorePage {
  data: NftType[];
  dataHasNextPage: boolean;
  totalCount: number;
}

const ExplorePage = ({ data, dataHasNextPage, totalCount }: ExplorePage) => {
  const { name } = useMarketplaceData();

  return (
    <>
      <Head>
        <title>{name} - Explore</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="SecretNFT Marketplace, by Ternoa." />
        <meta name="og:image" content="ternoa-social-banner.jpg" />
        <meta property="og:image" content="ternoa-social-banner.jpg" />
      </Head>
      <BetaBanner />
      <MainHeader />
      <Explore NFTs={data} hasNextPage={dataHasNextPage} totalCount={totalCount} />
      <Footer />
      <FloatingHeader />
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { codes, minPrice, maxPrice, startDate, endDate } = context.query;

  let data: NftType[] = [],
    dataHasNextPage: boolean = false,
    totalCount: number = 0;

  try {
    const res = await getNFTs(
      undefined,
      undefined,
      {
        categories: typeof codes === 'string' && JSON.parse(codes).length > 0 ? JSON.parse(codes) : undefined,
        listed: true,
        priceStartRange: Number(minPrice) > 0 ? Number(minPrice) : undefined,
        priceEndRange: Number(maxPrice) > 0 ? Number(maxPrice) : undefined,
        timestampCreateStartRange: typeof startDate === 'string' && dayjs(new Date(startDate)).isValid() ? new Date(startDate) : undefined,
        timestampCreateEndRange: typeof endDate === 'string' && dayjs(new Date(endDate)).isValid() ? new Date(endDate) : undefined,
      },
      undefined,
      true
    );
    data = res.data;
    dataHasNextPage = res.hasNextPage || false;
  } catch (error) {
    console.log(error);
  }

  try {
    totalCount = await getTotalOnSaleOnMarketplace();
  } catch (error) {
    console.log(error);
  }

  return {
    props: { data, dataHasNextPage, totalCount },
  };
}

export default ExplorePage;
