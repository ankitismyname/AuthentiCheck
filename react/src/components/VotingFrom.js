import React, { useState } from "react";

const VotingForm = ({ account, central }) => {
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [vote, setVote] = useState(true); // true for yes, false for no
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullError, setShowFullError] = useState(false);

  const handleNewMemberAddressChange = (e) => {
    setNewMemberAddress(e.target.value);
  };

  const handleVoteChange = (e) => {
    setVote(e.target.value === "yes");
  };

  const submitVote = async () => {
    setIsSubmitting(true);
    try {
      await central.voteToAddWallet(newMemberAddress, vote);
      setSuccessMessage("Vote submitted successfully");
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsSubmitting(false);
  };

  const toggleFullError = () => {
    setShowFullError(!showFullError);
  };

  return (
    <div className="bg-gradient-to-br from-red-500 to-yellow-500 p-8 flex flex-col justify-center items-center h-screen">
      <h2 className="text-white mb-4">Voting Form</h2>
      <div className="mb-4">
        <label htmlFor="newMemberAddress" className="text-white">Enter nominated organization's address:</label>
        <input
          type="text"
          id="newMemberAddress"
          value={newMemberAddress}
          onChange={handleNewMemberAddressChange}
          className="w-full mt-1 p-2 rounded-lg focus:outline-none focus:ring focus:ring-yellow-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="vote" className="text-white">Vote:</label>
        <select id="vote" value={vote ? "yes" : "no"} onChange={handleVoteChange} className="mt-1 p-2 rounded-lg focus:outline-none focus:ring focus:ring-yellow-300">
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <button onClick={submitVote} disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-yellow-300">
        {isSubmitting ? "Submitting..." : "Submit Vote"}
      </button>
      {errorMessage && (
        <div className="text-center">
          <p className="text-gray-600 mt-4">
            {showFullError ? errorMessage : `${errorMessage.slice(0, 100)}...`}
          </p>
          <button
            onClick={toggleFullError}
            className="text-white mt-2 underline focus:outline-none"
          >
            {showFullError ? "Show less" : "Show more"}
          </button>
        </div>
      )}
      {successMessage && <p className="text-white mt-4">{successMessage}</p>}
      {isSubmitting && <p className="text-white mt-4">Transaction in progress...</p>} {/* Display while submitting */}
    </div>
  );
};

export default VotingForm;
