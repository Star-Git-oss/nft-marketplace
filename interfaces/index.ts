export type UserType = {
  _id: string;
  name: string;
  banner?: string;
  bio?: string;
  verified: boolean;
  nbFollowers: number;
  nbFollowing: number;
  views: number;
  walletId: string;
  picture?: string;
  twitterName?: string;
  customUrl?: string;
  personalUrl?: string;
  capsAmount?: string;
  tiimeAmount?: string;
  reviewRequested?:boolean
  likedNFTs?: String[];
};

export type NftType = {
  id: string;
  owner: string;
  creator: string;
  listed: number;
  timeStampList?: string;
  uri?: string;
  price: string;
  priceTiime: string;
  name?: string;
  description?: string;
  media: { url: string };
  cryptedMedia?: { url: string };
  ownerData: UserType;
  creatorData: UserType;
  serieId: string;
  itemTotal: string;
  totalListedNft?: number;
  totalNft?: number;
  itemId: string;
  categories: CategoryType[];
};

export type CategoryType = {
  _id: string;
  code: string;
  name: string;
  description?: string;
}

export type FollowType = {
  _id: string;
  followed: UserType;
  follower: UserType;
}