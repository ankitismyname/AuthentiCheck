import React, { useState, useEffect } from "react";

const VotingMembersList = ({ central, account }) => {
  const [votingMembers, setVotingMembers] = useState([]);
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copiedAddress, setCopiedAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if a transaction is in progress
  const [showFullError, setShowFullError] = useState(false); // State to toggle displaying full error

  const handleNewMemberAddressChange = (e) => {
    setNewMemberAddress(e.target.value);
  };

  const handleNewMemberUsernameChange = (e) => {
    setNewMemberUsername(e.target.value);
  };

  const nominateNewMember = async () => {
    setIsSubmitting(true); // Set submitting to true when starting the transaction
    try {
      await central.addMemberForVoting(newMemberAddress, newMemberUsername);
      setSuccessMessage("New member nominated successfully");
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsSubmitting(false); // Reset submitting state after transaction completes
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchVotingMembers = async () => {
      try {
        const members = await central.getOpenVotingMembers();
        if (members !== null) {
          setVotingMembers(members);
        } else {
          console.error("Received null voting members data.");
        }
      } catch (error) {
        console.error("Error fetching voting members:", error);
        setErrorMessage("Error fetching voting members. Please try again.");
      }
    };

    fetchVotingMembers();
  }, [central]);

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
  };

  const toggleFullError = () => {
    setShowFullError(!showFullError);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 via-green-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-center text-xl mb-4">Nominating Organizations</h2>
        <div className="flex justify-center items-center mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder="Search..."
            className="bg-gray-100 rounded p-2 mr-2"
          />
        </div>
        <table className="w-full text-center">
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Organization Address</th>
              <th>Positive Votes</th>
              <th>Negative Votes</th>
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
        <div className="mt-4">
          <h3 className="text-center text-lg">Nominate New Organization</h3>
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
            <button
              onClick={nominateNewMember}
              disabled={isSubmitting} // Disable button while submitting
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Submitting..." : "Nominate"}
            </button>
          </div>
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
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
        {isSubmitting && <p className="text-white mt-4">Transaction in progress...</p>} {/* Display while submitting */}
      </div>
    </div>
  );
};

export default VotingMembersList;
