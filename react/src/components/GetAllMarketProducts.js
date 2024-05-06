import React, { useState, useEffect } from "react";

const GetAllMarketProducts = ({ central, account }) => {
  const [organizationProducts, setOrganizationProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetchOrganizationProducts();
    // Check every 10 seconds
    const intervalId = setInterval(fetchOrganizationProducts, 10000);

    return () => clearInterval(intervalId); // Cleanup function to clear the interval
  }, []);

  useEffect(() => {
    // Filter products based on the search term
    const filtered = organizationProducts.filter(product =>
      product.hashCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, organizationProducts]);

  const fetchOrganizationProducts = async () => {
    try {
      const products = await central.getAllProductsInfo();
      if (products) {
        setOrganizationProducts(products);
        setErrorMessage("");
      } else {
        setErrorMessage("No products found for the organization");
      }
    } catch (error) {
      console.error("Error fetching organization products:", error);
      setErrorMessage("Error fetching organization products");
    }
  };

  const copyAddress = (index) => {
    navigator.clipboard.writeText(filteredProducts[index].contractAddress);
    setCopiedIndex(index);
  };

  return (
    <div className="GetAllMarketProducts bg-gradient-to-r from-black to-gray-300 via-black min-h-screen p-8">
      <h3 className="Component__title text-3xl text-white font-bold mb-8">Organization Products</h3>
      <div className="Component__form bg-white p-8 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Search by Hash Code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-lg"
        />
        {filteredProducts.length > 0 ? (
          <div className="form__content mb-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Hash Code</th>
                  <th className="text-left">Manufacturer</th>
                  <th className="text-left">Seller</th>
                  <th className="text-left">Seller Address</th>
                  <th className="text-left">Manufactured Time</th>
                  <th className="text-left">Registered Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.hashCode}>
                    <td className="text-left">{product.hashCode}</td>
                    <td className="text-left">{product.manufacturer}</td>
                    <td className="text-left">{product.seller}</td>
                    <td className="text-left">{product.sellerAddress}</td>
                    <td className="text-left">{new Date(
                        Number(product.manufacturedTime) * 1000
                      ).toLocaleString()}</td>
                    <td className="text-left">{new Date(
                        Number(product.registeredTime) * 1000
                      ).toLocaleString()}</td>
                   
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

export default GetAllMarketProducts;
