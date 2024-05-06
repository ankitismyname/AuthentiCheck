import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import * as sha256 from 'crypto-js/sha256';

const AddProduct = ({ account, central }) => {
  const [companyContractAddress, setCompanyContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const [value, setUrl] = useState(""); // State to hold QR code value

  const showErrorMessage = (error) => {
    setLoading(false);
    alert(`An error occurred while connecting to MetaMask: ${error.message}`);
  };

  const handleInput1Change = (e) => {
    setCompanyContractAddress(e.target.value);
  };

  const addProducts = async () => {
    try {
      if (account && companyContractAddress) {
        const timestamp = Date.now(); // Get current timestamp
        const hashInput = `${account}-${companyContractAddress}-${timestamp}`;
        const hashcode = sha256(hashInput).toString();
        setUrl(hashcode); // Update the QR code value
        setUpdateStatus("Validate the transaction through your wallet");
        setLoading(true);
        let transaction = await central.addProductByManufacturer(hashcode,companyContractAddress);
        await transaction.wait();
        setUpdateStatus("Products Added");
      } else {
        throw Error("Please connect to a wallet and provide all the required fields");
      }
    } catch (error) {
      console.error(error);
      showErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle QR code generation
  const qrRef = useRef();

  const downloadQRCode = (e) => {
    e.preventDefault();
    let canvas = qrRef.current.querySelector("canvas");
    let image = canvas.toDataURL("image/png");
    let anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `qr-code.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={value}
      size={300}
      bgColor={"#ffffff"}
      level={"H"}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 via-purple-200 to-white flex flex-col items-center justify-center p-8 border-black border-2">
      <h3 className="text-lg font-bold mb-4">Add Products</h3>
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
        {/* Input fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Enter Company contract address</label>
          <input
            type="text"
            className="mt-1 block w-full border border-black rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={companyContractAddress}
            onChange={handleInput1Change}
          />
        </div>
        {/* Add Product button */}
        <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-600" onClick={addProducts}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
        
        {/* Loading or update status message */}
        {loading ? (
          <p className="mt-2">Transaction in progress... It can take a few minutes</p>
        ) : (
          <p className="mt-2">{updateStatus}</p>
        )}
      </div>

      {/* QR code container */}
      <div className="mt-8">
        <div ref={qrRef} className="mb-4">{qrcode}</div>
        <div className="flex items-center justify-between">
          {/* Download button */}
          <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-600" onClick={downloadQRCode} disabled={!value}>
            Download QR code
          </button>
          {/* QR code value */}
          <div className="bg-gray-200 rounded-lg p-2">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
