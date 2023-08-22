// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentContract {
    enum InvoiceStatus { Pending, Completed, Cancelled }

    struct Invoice {
        uint256 invoiceId;
        uint256 userId;  // Added userId field
        uint256 amount;
        InvoiceStatus status;
    }

    mapping(address => Invoice[]) public userInvoices;
    mapping(address => uint256) public userInvoiceCount;  // Added userInvoiceCount mapping
    uint256 public nextInvoiceId;

    event InvoiceCreated(address indexed recipient, uint256 indexed invoiceId, uint256 amount);
    event InvoicePaid(address indexed recipient, uint256 indexed invoiceId, uint256 amount);
    event InvoiceCancelled(address indexed recipient, uint256 indexed invoiceId);

    constructor() {
        nextInvoiceId = 1;
    }

    function createInvoice(uint256 _amount) external {
        uint256 userId = userInvoiceCount[msg.sender];  // Get user's invoice count as userId
        userInvoices[msg.sender].push(Invoice(nextInvoiceId, userId, _amount, InvoiceStatus.Pending));
        emit InvoiceCreated(msg.sender, nextInvoiceId, _amount);
        nextInvoiceId++;
        userInvoiceCount[msg.sender]++;  // Increment user's invoice count
    }

    function payInvoice(uint256 _invoiceId) external payable {
        Invoice storage invoice = userInvoices[msg.sender][_invoiceId];
        require(invoice.status == InvoiceStatus.Pending, "Invoice already completed or cancelled");
        require(msg.value >= invoice.amount, "Insufficient funds sent");

        payable(msg.sender).transfer(invoice.amount);
        invoice.status = InvoiceStatus.Completed;
        emit InvoicePaid(msg.sender, _invoiceId, invoice.amount);
    }

    function cancelInvoice(uint256 _invoiceId) external {
        Invoice storage invoice = userInvoices[msg.sender][_invoiceId];
        require(invoice.status == InvoiceStatus.Pending, "Invoice already completed or cancelled");

        invoice.status = InvoiceStatus.Cancelled;
        emit InvoiceCancelled(msg.sender, _invoiceId);
    }

    function getInvoiceStatus(address _user, uint256 _invoiceId) external view returns (InvoiceStatus) {
        return userInvoices[_user][_invoiceId].status;
    }

    function getUserInvoices(address _user) external view returns (Invoice[] memory) {
        return userInvoices[_user];
    }
}