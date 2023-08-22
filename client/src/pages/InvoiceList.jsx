import React, { useContext, useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Web3Context } from '../utils/contexts/Contract.jsx';
import PaymentButton from "../components/PaymentButton.jsx";

const InvoiceList = () => {
    const { web3, contract, account } = useContext(Web3Context);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, [account]);

    const fetchInvoices = async () => {
        try {
            const fetchedInvoices = await contract.methods.getUserInvoices(account).call();
            setInvoices(fetchedInvoices);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setLoading(false);
        }
    };

    const handlePayInvoice = async (invoiceId, price) => {
        try {
            console.log(invoiceId);
            await contract.methods.payInvoice(invoiceId).send({ from: account, value: price });
            fetchInvoices();
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleCancelInvoice = async (invoiceId) => {
        try {
            await contract.methods.cancelInvoice(invoiceId).send({ from: account });
            fetchInvoices();
        } catch (error) {
            console.error('Error cancelling invoice:', error);
        }
    };


    return (
        <PageLayout>
            <div className="flex items-center justify-center h-full">
                <div className="p-4 w-full">
                    <h2 className="text-center text-2xl font-semibold mb-4 border-b pb-2">Invoice List</h2>
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : invoices.length === 0 ? (
                        <p className="text-center">No invoices yet.</p>
                    ) : (
                        <table className="w-full border border-collapse table-fixed">
                            <thead>
                            <tr className="border-t border-b bg-gray-200">
                                <th className="p-2 border">Invoice #</th>
                                <th className="p-2 border">Amount</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice.invoiceId} className="border-b border-gray-300">
                                    <td className="p-2 border">{invoice.invoiceId}</td>
                                    <td className="p-2 border text-center">
                                        {web3.utils.fromWei(invoice.amount, 'ether')} ETH
                                    </td>
                                    <td className="p-2 border text-center">
                                        {invoice.status === '0'
                                            ? <span className="bg-yellow-500 px-2 rounded-lg text-white font-medium">
                                                Pending
                                            </span>
                                            : invoice.status === '1'
                                                ? <span className="bg-green-500 px-2 rounded-lg text-white font-medium">
                                                Completed
                                            </span>
                                                : <span className="bg-red-500 px-2 rounded-lg text-white font-medium">
                                                Cancelled
                                            </span>}
                                    </td>
                                    <td className="p-2 border text-right">
                                        {invoice.status === '0' && (
                                            <>
                                                <PaymentButton invoiceId={invoice.userId} account={account} invoiceAmount={invoice.amount}/>
                                                <button
                                                    className="bg-blue-600 text-white px-10 py-2 rounded-md mr-2"
                                                    onClick={() => handlePayInvoice(invoice.userId, invoice.amount)}
                                                >
                                                    Pay
                                                </button>
                                                <button
                                                    className="bg-red-700 text-white px-10 py-2 rounded-md"
                                                    onClick={() => handleCancelInvoice(invoice.userId)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default InvoiceList;
