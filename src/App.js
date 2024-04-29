import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CentralABI from "./contract/Central.json";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navigation from "./components/Navigation";
import Home from "./components/Home";
import VerifyProduct from "./components/VerifyProduct";
import AddProduct from "./components/AddProduct";
import GetContract from "./components/GetContract";
import DeployContract from "./components/DeployContract";

import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [central, setCentral] = useState(null);

  const [account, setAccount] = useState(null);
  function showErrorMessage(error) {
    alert(
      `An error occurred while connecting to MetaMask: ${error.message}  '\n'  'Check if you have metamask wallet installed'`
    );
  }

  const loadBlockchainData = async () => {
    const contractAddress = "0xa66c71e84d75bb1c37187b4ae4c1aee874dc16a8";
    const contractABI = CentralABI.abi;

    try {
      const { ethereum } = window;
      if (ethereum) {
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = await provider.getSigner();
      setProvider(provider);
      //const network = await provider.getNetwork();

      const central = new ethers.Contract(contractAddress, contractABI, signer);
      setCentral(central);
    } catch (error) {
      console.log(error);
      showErrorMessage(error);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  });
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
          path="/createcontract"
          element={
            <DeployContract
              account={account}
              provider={provider}
              central={central}
            />
          }
        />
        <Route
          path="/getcontract"
          element={
            <GetContract
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
          path="/verify"
          element={
            <VerifyProduct
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
