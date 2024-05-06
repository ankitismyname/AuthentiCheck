// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
    struct ProductInfo {
        string hashcode;
        uint256 timestamp;
    }
    struct Fastaccess {
        bool istrue;
        uint256 timestamp;
    }
    ProductInfo[] Products;
    mapping(string => Fastaccess) AllProductInstances;
    address public owner;
    constructor() {
        owner = msg.sender;
    }

    modifier OnlyOwner(address _walletaddress) {
        require(
            _walletaddress == owner,
            "Your Walletaddress not match with product owner"
        );
        _;
    }

    function addProduct(string memory hashcode) public OnlyOwner(msg.sender) {
        uint256 time = block.timestamp;
        Products.push(ProductInfo(hashcode, time));
        AllProductInstances[hashcode] = (Fastaccess(true, time));
    }

    function verifyProduct(string memory hashcode) public view returns (bool) {
        return AllProductInstances[hashcode].istrue;
    }
    function gettimestamp(
        string memory hashcode
    ) public view returns (uint256) {
        return AllProductInstances[hashcode].timestamp;
    }
    function getall() public view returns (ProductInfo[] memory) {
        return Products;
    }
    function getowner() public view returns (address) {
        return owner;
    }
}
