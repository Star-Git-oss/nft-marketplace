import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { FaSearch } from 'react-icons/fa';
import Col from '../ui-library/Col/Col';
import Row from '../ui-library/Row/Row';
import Button from '../ui-library/Button/Button';
import Input from '../ui-library/Input/Input';

import { H3 } from '../Title/Title';
import { ReactComponent as TernoaLogo } from '../assets/logo-ternoa.svg';
import { ReactComponent as Caps } from '../assets/caps.svg';

const ContainerHeader = styled.div`
  padding:21px 0;
  width:100%;
`;

const TitleHeader = styled(H3)`
  text-align:right;
  margin:0;
  padding:0;
  cursor: pointer;
  outline: none;
`;

const SearchStyled = styled.div`
  position: relative;
  display: block;
  margin: 0px auto;
  text-align: center;
  z-index: 2;
`;

const FaSearchStyled = styled(FaSearch)`
  position: absolute;
  top: 12px;
  left: 15px;
  font-weight: bold;
  font-style: normal;
`;

const InputStyled = styled(Input)`
  line-height: 30px;
  padding-left: 30px;
  z-index: 1;
`;

type MainHeaderType = {
  walletId: string;
};

const MainHeader: React.FC<MainHeaderType> = ({ walletId }) => {
  
  const [searchValue, setSearchValue] = useState('' as string);
  
  const history = useHistory();
  const { t } = useTranslation();

  const updateKeywordSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value);
  };
  
  return (
    <ContainerHeader>
      
      <Row>
        {/* Application name */}
        <Col small="50" medium="20" large="20">
          <TitleHeader role="button" tabIndex={0} onClick={() => { history.push('/');}}>
            <TernoaLogo />
            <span>&nbsp; Ternoa Stamp</span>
          </TitleHeader>
          
        </Col>
        {/* Search Button */}
        <Col small="50" medium="40" large="40">
          <SearchStyled>
            <FaSearchStyled />
            <InputStyled onChange={updateKeywordSearch} full placeholder={t('header.find')} type="search" />
          </SearchStyled>
        </Col>
        
        {/* Buttons menu */}
        <Col small="100" medium="40" large="40">
          <div>

            <Button 
              onClick={() => {history.push(`/search?q=${searchValue}`);}}
            >
              <FaSearch />
            </Button>

            <Button 
              primary 
              onClick={() => {history.push('/create');}}
            >
              {t('header.createButton')}
            </Button>
        
            { walletId ? 

              (
                <Button 
                  onClick={() => {history.push('/profile-top');}}
                >
                  <span>{walletId} &nbsp; <Caps /></span>
                </Button>
              )
              :
              (
                <Button 
                  onClick={() => {history.push('/connect-wallet');}}
                >
                  <span>{t('header.connectWallet')} </span>
                </Button>
              )}
              
            
          </div>
        
        </Col>
      </Row>
    </ContainerHeader>
  );
};

export default MainHeader;
