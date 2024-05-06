import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import CentralABI from "./contract/Central.json";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import VerifyProductBySuppliers from "./components/VerifyProductBySuppliers";
import AddProduct from "./components/AddProduct";
import GetAllThings from "./components/GetAllThings";
import CreateProductContract from "./components/CreateProductContract";
import VotingMembersList from "./components/VotingMembersList";
import VotingForm from "./components/VotingFrom";
import AllSelfOrganizationProducts from "./components/AllSelfOrganizationProducts";
import AddProductsToMainChain from "./components/AddProductsToMainChain";
import GetAllMarketProducts from "./components/GetAllMarketProducts";
import VerifyProducts from "./components/VerifyProduct";

function App() {
  const [provider, setProvider] = useState(null);
  const [central, setCentral] = useState(null);
  const [account, setAccount] = useState(null);

  const loadBlockchainData = useCallback(async () => {
    const contractAddress = "0x6395335516636f6E391b314BD4dA18a9075E3BD7";
    const contractABI = CentralABI.abi;

    try {
      const { ethereum } = window;
      if (ethereum) {
        await ethereum.request({
          method: "eth_requestAccounts",
        });
      }
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      setProvider(provider);
      //const network = await provider.getNetwork();

      const central = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setCentral(central);

    } catch (error) {
      console.log(error);
      showErrorMessage(error);
    }
  }, []);

  useEffect(() => {
    loadBlockchainData();
  }, [loadBlockchainData]); // Run the effect whenever the loadBlockchainData function changes

  function showErrorMessage(error) {
    alert(
      `An error occurred while connecting to MetaMask: ${error.message} '\n' 'Check if you have metamask wallet installed'`
    );
  }




  return (
    <Router>
      <Navigation
        account={account}
        provider={provider}
        central={central}
        setAccount={setAccount}
      />

      <Routes>
        <Route path="/" element={<Home />} />
            <Route
              path="/AddProductsToMainChain"
              element={
                <AddProductsToMainChain
                  account={account}
                  provider={provider}
                  central={central}
                />
              }
            />
            <Route
              path="/VerifyProductBySuppliers"
              element={
                <VerifyProductBySuppliers
                  account={account}
                  provider={provider}
                  central={central}
                />
              }
            />
            <Route
              path="/CreateProductContract"
              element={
                <CreateProductContract
                  account={account}
                  provider={provider}
                  central={central}
                />
              }
            />

            <Route
              path="/AllSelfOrganizationProducts"
              element={
                <AllSelfOrganizationProducts
                  account={account}
                  provider={provider}
                  central={central}
                />
              }
            />
            <Route
              path="/addproduct"
              element={
                <AddProduct
                  account={account}
                  provider={provider}
                  central={central}
                />
              }
            />
            <Route
              path="/VotingForm"
              element={
                <VotingForm
                  account={account}
                  provider={provider}
                  central={central}
                />
              }
            />
       
        <Route
          path="/VerifyProducts"
          element={
            <VerifyProducts
              account={account}
              provider={provider}
              central={central}
            />
          }
        />
        <Route
          path="/GetAllMarketProducts"
          element={
            <GetAllMarketProducts
              account={account}
              provider={provider}
              central={central}
            />
          }
        />
        <Route
          path="/GetAllThings"
          element={
            <GetAllThings
              account={account}
              provider={provider}
              central={central}
            />
          }
        />
        
        <Route
          path="/VotingMembersList"
          element={
            <VotingMembersList
              account={account}
              provider={provider}
              central={central}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
