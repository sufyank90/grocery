import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import jsPDF from 'jspdf';

const View = (props) => {
    const { order } = props;

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Order Details", 10, 10);
        doc.text("Order ID: " + order.id, 10, 20);
        doc.text("Order Date: " + order.created_at, 10, 30);
        doc.text("Order Status: " + order.status, 10, 40);
        doc.text("Order Amount: " + order.total, 10, 50);

        // Add feedback details to the PDF
        if (order.feedbacks.length > 0) {
            doc.text("Feedbacks:", 10, 60);
            order.feedbacks.forEach((feedback, index) => {
                doc.text(`User ID: ${feedback.user_id}`, 10, 70 + (index * 10));
                doc.text(`Rating: ${feedback.rating}`, 10, 80 + (index * 10));
                doc.text(`Comment: ${feedback.comment}`, 10, 90 + (index * 10));
            });
        }

        doc.save('order-details.pdf');
    };

    return (
        <Authenticated auth={props.auth} errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">View Order # {order.id}</h2>}>
            <Head title="View Order" />
            <style>
                {`
                    @media print {
                        .no-print {
                            display: none;
                        }
                        .print-only {
                            display: block;
                        }
                        .no-print, .no-print * {
                            display: none !important;
                        }
                        .print-only {
                            display: block !important;
                        }
                    }
                    .order-table th, .order-table td {
                        padding: 12px;
                        text-align: left;
                    }
                `}
            </style>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Action Buttons */}
                <div className="flex justify-end mb-4 no-print">
                    <button
                        onClick={() => window.print()}
                        className="bg-yellow-500 text-white py-2 px-4 rounded shadow hover:bg-yellow-600 transition duration-300"
                    >
                        Print
                    </button>
                    {/* <button
                        onClick={downloadPDF}
                        className="bg-green-600 text-white py-2 px-4 rounded shadow hover:bg-green-700 transition duration-300 ml-2"
                    >
                        Download PDF
                    </button> */}
                </div>

                {/* Order Information Box */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-lg"><strong>Order ID:</strong> {order.id}</div>
                        <div className="text-lg"><strong>Order Date:</strong> {order.created_at_formatted }</div>
                        <div className="text-lg"><strong>Status:</strong> {order.status}</div>
                        <div className="text-lg"><strong>Total:</strong> ${order.total}</div>
                    </div>
                </div>

                {/* Customer Details Box */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Customer Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-lg"><strong>Name:</strong> {order.name}</div>
                        <div className="text-lg"><strong>Email:</strong> {order.email}</div>
                        <div className="text-lg"><strong>Phone:</strong> {order.phone}</div>
                        <div className="text-lg"><strong>Address:</strong> {order.address}</div>
                        <div className="text-lg"><strong>City:</strong> {order.city}</div>
                        <div className="text-lg"><strong>Country:</strong> {order.country}</div>
                        <div className="text-lg"><strong>Zipcode:</strong> {order.zipcode}</div>
                    </div>
                </div>

                {/* Order Items Box */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Items</h2>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-gray-600 order-table">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 border-b">Product Name</th>
                                    <th className="px-4 py-3 border-b">Category</th>
                                    <th className="px-4 py-3 border-b">Price</th>
                                    <th className="px-4 py-3 border-b">Qty</th>
                                    <th className="px-4 py-3 border-b">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-4">{item.name}</td>
                                        <td className="px-4 py-4">{item.category}</td>
                                        <td className="px-4 py-4">${item.price}</td>
                                        <td className="px-4 py-4">{item.qty}</td>
                                        <td className="px-4 py-4">${(item.price * item.qty).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Summary Box */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Summary</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="text-lg"><strong>Subtotal:</strong> ${order.total}</div>
                        {order.couponcode && (
                            <>
                                <div className="text-lg"><strong>Coupon:</strong> {order.couponcode}</div>
                                <div className="text-lg"><strong>Discount:</strong> -${order.discount}</div>
                            </>
                        )}
                        <div className="text-lg"><strong>Total Payable:</strong> ${order.payable}</div>
                    </div>
                </div>

                {/* Feedback Box */}

                {order.feedbacks.length > 0 && (
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Customer Feedback</h2>
                        <div className="space-y-4">
                            {order.feedbacks.map((feedback, index) => (
                                <div key={index} className="border border-gray-300 p-4 rounded-lg">
                                    {/* <div className="text-lg"><strong>User ID:</strong> {feedback.user_id}</div> */}
                                    <div className="text-lg"><strong>Rating:</strong> {feedback.rating ? feedback.rating : 'No Rating Provided.'}</div>

                                    <div className="text-lg"><strong>Comment:</strong>
                                        {feedback.comment ? ' ' + feedback.comment : ' No comment provided.'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Authenticated>
    );
};

export default View;
