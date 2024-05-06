import React, { useState, useEffect } from "react";

const GetAllThings = ({ central }) => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState("");
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [walletFetchError, setWalletFetchError] = useState(false); // State variable to track wallet fetch errors

  // State variables for search queries
  const [walletSearchQuery, setWalletSearchQuery] = useState("");
  const [contractSearchQuery, setContractSearchQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null); // State variable to track which product's code is copied

  useEffect(() => {
    const fetchAndSetWallets = async () => {
      try {
        const allWallets = await central.getAllManufacturers();
        setWallets(allWallets);
        setWalletFetchError(false); // Reset error status if fetching is successful
        setErrorMessage(""); // Reset error message
      } catch (error) {
        setWalletFetchError(true); // Set error status if fetching fails
        setErrorMessage("Error fetching wallets");
      }
    };

    fetchAndSetWallets(); // Initial fetch

    const intervalId = setInterval(fetchAndSetWallets, 5000); // Retry fetching wallets every 5 seconds

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, [central]); // Include central in the dependency array

  const fetchContractsAndProducts = async (walletAddress) => {
    try {
      const contracts = await central.getAllSelfProducts(
        walletAddress
      );
      setContracts(contracts);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error fetching contracts");
    }
  };

  const fetchProducts = async (contractAddress) => {
    try {
      const products = await central.getAllProductInstances(contractAddress);
      setProducts(products);
    } catch (error) {
      setErrorMessage("Error fetching products");
    }
  };

  const handleWalletChange = (e) => {
    const selectedWalletAddress = e.target.value;
    setSelectedWallet(selectedWalletAddress);
    setSelectedContract("");
    setContracts([]);
    setProducts([]);
    fetchContractsAndProducts(selectedWalletAddress);
  };

  const handleContractChange = (e) => {
    const selectedContractAddress = e.target.value;
    setSelectedContract(selectedContractAddress);
    fetchProducts(selectedContractAddress);
  };

  const copyAddress = (address, index) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
  };

  // Filter wallets based on search query
  const filteredWallets = wallets.filter((wallet) =>
    wallet.username.toLowerCase().includes(walletSearchQuery.toLowerCase())
  );

  // Filter contracts based on search query
  const filteredContracts = contracts.filter((contract) =>
    contract.productName
      .toLowerCase()
      .includes(contractSearchQuery.toLowerCase())
  );

  return (
    <div className="GetContract bg-gradient-to-br from-yellow-400 via-sky-400 to-green-400 min-h-screen p-8">
      <h3 className="Component__title text-3xl text-black font-bold mb-8">
        Search Products by Company and Product names
      </h3>
      <div className="Component__form bg-white p-8 rounded-lg shadow-lg">
        <div className="form__content mb-4">
          <label className="form__label text-sm text-black block mb-2">
            Select Company
          </label>
          <input
            type="text"
            placeholder="Search Company"
            value={walletSearchQuery}
            onChange={(e) => setWalletSearchQuery(e.target.value)}
            className="form__input px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
          />
          <select
            className="form__input px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
            value={selectedWallet}
            onChange={handleWalletChange}
          >
            <option value="">Select Company</option>
            {filteredWallets.map((wallet) => (
              <option key={wallet.organizationContract} value={wallet.organizationContract}>
                {wallet.username}
              </option>
            ))}
          </select>
        </div>
        {walletFetchError && <p className="error-message text-red-500 mb-4">Error fetching wallets</p>}
        {selectedWallet && (
          <div className="form__content mb-4">
            <label className="form__label text-sm text-black block mb-2">
              Select Product
            </label>
            <input
              type="text"
              placeholder="Search Product"
              value={contractSearchQuery}
              onChange={(e) => setContractSearchQuery(e.target.value)}
              className="form__input px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
            <select
              className="form__input px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
              value={selectedContract}
              onChange={handleContractChange}
            >
              <option value="">Select Product</option>
              {filteredContracts.map((contract) => (
                <option
                  key={contract.contractAddress}
                  value={contract.contractAddress}
                >
                  {contract.productName}
                </option>
              ))}
            </select>
          </div>
        )}
        {errorMessage && (
          <p className="error-message text-red-500 mb-4">{errorMessage}</p>
        )}
        {products.length > 0 && (
          <div>
            <p className="text-black mb-2">Result:</p>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Product Code</th>
                  <th className="text-left">Manufacture Date and Time</th>
                  <th className="text-left">Copy</th>
                </tr>
              </thead>
              
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td className="text-left">{product.hashcode}</td>
                    <td className="text-left">
                      {new Date(
                        Number(product.timestamp) * 1000
                      ).toLocaleString()}
                    </td>
                    <td className="text-left">
                      <button
                        className={`bg-indigo-500 text-white py-1 px-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-600 ${
                          copiedIndex === index
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        onClick={() => copyAddress(product.hashcode, index)} // Corrected parameter
                        disabled={copiedIndex === index}
                      >
                        {copiedIndex === index ? "Copied" : "Copy"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
             
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllThings;
