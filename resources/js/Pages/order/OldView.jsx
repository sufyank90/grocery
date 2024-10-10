import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import jsPDF from 'jspdf';

const View = (props) => {
    const { order, attribute } = props;


    return (
        <Authenticated auth={props.auth} errors={props.errors}
            header={<h2 className=" font-semibold text-xl text-gray-800 leading-tight no-print">View Order # {order.id}</h2>}>
            <Head title="View Order" />
            <style>
                {`
                    @media print {
                        .no-print {
                            display: none;
                        }
                        .print-gap {
                            margin-top: 100px;
                        }
                    }
                `}
            </style>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ">
                {/* Action Buttons */}
                <div className="flex justify-end mb-4 no-print">
                    <button
                        onClick={() => window.print()}
                        className="bg-yellow-500 text-white py-2 px-4 rounded shadow hover:bg-yellow-600 transition duration-300"
                    >
                        Print
                    </button>

                </div>

                {/* Order Information Box */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-lg"><strong>Order ID:</strong> {order.id}</div>
                        <div className="text-lg"><strong>Order Date:</strong> {order.created_at_formatted}</div>
                        <div className="text-lg"><strong>Status:</strong> {order.status}</div>
                        <div className="text-lg"><strong>Payment Method:</strong> {order.method}</div>
                        <div className="text-lg"><strong>Total:</strong> Rs. {order.total}</div>
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
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200 print-gap">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Items</h2>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-gray-600 order-table">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 border-b">Product Name</th>
                                    <th className="px-4 py-3 border-b">Variation_id</th>
                                    <th className="px-4 py-3 border-b">Attribute</th>
                                    <th className="px-4 py-3 border-b">Category</th>
                                    <th className="px-4 py-3 border-b">Price</th>
                                    <th className="px-4 py-3 border-b">Qty</th>
                                    <th className="px-4 py-3 border-b">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    console.log(item),
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-4">{item.name}</td>
                                        <td className="px-4 py-4">{item.variation ? item.variation.id : "N/A"}</td>
                                        <td className="py-1 px-2">
                                            {item.variation ?
                                                <ul className='list-disc list-inside'>
                                                    {JSON.parse(item.variation.attributes).map((id, index) => (
                                                        console.log(attribute),
                                                        <li key={index}>
                                                            <span className='font-bold'> {attribute
                                                                .find(att => att.attribute_values.some(value => value.id === parseInt(id)))
                                                                ?.name} :
                                                            </span>
                                                            {attribute
                                                                .find(att => att.attribute_values.some(value => value.id === parseInt(id)))
                                                                ?.attribute_values.find(value => value.id === parseInt(id))
                                                                ?.value}
                                                        </li>
                                                    ))}
                                                </ul>
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-4">{item.category}</td>
                                        <td className="px-4 py-4">Rs. {item.price}</td>
                                        <td className="px-4 py-4">{item.qty}</td>
                                        <td className="px-4 py-4">Rs. {(item.price * item.qty).toFixed(2)}</td>
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
                        <div className="text-lg"><strong>Subtotal:</strong> Rs. {order.total}</div>
                        {order.couponcode && (
                            <>
                                <div className="text-lg"><strong>Coupon:</strong> {order.couponcode}</div>
                                <div className="text-lg"><strong>Discount:</strong> -Rs. {order.discount}</div>
                            </>
                        )}
                        <div className="text-lg"><strong>Total Payable:</strong> Rs. {order.payable}</div>
                    </div>
                </div>

                {/* Feedback Box */}
                <div className='no-print'>


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
            </div>
        </Authenticated>
    );
};

export default View;
