import React, { useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { getNFTs, getMostLikedNFTs, getMostSoldNFTs, getMostSoldSeries, getMostViewedNFTs } from 'actions/nft';
import { ModalFilters, ModalSort } from 'components/base/Modal';
import NftsGrid from 'components/base/NftsGrid';
import Button from 'components/ui/Button';
import { Container, Title, Wrapper } from 'components/layout';
import { EXPLORE_TAB } from 'components/pages/Profile';
import { CustomResponse, NftType } from 'interfaces';
import { SORT_OPTION_PRICE_ASC, SORT_OPTION_PRICE_DESC, SORT_OPTION_TIMESTAMP_CREATE_ASC, SORT_OPTION_TIMESTAMP_CREATE_DESC } from 'utils/constant';

import {
  FiltersSortDefaultState,
  CATEGORIES_FILTER,
  CREATION_DATE_FILTER,
  PRICE_FILTER,
  DATE_ASC_SORT,
  DATE_DESC_SORT,
  MOST_LIKED_SORT,
  MOST_SOLD_SORT,
  MOST_SOLD_SERIES_SORT,
  MOST_VIEWED_SORT,
  PRICE_ASC_SORT,
  PRICE_DESC_SORT,
} from './constants';
import { FiltersType, SortTypesType } from './interfaces';

const filterSortPromiseMapping = (filtersSort: FiltersType & SortTypesType, currentPage: number): Promise<CustomResponse<NftType>> => {
  const categoryCodes = filtersSort[CATEGORIES_FILTER];
  const [startDateRange, endDateRange] = filtersSort[CREATION_DATE_FILTER];
  const [minPrice, maxPrice] = filtersSort[PRICE_FILTER];

  if (filtersSort[MOST_LIKED_SORT] === true) {
    return getMostLikedNFTs((currentPage + 1).toString());
  } else if (filtersSort[MOST_SOLD_SORT] === true) {
    return getMostSoldNFTs((currentPage + 1).toString());
  } else if (filtersSort[MOST_SOLD_SERIES_SORT] === true) {
    return getMostSoldSeries((currentPage + 1).toString());
  } else if (filtersSort[MOST_VIEWED_SORT] === true) {
    return getMostViewedNFTs((currentPage + 1).toString());
  } else if (filtersSort[DATE_ASC_SORT] === true) {
    return getNFTs((currentPage + 1).toString(), undefined, { listed: true }, SORT_OPTION_TIMESTAMP_CREATE_ASC);
  } else if (filtersSort[DATE_DESC_SORT] === true) {
    return getNFTs((currentPage + 1).toString(), undefined, { listed: true }, SORT_OPTION_TIMESTAMP_CREATE_DESC);
  } else if (filtersSort[PRICE_ASC_SORT] === true) {
    return getNFTs((currentPage + 1).toString(), undefined, { listed: true }, SORT_OPTION_PRICE_ASC);
  } else if (filtersSort[PRICE_DESC_SORT] === true) {
    return getNFTs((currentPage + 1).toString(), undefined, { listed: true }, SORT_OPTION_PRICE_DESC);
  } else {
    return getNFTs((currentPage + 1).toString(), undefined, {
      categories: categoryCodes !== null && categoryCodes.length > 0 ? categoryCodes : undefined,
      listed: true,
      priceStartRange: minPrice > 0 ? minPrice : undefined,
      priceEndRange: maxPrice > 0 ? maxPrice : undefined,
      timestampCreateStartRange: dayjs(new Date(startDateRange)).isValid() ? new Date(startDateRange) : undefined,
      timestampCreateEndRange: dayjs(new Date(endDateRange)).isValid() ? new Date(endDateRange) : undefined,
    });
  }
};

export interface ExploreProps {
  NFTs: NftType[];
  hasNextPage: boolean;
  totalCount?: number;
}

const Explore: React.FC<ExploreProps> = ({ NFTs, hasNextPage, totalCount }) => {
  const [filtersSort, setFiltersSort] = useState<FiltersType & SortTypesType>(FiltersSortDefaultState);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataNfts, setDataNfts] = useState(NFTs);
  const [dataNftsHasNextPage, setDataNftsHasNextPage] = useState(hasNextPage);
  const [dataTotalCount] = useState(totalCount ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [isModalFiltersExpanded, setIsModalFiltersExpanded] = useState(false);
  const [isModalSortExpanded, setIsModalSortExpanded] = useState(false);

  const toggleModalFiltersExpanded = () => {
    setIsModalFiltersExpanded((prevState) => !prevState);
  };

  const toggleModalSortExpanded = () => {
    setIsModalSortExpanded((prevState) => !prevState);
  };

  const loadMoreNfts = async () => {
    setIsLoadMoreLoading(true);
    try {
      if (dataNftsHasNextPage) {
        const promise = filterSortPromiseMapping(filtersSort, currentPage);
        const { data, hasNextPage } = (await promise) ?? { data: [], hasNextPage: false };
        setCurrentPage((prevCount) => prevCount + 1);
        setDataNftsHasNextPage(hasNextPage);
        setDataNfts((prevState) => prevState.concat(data));
        setIsLoadMoreLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoadMoreLoading(false);
    }
  };

  const handleClear = async () => {
    setFiltersSort(FiltersSortDefaultState);
    setIsLoading(true);
    setIsModalFiltersExpanded(false);
    setIsModalSortExpanded(false);
    try {
      const { data, hasNextPage } = (await getNFTs('1', undefined, { listed: true }, undefined, true)) ?? { data: [], hasNextPage: false };
      setCurrentPage(1);
      setDataNftsHasNextPage(hasNextPage ?? false);
      setDataNfts(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Wrapper>
          <STopContainer>
            <STitleContainer>
              <STitle>Explore</STitle>
              {/* TODO: add totalCount based on filters, remove filtersSort condition */}
              {dataTotalCount > 0 && !Object.values(filtersSort).some((item) => item !== null) && (
                <STotalInsight>{`${dataTotalCount} NFTs to discover`}</STotalInsight>
              )}
            </STitleContainer>
            <SFiltersButtonContainer>
              <SSortButton onClick={toggleModalSortExpanded}>Sort</SSortButton>
              <Button color="primary500" icon="filters" onClick={toggleModalFiltersExpanded} size="medium" text="Filters" variant="contained" />
            </SFiltersButtonContainer>
          </STopContainer>
          <NftsGrid
            NFTs={dataNfts}
            isLoading={isLoading}
            isLoadMoreLoading={isLoadMoreLoading}
            isLoadMore={dataNftsHasNextPage}
            loadMore={loadMoreNfts}
            noNftBody={
              <>
                Come later to discover new NFTs.
                <br />
                <br />
                Thanks !
              </>
            }
            noNftTitle="All NFTs are sold !"
            tabId={EXPLORE_TAB}
          />
        </Wrapper>
      </Container>
      {isModalSortExpanded && (
        <ModalSort
          handleClearSort={handleClear}
          setData={setDataNfts}
          setDataHasNextPage={setDataNftsHasNextPage}
          setDataCurrentPage={setCurrentPage}
          setDataIsLoading={setIsLoading}
          setIsExpanded={setIsModalSortExpanded}
          setSort={setFiltersSort}
          sort={filtersSort}
        />
      )}
      {isModalFiltersExpanded && (
        <ModalFilters
          filters={filtersSort}
          handleClearFilter={handleClear}
          setData={setDataNfts}
          setDataHasNextPage={setDataNftsHasNextPage}
          setDataCurrentPage={setCurrentPage}
          setDataIsLoading={setIsLoading}
          setIsExpanded={setIsModalFiltersExpanded}
          setFilters={setFiltersSort}
        />
      )}
    </>
  );
};

const STopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const STitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: baseline;
  }
`;

const STitle = styled(Title)`
  font-size: 3.2rem;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 4.8rem;
    margin: 0 auto;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 4.8rem;
    margin: 0;
  }
`;

const STotalInsight = styled.span`
  color: ${({ theme }) => theme.colors.neutral300};
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 1.6rem;
  margin-top: 0.8rem;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: 0;
    margin-left: 1.6rem;
  }
`;

const SFiltersButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 2.4rem;

  > * {
    &:not(:first-child) {
      margin-top: 0.8rem;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;

    > * {
      &:not(:first-child) {
        margin-left: 1.6rem;
        margin-top: 0;
      }
    }
  }
`;

const SSortButton = styled.button`
  color: ${({ theme }) => theme.colors.contrast};
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 1.6rem;
  text-decoration-line: underline;
`;

export default Explore;
