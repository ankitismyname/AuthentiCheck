import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const Navigation = ({ account, setAccount, central }) => {
    const [isManufacturerExists, setIsManufacturerExists] = useState(false);
    const [isSupplierExists, setIsSupplierExists] = useState(false);
    const [showManufacturerMenu, setShowManufacturerMenu] = useState(false);
    const [showSupplierMenu, setShowSupplierMenu] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const checkWalletExistence = async () => {
            if (account) {
                try {
                    const existsManufacturer = await central.IsManufracturer(account);
                    const existsSupplier = await central.IsSupplier(account);
                    setIsManufacturerExists(existsManufacturer);
                    setIsSupplierExists(existsSupplier);
                } catch (error) {
                    console.error(error); // Log error to console instead of showing alert
                }
            }
        };

        checkWalletExistence();
    }, [account, central]);
    

    useEffect(() => {
        const connectToWallet = async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const newAccount = ethers.getAddress(accounts[0]);
                setAccount(newAccount);
            } catch (error) {
                console.error(error);
                showErrorMessage(error);
            }
        };

        if (!account && window.ethereum) {
            connectToWallet();
        }
    }, [account, setAccount]);

    useEffect(() => {
        const handleAccountsChanged = (newAccounts) => {
            const newAccount = ethers.getAddress(newAccounts[0]);
            setAccount(newAccount);
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.off('accountsChanged', handleAccountsChanged);
            }
        };
    }, [setAccount]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowManufacturerMenu(false);
                setShowSupplierMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function showErrorMessage(error) {
        alert(`An error occurred while connecting to MetaMask: ${error.message}`);
    }

    return (
        <nav className='bg-gradient-to-r from-orange-500 to-purple-500 text-white py-4'>
            <div className='container mx-auto flex items-center justify-between'>
                <Link to="/" className="text-xl font-bold">AuthentiCheck</Link>
                <div>
                    <ul className='flex'>
                        <li className='mr-4'>
                            <Link className='hover:text-gray-300' to="/">Home</Link>
                        </li>
                        <li className='mr-4'>
                            <Link className='hover:text-gray-300' to="/VerifyProducts">VerifyProducts</Link>
                        </li>
                        <li className='mr-4'>
                            <Link className='hover:text-gray-300' to="/GetAllMarketProducts">GetAllSystemProducts</Link>
                        </li>
                        <li className='mr-4'>
                            <Link className='hover:text-gray-300' to="/GetAllThings">FetchAllCompanyProducts</Link>
                        </li>
                        <li className='mr-4'>
                            <Link className='hover:text-gray-300' to="/VotingMembersList">Nominating Organizations</Link>
                        </li>
                        <div className='text-black'>
                        {isManufacturerExists && (
                            <li className='mr-4 relative'>
                                <span className='hover:text-gray-300 text-white cursor-pointer' onClick={() => setShowManufacturerMenu(!showManufacturerMenu)}>
                                    Manufacturer Options
                                    <span className='ml-1'>&#9660;</span>
                                </span>
                                {showManufacturerMenu && (
                                    <ul ref={dropdownRef} className='absolute top-full left-0 bg-white border rounded-lg mt-1 py-2 px-7'>
                                        <li className='border-b border-gray-200'>
                                            <Link className='hover:text-blue-400  block py-1' to="CreateProductContract">CreateCompanyProducts</Link>
                                        </li>
                                        <li className='border-b border-gray-200'>
                                            <Link className='hover:text-green-400 block py-1' to="addproduct">GenerateQRofProducts</Link>
                                        </li>
                                        <li className='border-b border-gray-200'>
                                            <Link className='hover:text-orange-400 block py-1' to="/AllSelfOrganizationProducts">AllSelfOrganizationProducts</Link>
                                        </li>
                                        <li>
                                            <Link className='hover:text-purple-400 block py-1' to="/VotingForm">Vote Nominators</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        )}
                        
                        {isSupplierExists && (
                            <li className='mr-4 relative'>
                                <span className='hover:text-gray-300 text-white cursor-pointer' onClick={() => setShowSupplierMenu(!showSupplierMenu)}>
                                    Supplier Options
                                    <span className='ml-1'>&#9660;</span>
                                </span>
                                {showSupplierMenu && (
                                    <ul ref={dropdownRef} className='absolute top-full left-0 bg-white border rounded-lg mt-1 py-2 px-4'>
                                        <li className='border-b border-gray-500'>
                                            <Link className='hover:text-green-500 block py-1' to="AddProductsToMainChain">AddProductsToMainChain</Link>
                                        </li>
                                        <li>
                                            <Link className='hover:text-blue-500 block py-1' to="VerifyProductBySuppliers">VerifyProductBySuppliers</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        )}
                        </div>
                        <li className='mr-4 relative'>
                            {account ? (
                                <>
                                    <button
                                        type="button"
                                        className='bg-orange-500 px-4 py-2 rounded-full hover:bg-orange-600 focus:outline-none focus:ring focus:ring-gray-300 mr-2'
                                    >
                                        {account.slice(0, 6) + '...' + account.slice(38, 42)}
                                    </button>
                                </>
                            ) : (
                                <span className='bg-black text-white px-4 py-2 rounded-full'>
                                    Connecting...
                                </span>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
