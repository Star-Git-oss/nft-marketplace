import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Footer from 'components/base/Footer';
import FloatingHeader from 'components/base/FloatingHeader';
import {
  Advice,
  Container,
  Input,
  InputLabel,
  InputShell,
  Insight,
  Textarea,
  Title,
  Wrapper,
} from 'components/layout';
import NftPreview from 'components/base/NftPreview';
import { useCreateNftContext } from 'components/pages/Create/CreateNftContext';
import { NFT_EFFECT_DEFAULT, NFT_EFFECT_SECRET, UserType } from 'interfaces';
import Button from 'components/ui/Button';
import Tooltip from 'components/ui/Tooltip';

import { NFTProps } from 'pages/create';

export interface CreateProps {
  isRN?: boolean;
  user: UserType;
  setModalExpand: (b: boolean) => void;
  setNotAvailable: (b: boolean) => void;
  setModalCreate: (b: boolean) => void;
  NFTData: NFTProps;
  setNFTData: (o: NFTProps) => void;
}

const Create: React.FC<CreateProps> = ({
  isRN,
  setModalExpand,
  setNotAvailable,
  setModalCreate,
  NFTData: initalValue,
  setNFTData: setNftDataToParent,
  user,
}) => {
  const { createNftData, setError, setOutput, setQRData, setUploadSize } =
    useCreateNftContext();
  const { effect, NFT, QRData, secretNFT } = createNftData;

  const [nftData, setNFTData] = useState(initalValue);
  const { description, name, quantity, seriesId } = nftData;

  const validateQuantity = (value: number, limit: number) => {
    return value > 0 && value <= limit;
  };

  const isDataValid =
    name &&
    description &&
    validateQuantity(quantity, 10) &&
    secretNFT &&
    (effect !== NFT_EFFECT_SECRET || NFT);

  function onChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const nextNftData = { ...nftData, [e.target.name]: e.target.value };
    setNFTData(nextNftData);
    setNftDataToParent(nextNftData);
  }

  function initMintingNFT() {
    if (!user) throw new Error('Please login to create an NFT.');
    if (!NFT && !(effect === NFT_EFFECT_DEFAULT))
      throw new Error('Elements are undefined');
    setQRData!({
      ...QRData,
      quantity,
    });
    setOutput!([quantity.toString()]);
  }

  async function uploadFiles() {
    try {
      setOutput([]);
      setError('');
      initMintingNFT();
      setModalCreate(true);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  useEffect(() => {
    if (secretNFT && quantity && Number(quantity) > 0) {
      const previewSize = NFT ? NFT.size : secretNFT.size;
      const secretsSize = secretNFT.size * Number(quantity);
      setUploadSize(previewSize + secretsSize);
    }
  }, [quantity, NFT, secretNFT]);

  useEffect(() => {
    if (user?.walletId) {
      setQRData({
        ...QRData,
        walletId: user.walletId,
      });
    }
  }, [user]);

  return (
    <Container>
      <Wrapper>
        <Title>Create your NFT</Title>
        <SNftPreviewWrapper>
          <NftPreview isRN={isRN} />
        </SNftPreviewWrapper>
        <SForm>
          <SLeft>
            <InputShell>
              <InputLabel>Name</InputLabel>
              <Input
                type="text"
                placeholder="Enter name"
                onChange={onChange}
                name="name"
                value={name}
              />
            </InputShell>

            <SInputShellDescription>
              <InputLabel>Description</InputLabel>
              <Textarea
                placeholder="Tell about the NFT in a few words..."
                name="description"
                value={description}
                onChange={onChange}
              />
            </SInputShellDescription>
          </SLeft>
          <SRight>
            {/* TODO in the future with autocomplete */}
            {/* <InputShell>
              <InputLabel>
                Categories<SInsight>(optional)</SInsight>
              </InputLabel>
              <Input
                type="text"
                disabled
                placeholder="NFT Category"
                onChange={onChange}
                name="category"
                value={category}
              />
            </InputShell> */}

            {/* TODO in the future */}
            {/* <InputShell>
              <InputLabel>
                Royalties<SInsight>(max: 10%)</SInsight>
              </InputLabel>
              <Input
                type="text"
                placeholder="Enter royalties"
                onChange={onChange}
                name="royalties"
                value={royalties}
              />
            </InputShell> */}

            <InputShell>
              <InputLabel>
                Quantity<SInsight>(max: 10)</SInsight>
              </InputLabel>
              <Input
                type="text"
                name="quantity"
                value={quantity}
                onChange={onChange}
                placeholder="1"
                isError={!validateQuantity(quantity, 10)}
              />
            </InputShell>

            <InputShell>
              <InputLabel>
                Serie ID
                <STooltip text="Specified your own serie id" />
                <SInsight>(optional)</SInsight>
              </InputLabel>
              <Input
                type="text"
                placeholder="Enter ID"
                onChange={onChange}
                name="seriesId"
                value={seriesId}
              />
            </InputShell>
          </SRight>
        </SForm>
        <SAdvice>
          Once the information is entered, it will be impossible to modify it !
        </SAdvice>
        <SButton
          disabled={!(isDataValid && user)}
          onClick={() => isDataValid && user && uploadFiles()}
          text="Create NFT"
        />
      </Wrapper>
      <Footer setNotAvailable={setNotAvailable} />
      <FloatingHeader user={user} setModalExpand={setModalExpand} />
    </Container>
  );
};

const SNftPreviewWrapper = styled.div`
  margin-top: 3.2rem;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 5.4rem;
  }
`;

const SForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 4rem;

  > * {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    align-items: normal;
    flex-direction: row;
    margin-top: 12rem;
  }
`;

const FormSideLayout = styled.div`
  > * {
    margin-top: 4rem;

    ${({ theme }) => theme.mediaQueries.md} {
      margin-top: 6.4rem;
    }

    &:first-child {
      margin-top: 0;
    }
  }
`;

const SLeft = styled(FormSideLayout)`
  ${({ theme }) => theme.mediaQueries.md} {
    border-right: 1px solid #e0e0e0;
    padding-right: 4.8rem;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 13.6rem;
  }
`;

const SRight = styled(FormSideLayout)`
  ${({ theme }) => theme.mediaQueries.md} {
    padding-left: 4.8rem;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-left: 13.6rem;
  }
`;

const SInputShellDescription = styled(InputShell)`
  flex: 1;
`;

const STooltip = styled(Tooltip)`
  margin-left: 0.4rem;
`;

const SInsight = styled(Insight)`
  margin-left: 0.8rem;
`;

const SAdvice = styled(Advice)`
  margin: 4rem auto 0;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.xl} {
    margin: 7.2rem auto 0;
  }
`;

const SButton = styled(Button)`
  margin-top: 4.8rem;
`;

export default Create;
