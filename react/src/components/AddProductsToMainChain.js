import React, { useState, useRef } from "react";
import QrScanner from "qr-scanner";

const AddProductBySupplier = ({ central }) => {
  const [uniqueCode, setUniqueCode] = useState("");
  const [file, setFile] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [productAdded, setProductAdded] = useState(false); // State to track if product added successfully
  const fileRef = useRef();

  const showErrorMessage = (error) => {
    alert(`An error occurred: ${error.message}`);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    setFile(file);

    try {
      const result = await QrScanner.scanImage(file);
      setUniqueCode(result); // Assuming QR code contains SHA256 unique code
      setInputValue(result); // Set scanned unique code into input field
    } catch (error) {
      console.error(error);
      showErrorMessage(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uniqueCode || inputValue.trim() !== "") {
      setTransactionInProgress(true);
      try {
        await central.addProductBySupplier(uniqueCode || inputValue); // Assuming you add product by unique code
        setTransactionInProgress(false);
        setProductAdded(true); // Set product added status to true
      } catch (error) {
        console.error(error);
        showErrorMessage(error);
        setTransactionInProgress(false);
      }
    } else {
      alert("Please scan a QR code or input product data.");
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-black via-gray-500 to-white">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl mb-4">Add Product</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="qrCode" className="block mb-2">Scan QR Code:</label>
            <input
              type="file"
              id="qrCode"
              ref={fileRef}
              onChange={handleChange}
              accept=".png, .jpg, .jpeg"
              className="d-none"
            />
            <button type="button" onClick={() => fileRef.current.click()} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4">
              Scan QR Code
            </button>
          </div>
          <div className="mt-4">
            <label htmlFor="manualInput" className="block mb-2">Or Enter Unique Code:</label>
            <input
              type="text"
              id="manualInput"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full border rounded px-4 py-2"
              placeholder="Enter unique code here..."
            />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4">
            Add Product
          </button>
        </form>
        {transactionInProgress && (
          <div className="mt-4">
            <p>Transaction in progress...</p>
          </div>
        )}
        {productAdded && (
          <div className="mt-4">
            <p>Product added successfully!</p>
          </div>
        )}
        {file && (
          <div className="mt-4">
            <p className="mb-2">Scanned Image:</p>
            <img src={URL.createObjectURL(file)} alt="QR Code" style={{ width: 200, height: 200 }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductBySupplier;
