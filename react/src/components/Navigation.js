import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const Navigation = ({ account, setAccount }) => {

    function showErrorMessage(error) {
        alert(`An error occurred while connecting to MetaMask: ${error.message}`);
    }

    const connectHandler = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = ethers.getAddress(accounts[0]);
            setAccount(account);
        } catch (error) {
            console.log(error);
            showErrorMessage(error);
        }
    }

    return (
        <nav className='bg-gradient-to-r from-orange-500 to-purple-500 text-white py-4'>
            <div className='container mx-auto flex items-center justify-between'>
                <Link to="/" className="text-xl font-bold">Product Verifier</Link>
                <div>
                    <ul className='flex'>
                        <li className='mr-4'>
                            <Link className='hover:text-gray-300' to="/">Home</Link>
                        </li>
                        <li className='mr-4'>
                            <Link className='hover:text-gray-300' to="getcontract">FetchCompanyProducts</Link>
                        </li>
                        
                        <li className='mr-4'>
                                    <Link className='hover:text-gray-300' to="verify">VerifyProduct</Link>
                                </li>
                       
                        {account && (
                            <>
                                  <li className='mr-4'>
                            <Link className='hover:text-gray-300' to="createcontract">CreateCompanyProducts</Link>
                        </li>
                            <li className='mr-4'>
                                 <Link className='hover:text-gray-300' to="addproduct">AddInstanceOfProducts</Link>
                        </li>
                        <li className='mr-4'>
                                    <Link className='hover:text-gray-300' to="/AllSelfOrganizationProducts">AllSelfOrganizationProducts</Link>
                                </li>
                                <li className='mr-4'>
                                    <Link className='hover:text-gray-300' to="/VotingMembersList">Nominating Organizations</Link>
                                </li>
                                <li className='mr-4'>
                                    <Link className='hover:text-gray-300' to="/VotingForm">Vote Nominators</Link>
                                </li>
                                
                            </>
                        )}
                        <li>
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
                                <button
                                    type="button"
                                    className='bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 focus:outline-none focus:ring focus:ring-gray-300'
                                    onClick={connectHandler}
                                >
                                    Connect
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
