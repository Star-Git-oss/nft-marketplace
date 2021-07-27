import { NftType } from 'interfaces/index';
import { envStringToCondition } from '../utils/strings'

const filterNFTs = (data: NftType[], onlyListed:boolean=false) => {
  return data.filter((item) => {
    let isOk = item.creatorData && item.ownerData && item.media && item.listed && envStringToCondition(Number(item.id))
    if (onlyListed) isOk = isOk && item.listed === 1
    return isOk
  })
}

export const getNFTS = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_NODE_API}/api/mp/NFTs`);
  let data: NftType[] = await res.json();
  data = filterNFTs(data, true)
  return data;
};

export const getProfileNFTS = async (
  id: string,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NODE_API}/api/mp/NFTs/owner/${id}`
  );
  if (!res.ok) throw new Error('error fetching owned NFTs');
  let data: NftType[] = await res.json();
  data = filterNFTs(data)
  return data;
};

export const getCreatorNFTS = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NODE_API}/api/mp/NFTs/creator/${id}`
  );
  if (!res.ok) throw new Error('error fetching created NFTs');
  let data: NftType[] = await res.json();
  data = filterNFTs(data)
  return data
};

export const getCategoryNFTs = async (codes?: string | string[]) => {
  const queryString = !codes ? "" : (typeof codes==='string' ? `?codes=${codes}` : `?codes=${codes.join("&codes=")}`)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NODE_API}/api/mp/NFTs/category/${queryString}`
  );
  if (!res.ok) throw new Error('error fetching NFTs');
  let data: NftType[] = await res.json();
  data = filterNFTs(data, true)
  return data
};

export const getNFT = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_NODE_API}/api/mp/NFTs/${id}`);
  if (!res.ok) throw new Error();
  let data: NftType = await res.json();
  if (!data.creatorData || !data.ownerData || !data.media) throw new Error();
  return data;
};

