import React from 'react';
import styled from 'styled-components';

import NftCard from 'components/base/NftCard';
import { NftType } from 'interfaces/index';

const INPUT_HEIGHT_REM = 0.6;

const OFFSET_SM = 0.3;
const OFFSET_LG = 0.55;

interface Props {
  list: NftType[];
  selectedIdx: number;
  setSelectedItem: (v: NftType) => void;
}

const Showcase3D = ({ list, selectedIdx, setSelectedItem }: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const idx = Number(target.name.replace(/[^0-9\.]+/g, ''));
    setSelectedItem(list[idx]);
  };

  return (
    <SWrapper>
      <SInput
        type="radio"
        name="input-0"
        id="input-0"
        checked={selectedIdx === 0}
        onChange={handleChange}
        readOnly
      />
      <SInput
        type="radio"
        name="input-1"
        id="input-1"
        checked={selectedIdx === 1}
        onChange={handleChange}
        readOnly
      />
      <SInput
        type="radio"
        name="input-2"
        id="input-2"
        checked={selectedIdx === 2}
        onChange={handleChange}
        readOnly
      />
      {list.map((item, idx) => (
        <SLabel
          key={idx}
          className="cards"
          htmlFor={`input-${idx}`}
          id={`nft-${idx}`}
        >
          <NftCard mode="carousel" item={item} isDragging />
        </SLabel>
      ))}
    </SWrapper>
  );
};

const SWrapper = styled.div`
  width: 38rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
  position: relative;

  > #input-0:checked ~ #nft-2,
  #input-1:checked ~ #nft-0,
  #input-2:checked ~ #nft-1 {
    transform: translatex(-${OFFSET_SM * 100}%) scale(0.9);
    opacity: 0.4;
    z-index: 0;
  }

  > #input-0:checked ~ #nft-1,
  #input-1:checked ~ #nft-2,
  #input-2:checked ~ #nft-0 {
    transform: translatex(${OFFSET_SM * 100}%) scale(0.9);
    opacity: 0.4;
    z-index: 0;
  }

  > #input-0:checked ~ #nft-0,
  #input-1:checked ~ #nft-1,
  #input-2:checked ~ #nft-2 {
    transform: translatex(0) scale(1);
    opacity: 1;
    z-index: 1;
  }

  height: ${({ theme }) =>
    `calc(${theme.sizes.cardHeight.sm} + ${`${INPUT_HEIGHT_REM}rem`} + 4rem)`};
  width: ${({ theme }) =>
    `calc(${theme.sizes.cardWidth.sm} + ${theme.sizes.cardWidth.sm} * ${
      OFFSET_SM * 2
    })`};

  ${({ theme }) => theme.mediaQueries.md} {
    > #input-0:checked ~ #nft-2,
    #input-1:checked ~ #nft-0,
    #input-2:checked ~ #nft-1 {
      transform: translatex(-${OFFSET_LG * 100}%) scale(0.9);
    }

    > #input-0:checked ~ #nft-1,
    #input-1:checked ~ #nft-2,
    #input-2:checked ~ #nft-0 {
      transform: translatex(${OFFSET_LG * 100}%) scale(0.9);
    }

    width: ${({ theme }) =>
      `calc(${theme.sizes.cardWidth.sm} + ${theme.sizes.cardWidth.sm} * ${
        OFFSET_LG * 2
      })`};
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    > #input-0:checked ~ #nft-2,
    #input-1:checked ~ #nft-0,
    #input-2:checked ~ #nft-1 {
      transform: translatex(-${OFFSET_SM * 100}%) scale(0.9);
    }

    > #input-0:checked ~ #nft-1,
    #input-1:checked ~ #nft-2,
    #input-2:checked ~ #nft-0 {
      transform: translatex(${OFFSET_SM * 100}%) scale(0.9);
    }
    width: ${({ theme }) =>
      `calc(${theme.sizes.cardWidth.sm} + ${theme.sizes.cardWidth.sm} * ${
        OFFSET_SM * 2
      })`};
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > #input-0:checked ~ #nft-2,
    #input-1:checked ~ #nft-0,
    #input-2:checked ~ #nft-1 {
      transform: translatex(-${OFFSET_LG * 100}%) scale(0.9);
    }

    > #input-0:checked ~ #nft-1,
    #input-1:checked ~ #nft-2,
    #input-2:checked ~ #nft-0 {
      transform: translatex(${OFFSET_LG * 100}%) scale(0.9);
    }
    width: ${({ theme }) =>
      `calc(${theme.sizes.cardWidth.sm} + ${theme.sizes.cardWidth.sm} * ${
        OFFSET_LG * 2
      })`};
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    height: ${({ theme }) =>
      `calc(${
        theme.sizes.cardHeight.md
      } + ${`${INPUT_HEIGHT_REM}rem`} + 4rem)`};
    width: ${({ theme }) =>
      `calc(${theme.sizes.cardWidth.md} + ${theme.sizes.cardWidth.sm} * ${
        OFFSET_LG * 2
      })`};
  }
`;

const SInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 6.4rem;
  height: ${`${INPUT_HEIGHT_REM}rem`};
  border: ${({ theme }) =>
    `${`${INPUT_HEIGHT_REM / 2}rem`} solid ${theme.colors.neutral500}`};
  border-radius: ${`${INPUT_HEIGHT_REM / 2}rem`};
  cursor: pointer;
  margin: 0;

  &:checked {
    border: ${({ theme }) =>
      `${`${INPUT_HEIGHT_REM / 2}rem`} solid ${theme.colors.primary}`};
  }
`;

const SLabel = styled.label`
  width: fit-content;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto 4rem;
  transition: transform 0.4s ease;
  cursor: pointer;
`;

export default Showcase3D;
