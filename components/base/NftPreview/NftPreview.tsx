import React, { useEffect, useState } from 'react';
import NftUpload from 'components/base/NftUpload';
import {
  NftEffectType,
  NFT_EFFECT_BLUR,
  NFT_EFFECT_DEFAULT,
  NFT_EFFECT_PROTECT,
  NFT_EFFECT_SECRET,
} from 'interfaces';

import NftPreviewCard from './NftPreviewCard';

import style from './NftPreview.module.scss';

interface Props {
  className?: string;
  NFT: File | null;
  select: NftEffectType;
  setError: (s: string) => void;
  setModalCreate: (b: boolean) => void;
  setNFT: (f: File | null) => void;
  secretNFT: File | null;
  setSecretNFT: (f: File | null) => void;
  setSelect: (s: NftEffectType) => void;
}

const NFT_EFFECTS_ORDERED: NftEffectType[] = [
  NFT_EFFECT_DEFAULT,
  NFT_EFFECT_PROTECT,
  NFT_EFFECT_SECRET,
  NFT_EFFECT_BLUR,
];

const NftPreview = ({
  className,
  NFT,
  select,
  setError,
  setModalCreate,
  setNFT,
  secretNFT,
  setSecretNFT,
  setSelect,
}: Props) => {
  const [isRN, setIsRN] = useState(false);

  useEffect(() => {
    setIsRN(window.isRNApp);
  }, []);

  if (secretNFT === null) {
    return (
      <NftUpload
        className={className}
        description="Click here to upload your file."
        isRN={isRN}
        note={`JPEG, JPG, PNG, GIF{${!isRN ? ', MP4 or MOV' : ''}}. Max 30mb.`}
        setError={setError}
        setModalCreate={setModalCreate}
        setSecretNFT={setSecretNFT}
        setSelect={setSelect}
      />
    );
  }

  return (
    <fieldset className={`${className ?? ''} ${style.NftPreviewWrapper}`}>
      {NFT_EFFECTS_ORDERED.map((type, id) => (
        <NftPreviewCard
          key={id}
          isSelected={select === type}
          NFT={NFT}
          secretNFT={secretNFT}
          setError={setError}
          setModalCreate={setModalCreate}
          setNFT={setNFT}
          setSelect={setSelect}
          type={type}
        />
      ))}
    </fieldset>
  );
};

export default NftPreview;
