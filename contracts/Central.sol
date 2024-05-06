// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Storage.sol";

contract Central {
    struct AllInfo {
        string hashCode;
        string manufacturer;
        string seller;
        address sellerAddress;
        uint256 manufacturedTime;
        uint256 registeredTime;
    }
    struct VotingMember {
        address walletAddress;
        string nominatedBy;
        string username;
        uint256 yesVotes;
        uint256 noVotes;
        bool isManufacturer;
    }

    struct WalletVote {
        bool istrue;
        mapping(address => bool) voted;
        bool isOpen;
        string username;
        uint256 yesVotes;
        uint256 noVotes;
        bool isManufacturer;
        string nominateBy;
    }

    struct SupplierInfo {
        string username;
        address addressInfo;
    }

    struct OrganizationInfo {
        string username;
        address organizationContract;
    }

    struct ProductInfo {
        string productName;
        address contractAddress;
    }

    struct Info {
        bool isTrue;
        uint256 index;
    }

    mapping(string => address) hashCodeToContract;
    AllInfo[] allProductsInfo;
    mapping(string => Info) fastAccess;
    mapping(address => ProductInfo[]) manufacturerProducts;
    mapping(address => Info) manufacturerExists;
    mapping(address => Info) supplierExists;
    SupplierInfo[] allSuppliers;
    OrganizationInfo[] allManufacturers;
    mapping(address => WalletVote) walletVotes;

    address[] votingMembersInfoArray;

    uint256 totalManufacturers;
    constructor() {
        allManufacturers.push(
            OrganizationInfo("Ankit Real Estate Pvt. Limited", msg.sender)
        );
        manufacturerExists[msg.sender] = Info(true, 0);
        totalManufacturers = 1;
    }

    modifier onlyManufacturer(address _walletAddress) {
        require(
            IsManufracturer(_walletAddress),
            "Wallet address not a manufacturer"
        );
        _;
    }

    modifier onlySuppliers(address _walletAddress) {
        require(IsSupplier(_walletAddress), "Wallet address not a supplier");
        _;
    }
    function IsSupplier(address _walletaddress) public view returns (bool) {
        return supplierExists[_walletaddress].isTrue;
    }
    function IsManufracturer(
        address _walletaddress
    ) public view returns (bool) {
        return manufacturerExists[_walletaddress].isTrue;
    }

    modifier onlyVerifiedProducts(
        string memory _productHashCode,
        address _productContractAddressSupplier
    ) {
        require(
            verifyProductBySupplier(_productHashCode),
            "Product is invalid"
        );
        _;
    }

    function createManufacturerProductContract(
        string memory _productName
    ) public onlyManufacturer(msg.sender) {
        Storage productContract = new Storage();
        manufacturerProducts[msg.sender].push(
            ProductInfo(_productName, address(productContract))
        );
    }

    function addProductByManufacturer(
        string memory _hashCode,
        address _productContractAddress
    ) public onlyManufacturer(msg.sender) {
        require(
            _productContractAddress != address(0),
            "Invalid contract address"
        );

        Storage productInstance = Storage(_productContractAddress);
        require(
            address(productInstance) != address(0),
            "Invalid contract instance"
        );

        hashCodeToContract[_hashCode] = _productContractAddress;
        productInstance.addProduct(_hashCode);
    }

    function verifyProductBySupplier(
        string memory _productHashCode
    ) public view onlySuppliers(msg.sender) returns (bool) {
        Storage productInstance = Storage(hashCodeToContract[_productHashCode]);
        return productInstance.verifyProduct(_productHashCode);
    }

    function addProductBySupplier(
        string memory _hashCode
    ) public onlyVerifiedProducts(_hashCode, hashCodeToContract[_hashCode]) {
        require(
            !fastAccess[_hashCode].isTrue,
            "Product already reached to a supplier"
        );
        address contractAddress = hashCodeToContract[_hashCode];
        fastAccess[_hashCode].isTrue = true;
        Storage productInstance = Storage(contractAddress);
        allProductsInfo.push(
            AllInfo(
                _hashCode,
                allManufacturers[
                    manufacturerExists[productInstance.getowner()].index
                ].username,
                allSuppliers[supplierExists[msg.sender].index].username,
                allSuppliers[supplierExists[msg.sender].index].addressInfo,
                productInstance.gettimestamp(_hashCode),
                block.timestamp
            )
        );
        fastAccess[_hashCode] = Info(true, allProductsInfo.length - 1);
    }

    function verifyProductByCustomer(
        string memory _productHashCode
    ) public view returns (AllInfo memory) {
        if (fastAccess[_productHashCode].isTrue) {
            return allProductsInfo[fastAccess[_productHashCode].index];
        } else {
            revert("Product not found");
        }
    }

    function getAllProductsInfo() public view returns (AllInfo[] memory) {
        return allProductsInfo;
    }

    function voteToAddWallet(
        address _newWalletAddress,
        bool _vote
    ) public onlyManufacturer(msg.sender) {
        require(
            walletVotes[_newWalletAddress].isOpen,
            "Member is not part of voting"
        );
        require(
            !walletVotes[_newWalletAddress].voted[msg.sender],
            "You already voted to nominate"
        );

        if (_vote) {
            walletVotes[_newWalletAddress].yesVotes += 1;
        } else {
            walletVotes[_newWalletAddress].noVotes += 1;
        }

        walletVotes[_newWalletAddress].voted[msg.sender] = true;

        // Check if 50% or more votes are in favor to add the new wallet address
        if (
            walletVotes[_newWalletAddress].yesVotes >=
            totalManufacturers / 2 + 1
        ) {
            if (walletVotes[_newWalletAddress].isManufacturer) {
                allManufacturers.push(
                    OrganizationInfo(
                        walletVotes[_newWalletAddress].username,
                        _newWalletAddress
                    )
                );
                manufacturerExists[_newWalletAddress] = Info(
                    true,
                    allManufacturers.length - 1
                );
            } else {
                allSuppliers.push(
                    SupplierInfo(
                        walletVotes[_newWalletAddress].username,
                        address(_newWalletAddress)
                    )
                );
                supplierExists[_newWalletAddress] = Info(
                    true,
                    allSuppliers.length - 1
                );
            }
            walletVotes[_newWalletAddress].isOpen = false; // Close voting
            for (uint256 i = 0; i < allManufacturers.length; i++) {
                walletVotes[_newWalletAddress].voted[
                    allManufacturers[i].organizationContract
                ] = false;
            }
        } else if (
            walletVotes[_newWalletAddress].noVotes >= totalManufacturers / 2 + 1
        ) {
            walletVotes[_newWalletAddress].isOpen = false; // Close voting
            for (uint256 i = 0; i < allManufacturers.length; i++) {
                walletVotes[_newWalletAddress].voted[
                    allManufacturers[i].organizationContract
                ] = false;
            }
        }
    }

    function addMemberForVoting(
        address _newWalletAddress,
        string memory _newUsername,
        bool _isManufacturer
    ) public onlyManufacturer(msg.sender) {
        require(
            !manufacturerExists[_newWalletAddress].isTrue &&
                !supplierExists[_newWalletAddress].isTrue,
            "Member already a partner"
        );
        require(
            !walletVotes[_newWalletAddress].isOpen,
            "Member already present for voting"
        );
        if (!walletVotes[_newWalletAddress].istrue) {
            votingMembersInfoArray.push(_newWalletAddress);
            walletVotes[_newWalletAddress].istrue = true;
        }
        walletVotes[_newWalletAddress].isOpen = true;
        walletVotes[_newWalletAddress].nominateBy = allManufacturers[
            manufacturerExists[msg.sender].index
        ].username;
        walletVotes[_newWalletAddress].username = _newUsername;
        walletVotes[_newWalletAddress].isManufacturer = _isManufacturer;
        walletVotes[_newWalletAddress].yesVotes = 0;
        walletVotes[_newWalletAddress].noVotes = 0;
    }

    function getOpenVotingMembers()
        public
        view
        returns (VotingMember[] memory)
    {
        uint256 length = 0;
        for (uint256 i = 0; i < votingMembersInfoArray.length; i++) {
            if (walletVotes[votingMembersInfoArray[i]].isOpen) {
                length++;
            }
        }
        VotingMember[] memory openVotingMembers = new VotingMember[](length);
        uint256 index = 0;
        for (uint256 i = 0; i < votingMembersInfoArray.length; i++) {
            if (walletVotes[votingMembersInfoArray[i]].isOpen) {
                openVotingMembers[index] = VotingMember(
                    votingMembersInfoArray[i],
                    walletVotes[votingMembersInfoArray[i]].nominateBy,
                    walletVotes[votingMembersInfoArray[i]].username,
                    walletVotes[votingMembersInfoArray[i]].yesVotes,
                    walletVotes[votingMembersInfoArray[i]].noVotes,
                    walletVotes[votingMembersInfoArray[i]].isManufacturer
                );
                index++;
            }
        }
        return openVotingMembers;
    }

    function getAllManufacturers()
        public
        view
        returns (OrganizationInfo[] memory)
    {
        return allManufacturers;
    }

    function getAllSuppliers() public view returns (SupplierInfo[] memory) {
        return allSuppliers;
    }
    function getAllProductInstances(
        address _contractAddress
    ) public view returns (Storage.ProductInfo[] memory) {
        Storage storageInstance = Storage(_contractAddress);
        return storageInstance.getall();
    }

    function getAllSelfProducts(
        address _walletAddress
    ) public view returns (ProductInfo[] memory) {
        require(
            manufacturerExists[_walletAddress].isTrue,
            "Wallet address does not exist"
        );

        return manufacturerProducts[_walletAddress];
    }
}
