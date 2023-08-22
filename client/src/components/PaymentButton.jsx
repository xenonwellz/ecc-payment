import React, {useContext, useState} from 'react';
import PaymentContract from '../contracts/PaymentContract.json';
import Web3 from "web3";

const PaymentButton = ({ invoiceId, invoiceAmount, account }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [publicKey, setPublicKey] = useState(account);
    const [privateKey, setPrivateKey] = useState('');
    const handleOpenModal = () => {
        setModalIsOpen(true);
        setPublicKey(account)
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setPublicKey('');
        setPrivateKey('');
    };

    const handlePay = async () => {
            const web3 = new Web3('http://127.0.0.1:7545'); // Use your local RPC URL
            const gas = await new web3.eth.Contract(PaymentContract.abi, PaymentContract.networks["5777"].address).methods.payInvoice(invoiceId).estimateGas({value: invoiceAmount});
            const data = new web3.eth.Contract(PaymentContract.abi, PaymentContract.networks["5777"].address).methods.payInvoice(invoiceId).encodeABI();

            const txObject = {
                from: account,
                to: PaymentContract.networks["5777"].address,
                value: invoiceAmount,
                gas,
                data: data,
                nonce: await web3.eth.getTransactionCount(account)
            };

            const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
            const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(`Transaction Hash: ${txReceipt.transactionHash}`);
            handleCloseModal();
            alert("Payment complete, Status is updating...");
    };

    return (
        <>
            <button className="bg-yellow-700 text-white px-4 mr-2 py-2 rounded" onClick={handleOpenModal}>
                Pay (ECC)
            </button>
            {modalIsOpen && <div className="fixed flex items-center justify-center text-left bg-black/30 w-full h-full top-0 left-0">
                <div className="w-[450px] rounded-lg bg-white p-5">
                    <h2 className="text-center text-2xl font-semibold mb-4">Pay Invoice {invoiceId}</h2>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-full">
                            <label htmlFor="publicKey" className="mb-2">
                                Public Key:
                            </label>
                            <input
                                type="text"
                                id="publicKey"
                                className="w-full p-2 rounded border border-gray-300"
                                value={publicKey}
                                onChange={(e) => setPublicKey(e.target.value)}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="privateKey" className="mb-2">
                                Private Key:
                            </label>
                            <input
                                type="password"
                                id="privateKey"
                                className="w-full p-2 rounded border border-gray-300"
                                value={privateKey}
                                onChange={(e) => setPrivateKey(e.target.value)}
                            />
                        </div>
                        <button
                            className="bg-blue-500 block text-white px-4 py-4 w-full rounded"
                            onClick={handlePay}
                        >
                            Pay
                        </button>
                        <button
                            className="bg-red-500 block text-white px-4 py-4 w-full rounded"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>}
        </>
    );
};

export default PaymentButton;
