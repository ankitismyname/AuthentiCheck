import React, { useState, useRef } from "react";
import QrScanner from "qr-scanner";

const VerifyProductBySuppliers = ({ central }) => {
  const [inputType, setInputType] = useState("hash"); 
  const [inputValue, setInputValue] = useState(""); 
  const [productStatus, setProductStatus] = useState(null);
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [qrCodeSize, setQrCodeSize] = useState(200); // Initial size of the QR code
  const [productInfo, setProductInfo] = useState(null); // State to hold product information
  const fileRef = useRef();

  const showErrorMessage = (error) => {
    alert(`An error occurred: ${error.message}`);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setProductStatus(null);
  };

  const handleInputTypeChange = (type) => {
    setInputType(type);
    setProductStatus(null);
  };

  const checkProduct = async () => {
    try {
      const result = await central.verifyProductByCustomer(inputValue);
      if (result) {
        setProductStatus("valid");
        setProductInfo(result);
      } else {
        setProductStatus("fake");
        setProductInfo(null);
      }
    } catch (error) {
      console.error(error);
      showErrorMessage(error);
    }
  };

  const handleClick = () => {
    fileRef.current.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    setFile(file);
  
    try {
      const result = await QrScanner.scanImage(file);
      setData(result);
      setInputValue(result);
      setProductStatus(null);
    } catch (error) {
      console.error(error);
      showErrorMessage(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-opacity-50 p-8 rounded-lg shadow-md">
        <h3 className="text-2xl mb-4">Verify Product</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Select Input Type:</label>
            <div>
              <label className="mr-4">
                <input
                  type="radio"
                  name="inputType"
                  value="hash"
                  checked={inputType === "hash"}
                  onChange={() => handleInputTypeChange("hash")}
                />
                <span className="ml-2">Hash Code</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="inputType"
                  value="qr"
                  checked={inputType === "qr"}
                  onChange={() => handleInputTypeChange("qr")}
                />
                <span className="ml-2">QR Code</span>
              </label>
            </div>
          </div>
          <div>
            {inputType === "hash" ? (
              <div>
                <label className="block mb-2">Enter Hash Code:</label>
                <input
                  type="text"
                  className="w-full border rounded px-4 py-2"
                  value={inputValue}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div>
                <div className="card border-0">
                  <div className="card-body">
                    <button
                      type="button"
                      onClick={handleClick}
                      className="btn btn-success"
                    >
                      Scan QRCode
                    </button>
                    <input
                      type="file"
                      ref={fileRef}
                      onChange={handleChange}
                      accept=".png, .jpg, .jpeg"
                      className="d-none"
                    />
                    <div className="mt-4">
                      {file && (
                        <div>
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt="QR Code" 
                            style={{ width: qrCodeSize, height: qrCodeSize }}
                          />
                          <p className="small mt-2">Scanned Image:</p>
                        </div>
                      )}
                      {data && <p className="small">Data: {data}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={checkProduct}>
            Verify
          </button>
          {productStatus && (
            <div>
              <p className="text-xl mt-4">
                Result: {productStatus === "valid" ? "Valid Product" : "Fake Product"}
              </p>
              {productStatus === "valid" && productInfo && (
                <div className="mt-4">
                  <h4>Product Information:</h4>
                  <p>Hash Code: {productInfo.hashCode}</p>
                  <p>Manufacturer: {productInfo.manufacturer}</p>
                  <p>Seller: {productInfo.seller}</p>
                  <p>Seller Address: {productInfo.sellerAddress}</p>
                  <p>Manufactured Time: {new Date(
                        Number(productInfo.manufacturedTime) * 1000
                      ).toLocaleString()}</p>
                  <p>Registered Time: {new Date(
                        Number(productInfo.registeredTime) * 1000
                      ).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyProductBySuppliers;
