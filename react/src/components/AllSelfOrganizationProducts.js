import React, { useState, useEffect } from "react";

const GetContract = ({ central,account }) => {
  const [organizationProducts, setOrganizationProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetchOrganizationProducts();
    // Check every 10 seconds
    const intervalId = setInterval(fetchOrganizationProducts, 10000);

    return () => clearInterval(intervalId); // Cleanup function to clear the interval
  }, []);

  const fetchOrganizationProducts = async () => {
    try {
      const products = await central.getAllSelfProducts(account);
      setOrganizationProducts(products);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching organization products:", error);
      setErrorMessage("Error fetching organization products");
    }
  };

  const filteredProducts = organizationProducts.filter(product =>
    product.productName?.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  useEffect(() => {
    if (filteredProducts.length === 0) {
      fetchOrganizationProducts();
    }
  }, [filteredProducts]); // Run this effect whenever filteredProducts changes and is empty

  const copyAddress = (index) => {
    navigator.clipboard.writeText(organizationProducts[index].contractAddress);
    setCopiedIndex(index);
  };

  return (
    <div className="GetContract bg-gradient-to-r from-black to-gray-300 via-black min-h-screen p-8">
      <h3 className="Component__title text-3xl text-white font-bold mb-8">Search Products by Product Name</h3>
      <div className="Component__form bg-white p-8 rounded-lg shadow-lg">
        <div className="form__content mb-4">
          <label className="form__label text-sm text-black block mb-2">Enter Product Name</label>
          <input
            type="text"
            value={productSearchQuery}
            onChange={(e) => setProductSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-gray-100 rounded p-2 w-full"
          />
        </div>
        {filteredProducts.length > 0 ? (
          <div className="form__content mb-4">
            <label className="form__label text-sm text-black block mb-2">Organization Products</label>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Product Address</th>
                  <th className="text-left">Name</th>
                  <th className="text-left">Copy</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.contractAddress}>
                    <td className="text-left">{product.contractAddress}</td>
                    <td className="text-left">{product.productName}</td>
                    <td className="text-left">
                      <button
                        className={`rounded py-1 px-3 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none ${copiedIndex === index ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => copyAddress(index)}
                        disabled={copiedIndex === index}
                      >
                        {copiedIndex === index ? 'Copied' : 'Copy'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white">No products found for the organization.</p>
        )}
        {errorMessage && <p className="error-message text-red-500 mb-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default GetContract;
