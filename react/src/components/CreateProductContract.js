import React, { useState } from "react";

const CreateProductContract = ({ account, central }) => {
  const [contractAddress, setContractAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [isAddressCopied, setAddressCopied] = useState(false);

  function showErrorMessage(error) {
    setLoading(false);
    alert(`An error occurred while connecting to MetaMask: ${error.message}`);
  }

  const fetchContractAddress = async () => {
    try {
      if (account) {
        const products = await central.getAllSelfProducts(account); // Get all products created by the manufacturer
        if (products.length > 0) {
          const lastProduct = products[products.length - 1]; // Get the last product
          setContractAddress(lastProduct.contractAddress); // Set the contract address of the last product
        } else {
          throw Error("No products found for the manufacturer");
        }
      } else {
        throw Error("Please check that you are connected to a wallet");
      }
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setAddressCopied(true); // Set address copied state to true
  };

  const createContract = async () => {
    try {
      if (!productName) {
        throw Error("Please provide a product name");
      }
      
      if (account) {
        setUpdateStatus("Validate the transaction through your wallet");
        setLoading(true);
        let transaction = await central.createManufacturerProductContract(productName);
        await transaction.wait();
        await fetchContractAddress();
        setUpdateStatus("Contract created \n Address: ");
        setLoading(false);
      } else {
        throw Error("Please check that you are connected to a wallet");
      }
    } catch (error) {
      setLoading(false);
      showErrorMessage(error);
    }
  };

  return (
    <div className="DeployContract bg-gradient-to-br from-black to-orange-500 p-8 flex flex-col justify-center items-center h-screen">
      <h3 className="Component__title text-white">Create New Product Contract</h3>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Enter product name"
        className="my-4 px-4 py-2 rounded-full w-full focus:outline-none focus:ring focus:ring-orange-300"
      />
      <button className="button__toggle rounded-full py-2 px-4 bg-black text-white hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-300" onClick={createContract}>
        Create Contract
      </button>
      {loading ? (
        <div className="text-white mt-4">Transaction in progress... It can take a few minutes</div>
      ) : (
        <div className="flex mt-4 items-center">
          <p className="text-white">
            {updateStatus}
            {contractAddress}
          </p>
          {contractAddress && (
            <button
              className={`ml-4 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded focus:outline-none ${isAddressCopied ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={copyToClipboard}
              disabled={isAddressCopied} // Disable the button when address is copied
            >
              {isAddressCopied ? "Address Copied" : "Copy"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateProductContract;
