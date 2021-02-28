/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import MainHeader from './components/common/MainHeader/MainHeader';
import Footer from './components/common/Footer/Footer';
import TopPage from './components/pages/TopPage/TopPage';
import ConnectWalletPage from './components/pages/ConnectWalletPage/ConnectWalletPage';
import Profile from './components/pages/Profile/Profile';
import NftDetailsPage from './components/pages/NftDetailsPage/NftDetailsPage';
import CreateCollectiblePage from './components/pages/CreateCollectiblePage/CreateCollectiblePage';
import CreateSingleOrMultiplePage from './components/pages/CreateSingleOrMultiplePage/CreateSingleOrMultiplePage';
import SearchPage from './components/pages/SearchPage/SearchPage';
import ProfileTopPage from './components/pages/ProfileTopPage/ProfileTopPage';

import Container from './components/common/ui-library/Container/Container';
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';

const AppContainer = styled(Container)`
  margin-top: 20px;
`;

const App: React.FC = () => {

  // Show loading spinner or not
  const [isLoading, setIsLoading] = useState(false);

  // Wallet Id information
  const [walletId, setWalletId] = useState('' as string);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="App">
        <BrowserRouter>
          <MainHeader walletId={walletId} />
          <AppContainer>
            <Switch>

              <Route
                path="/"
                exact
                render={() => (
                  <TopPage setIsLoading={setIsLoading} />
                )}
              />

              <Route 
                path="/details"
                exact 
                render={() => (
                  <NftDetailsPage setIsLoading={setIsLoading} />
                )}
              />

              <Route 
                exact
                path="/profile" 
                render={() => (
                  <Profile setIsLoading={setIsLoading} />
                )}
              />

              <Route 
                exact
                path="/connect-wallet" 
                render={() => (
                  <ConnectWalletPage
                    setWalletId={setWalletId} 
                  />
                )}
              />
              
              <Route
                exact
                path="/search"
                render={() => (
                  <SearchPage setIsLoading={setIsLoading} />
                )}
              />

              <Route 
                exact
                path="/profile-top" 
                render={() => (
                  <ProfileTopPage setIsLoading={setIsLoading} />
                )}
              />

              <Route
                path="/create-single-collectible"
                render={(props) => (
                  <CreateSingleOrMultiplePage {...props} multiple={false} />
                )}
              />

              <Route
                path="/create-multiple-collectible"
                render={(props) => (
                  <CreateSingleOrMultiplePage {...props} multiple={true} />
                )}
              />

              <Route 
                path="/create" 
                component={CreateCollectiblePage} 
              />
              
            </Switch>
          </AppContainer>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
