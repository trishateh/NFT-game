import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import LoadingIndicator from './Components/LoadingIndicator';
import Arena from './Components/Arena';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/MyEpicGame.json';
import SelectCharacter from './Components/SelectCharacter';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_trishateh';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  
  const [characterNFT, setCharacterNFT] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    const characterNFT = await gameContract.checkIfUserHasNFT();
    if (characterNFT.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(characterNFT));
    }

    setIsLoading(false);
    };
    
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

    const renderContent = () => {
  if (isLoading) {
    return <LoadingIndicator />
  }
    
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
        <img
          src="https://64.media.tumblr.com/tumblr_luejvfoEKX1qkvrioo1_400.gifv"
          alt="Powerpuff girls Gif"
          />
          <button
            className="cta-button connect-wallet-button"
              onClick={connectWalletAction}
            >
            Connect Wallet To Get Started
          </button>
        </div>
      );
    }
    
    return characterNFT ? 
      <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} /> :
      <SelectCharacter setCharacterNFT={setCharacterNFT} />;      
  };

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
      } else {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
          </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
