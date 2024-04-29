// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Company.sol";

contract Central {
    struct VotingMember {
        address walletAddress;
        string username;
        uint256 yesVotes;
        uint256 noVotes;
    }
    struct ContractInfo {
        address contractAddress;
        string productName;
    }

    struct WalletVote {
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) voted;
        bool isOpen; // Added isOpen flag
    }

    struct Wallet {
        address walletAddress;
        string username;
    }

    Wallet[] public AllExistingMembers;
    Wallet[] public VotingMembersInfoArray;
    mapping(address => ContractInfo[]) public InfoOfProductAndContractAddress;
    mapping(address => WalletVote) private walletVotes;

    uint256 public totalExistingWallets;

    constructor() {
        AllExistingMembers.push(Wallet(msg.sender, "Entangle Productions Limited"));
        totalExistingWallets = 1; // Initialize with deployer's address
    }

    modifier onlyExistingWallet(address _walletAddress) {
        require(Iswalletexits(_walletAddress), "Wallet address does not exist");
        _;
    }

    function Iswalletexits(address _walletAddress) public view returns (bool) {
        for (uint256 i = 0; i < totalExistingWallets; i++) {
            if (AllExistingMembers[i].walletAddress == _walletAddress) {
                return true;
            }
        }
        return false;
    }

    function IsThisAlreadyNominated(address _walletAddress) public view returns (bool) {
        for (uint256 i = 0; i < VotingMembersInfoArray.length; i++) {
            if (VotingMembersInfoArray[i].walletAddress == _walletAddress && walletVotes[_walletAddress].isOpen == true) {
                return true;
            }
        }
        return false;
    }
    function IsThisAvilableInVotingArray(address _walletAddress) public view returns (bool) {
        for (uint256 i = 0; i < VotingMembersInfoArray.length; i++) {
            if (VotingMembersInfoArray[i].walletAddress == _walletAddress) {
                return true;
            }
        }
        return false;
    }

    function createSmartContract(address _walletAddress, string memory _productName) public onlyExistingWallet(_walletAddress) {
        Company companyContract = new Company();
        InfoOfProductAndContractAddress[msg.sender].push(ContractInfo(address(companyContract), _productName));
    }



        function addProduct(address _contractAddress, string memory _hashcode) public onlyExistingWallet(msg.sender) {
        Company companyInstance = Company(_contractAddress);
        companyInstance.addProduct(_hashcode,block.timestamp);
    }

    function verifyProduct(string memory _productHashCode) public view returns (bool) {
    for (uint256 i = 0; i < AllExistingMembers.length; i++) {
        Wallet storage wallet = AllExistingMembers[i];
        for (uint256 j = 0; j < InfoOfProductAndContractAddress[wallet.walletAddress].length; j++) {
            ContractInfo storage contractInfo = InfoOfProductAndContractAddress[wallet.walletAddress][j];
            if (Company(contractInfo.contractAddress).verifyProduct(_productHashCode)) {
                return true; // Product found
            }
        }
    }
    return false;
    }

    function getLastContractInfo(address _walletAddress) public view onlyExistingWallet(_walletAddress) returns (address contractAddress) {
        ContractInfo[] storage contractInfoArray = InfoOfProductAndContractAddress[_walletAddress];
        ContractInfo storage lastContractInfo = contractInfoArray[contractInfoArray.length - 1];
        return (lastContractInfo.contractAddress);
    }

    function voteToAddWallet(address _newWalletAddress, bool _vote, string memory _username) public onlyExistingWallet(msg.sender) {
        require(IsThisAlreadyNominated(_newWalletAddress), "Member is not part of voting");
        require(walletVotes[_newWalletAddress].isOpen, "Voting is closed");
        require(!walletVotes[_newWalletAddress].voted[msg.sender], "You already voted to nominate");

        if (_vote) {
            walletVotes[_newWalletAddress].yesVotes += 1;
        } else {
            walletVotes[_newWalletAddress].noVotes += 1;
        }

        walletVotes[_newWalletAddress].voted[msg.sender] = true;

        // Check if 50% or more votes are in favor to add the new wallet address
        if (walletVotes[_newWalletAddress].yesVotes >= totalExistingWallets / 2 + 1) {
            AllExistingMembers.push(Wallet(_newWalletAddress, _username));
            totalExistingWallets += 1;
            walletVotes[_newWalletAddress].isOpen = false; // Close voting
        } else if (walletVotes[_newWalletAddress].noVotes >= totalExistingWallets / 2 + 1) {
            walletVotes[_newWalletAddress].isOpen = false; // Close voting
        }
    }

    function addMemberForVoting(address _newWalletAddress, string memory _newUsername) public onlyExistingWallet(msg.sender) {
        require(!IsThisAlreadyNominated(_newWalletAddress), "Member already present for voting");
        require(!Iswalletexits(_newWalletAddress), "Member already a partner");
        if(!IsThisAvilableInVotingArray(_newWalletAddress)){
        VotingMembersInfoArray.push(Wallet(_newWalletAddress, _newUsername));}
        walletVotes[_newWalletAddress].isOpen = true; // Open voting
        walletVotes[_newWalletAddress].yesVotes = 0;
        walletVotes[_newWalletAddress].noVotes = 0;
    }

    

    function getOpenVotingMembers() public view returns (VotingMember[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < VotingMembersInfoArray.length; i++) {
            if (walletVotes[VotingMembersInfoArray[i].walletAddress].isOpen) {
                count++;
            }
        }

        VotingMember[] memory openVotingMembers = new VotingMember[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < VotingMembersInfoArray.length; i++) {
            address walletAddress = VotingMembersInfoArray[i].walletAddress;
            if (walletVotes[walletAddress].isOpen) {
                VotingMember memory member;
                member.walletAddress = walletAddress;
                member.username = VotingMembersInfoArray[i].username;
                member.yesVotes = walletVotes[walletAddress].yesVotes;
                member.noVotes = walletVotes[walletAddress].noVotes;
                openVotingMembers[index] = member;
                index++;
            }
        }
        return openVotingMembers;
    }

    function getAllWallets() public view returns (Wallet[] memory) {
        return AllExistingMembers;
    }
        function getCompanySmartContractInfo(address _walletAddress) public view returns (ContractInfo[] memory) {
        require(Iswalletexits(_walletAddress), "Wallet address does not exist");

        return InfoOfProductAndContractAddress[_walletAddress];
    }
        function getSelfCompanySmartContractInfo() public view returns (ContractInfo[] memory) {
        require(Iswalletexits(msg.sender), "Wallet address does not exist");

        return InfoOfProductAndContractAddress[msg.sender];
    }
    function getAllProducts(address _contractAddress) public view returns (Company.Product[] memory) {
        return Company(_contractAddress).getAllProductInformation();
    }

}
