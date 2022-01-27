import React from 'react';
import { NextPageContext } from 'next';
import Head from 'next/head';
import cookies from 'next-cookies';

import { getUser, getProfile } from 'actions/user';
import BetaBanner from 'components/base/BetaBanner';
import FloatingHeader from 'components/base/FloatingHeader';
import Footer from 'components/base/Footer';
import MainHeader from 'components/base/MainHeader';
import Profile, { ARTIST_PROFILE_VARIANT } from 'components/pages/Profile';
import { UserType, FOLLOWERS_TAB, FOLLOWED_TAB, NFT_ON_SALE_TAB, NFT_NOT_FOR_SALE_TAB } from 'interfaces';
import { useApp } from 'redux/hooks';
import { decryptCookie } from 'utils/cookie';
import { getUserIp } from 'utils/functions';
import { middleEllipsis } from 'utils/strings';

export interface PublicProfileProps {
  user: UserType;
  profile: UserType;
}

const ORDERED_TABS_ID = [NFT_ON_SALE_TAB, NFT_NOT_FOR_SALE_TAB, FOLLOWERS_TAB, FOLLOWED_TAB] as const;

const PublicProfilePage = ({ user, profile }: PublicProfileProps) => {
  const { name: appName } = useApp();
  const { name, walletId } = profile;

  return (
    <>
      <Head>
        <title>
          {appName} -{' '}
          {name || middleEllipsis(walletId, 10)}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={`Ternoart - ${name || middleEllipsis(walletId, 10)} profile page.`} />
        <meta name="og:image" content="ternoa-social-banner.jpg" />
      </Head>
      <BetaBanner />
      <MainHeader user={user} />
      <Profile artist={profile} user={user} tabs={ORDERED_TABS_ID} variant={ARTIST_PROFILE_VARIANT} />
      <Footer />
      <FloatingHeader user={user} />
    </>
  );
};
export async function getServerSideProps(ctx: NextPageContext) {
  const token = cookies(ctx).token && decryptCookie(cookies(ctx).token as string);
  let user: UserType | null = null,
    profile: UserType | null = null;
  const promises = [];
  let ip = getUserIp(ctx.req);
  if (token) {
    promises.push(
      new Promise<void>((success) => {
        getUser(token, true)
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
      getProfile(ctx.query.name as string, token ? token : null, ip)
        .then((_profile) => {
          profile = _profile;
          success();
        })
        .catch(success);
    })
  );
  await Promise.all(promises);
  if (!profile) {
    return {
      notFound: true,
    };
  }
  return {
    props: { user, profile },
  };
}

export default PublicProfilePage;
