import React, { useState, useEffect } from "react";

const VotingMembersList = ({ central, account }) => {
  const [votingMembers, setVotingMembers] = useState([]);
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [isManufacturer, setIsManufacturer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copiedAddress, setCopiedAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullError, setShowFullError] = useState(false);
  const [walletExists, setWalletExists] = useState(false);

  const handleNewMemberAddressChange = (e) => {
    setNewMemberAddress(e.target.value);
  };

  const handleNewMemberUsernameChange = (e) => {
    setNewMemberUsername(e.target.value);
  };

  const handleIsManufacturerChange = (e) => {
    setIsManufacturer(e.target.checked);
  };

  const nominateNewMember = async () => {
    setIsSubmitting(true);
    try {
      await central.addMemberForVoting(newMemberAddress, newMemberUsername, isManufacturer);
      setSuccessMessage("New member nominated successfully");
      // After successful nomination, refresh the list of voting members
      fetchVotingMembers();
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsSubmitting(false);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchVotingMembers = async () => { // Define fetchVotingMembers function
    try {
      const members = await central.getOpenVotingMembers();
      if (members !== null) {
        setVotingMembers(members);
      } else {
        console.error("Received null voting members data.");
      }
    } catch (error) {
      console.error("Error fetching voting members:", error);
    }
  };

  useEffect(() => {
    const checkWalletExists = async () => {
      try {
        const exists = await central.IsManufracturer(account);
        setWalletExists(exists);
      } catch (error) {
        console.error("Error checking wallet existence:", error);
        setWalletExists(false);
      }
    };

    // Fetch voting members initially
    fetchVotingMembers();
    // Check wallet existence
    checkWalletExists();

    // Set interval to fetch voting members every 5 minutes (adjust as needed)
    const interval = setInterval(fetchVotingMembers, 5 * 60 * 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [central, account]);

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
  };

  const toggleFullError = () => {
    setShowFullError(!showFullError);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 via-green-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg overflow-x-auto"> {/* Add overflow-x-auto class */}
        <h2 className="text-center text-xl mb-4">Nominating Organizations</h2>
        {/* Search input */}
        <div className="flex justify-center items-center mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder="Search..."
            className="bg-gray-100 rounded p-2 mr-2"
          />
        </div>
        {/* Table */}
        <table className="w-full text-center">
        <thead>
  <tr>
    <th>Organization Name</th>
    <th>Organization Address</th>
    <th>Positive Votes</th>
    <th>Negative Votes</th>
    <th>Is Manufacturer</th>
    <th>Added By</th> {/* New column */}
  </tr>
</thead>
<tbody>
  {votingMembers
    .filter((member) =>
      member.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((member, index) => (
      <tr key={index}>
        <td>{member.username}</td>
        <td>{member.walletAddress}</td>
        <td>{member.yesVotes.toString()}</td>
        <td>{member.noVotes.toString()}</td>
        <td>{member.isManufacturer ? "Yes" : "No"}</td>
        <td>{member.nominatedBy}</td> {/* Render nominatedBy */}
        <td>
          <button
            onClick={() => handleCopyAddress(member.walletAddress)}
            disabled={copiedAddress === member.walletAddress}
            className={`bg-indigo-500 text-white py-1 px-2 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-600 ${copiedAddress === member.walletAddress ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {copiedAddress === member.walletAddress ? "Copied" : "Copy"}
          </button>
        </td>
      </tr>
    ))}
</tbody>
        </table>
        
        {/* Nominate new member section */}
        <div className="mt-4">
          {walletExists && (
            <div className="flex justify-center items-center space-x-4">
              <input
                type="text"
                value={newMemberAddress}
                onChange={handleNewMemberAddressChange}
                placeholder="Enter new organization's address"
                className="bg-gray-100 rounded p-2"
              />
              <input
                type="text"
                value={newMemberUsername}
                onChange={handleNewMemberUsernameChange}
                placeholder="Enter new organization's username"
                className="bg-gray-100 rounded p-2"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isManufacturer}
                  onChange={handleIsManufacturerChange}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span className="ml-2 text-sm">Is Manufacturer</span>
              </label>
              <button
                onClick={nominateNewMember}
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isSubmitting ? "Submitting..." : "Nominate New"}
              </button>
            </div>
          )}
          {/* Error messages */}
          {errorMessage && (
            <div className="mt-2">
              <p className="text-red-500">
                {showFullError ? errorMessage : `${errorMessage.slice(0, 100)}...`}
              </p>
              <button
                onClick={toggleFullError}
                className="text-blue-500 mt-1 underline focus:outline-none"
              >
                {showFullError ? "Show less" : "Show more"}
              </button>
            </div>
          )}
          {/* Success message */}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
        
        {/* Transaction in progress message */}
        {isSubmitting && <p className="text-white mt-4">Transaction in progress...</p>}
        
      </div>
    </div>
  );
};

export default VotingMembersList;
