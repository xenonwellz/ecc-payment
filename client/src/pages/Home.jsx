import React, { useContext, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Web3Context } from '../utils/contexts/Contract.jsx';

const Home = () => {
    const { web3, contract, account } = useContext(Web3Context);
    const [amount, setAmount] = useState('');

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const createInvoice = async () => {
        if (!amount || !web3.utils.isAddress(account)) {
            return;
        }

        try {
            const weiAmount = web3.utils.toWei(amount, 'ether');
            await contract.methods.createInvoice(weiAmount).send({ from: account });
            setAmount('');
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };

    return (
        <PageLayout>
            <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-md p-6 rounded-lg bg-white shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Create Payment Invoice</h2>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium">Payment Amount (ETH)</label>
                        <input
                            type="number"
                            className="w-full p-3 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                    </div>
                    <button
                        className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold"
                        onClick={createInvoice}
                    >
                        Create Invoice
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default Home;
