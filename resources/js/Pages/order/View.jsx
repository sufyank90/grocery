import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const View = (props) => {
    const { order, attribute } = props;
    const generatePDF = () => {
        const input = document.getElementById('invoice');
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const pdf = new jsPDF('p', 'pt', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdf.internal.pageSize.getWidth() - 20;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`Invoice_${order.id}.pdf`);
        });
    };

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
                    <button
                        onClick={generatePDF}
                        className="ml-2 bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-300"
                    >
                        Download PDF
                    </button>

                </div>

                <div className="max-w-10xl mx-auto p-6 bg-white rounded shadow-sm my-6" id="invoice">
                    <div className="grid grid-cols-2 items-center">
                        <div>
                            {/* Company logo */}
                            <img src="/image/logotrans.png" alt="company-logo" height="100" width="100" />
                        </div>
                        <div className="text-right">
                            <p>Air Express Mart</p>
                            <p className="text-gray-500 text-sm mt-1">airexpressmart.com</p>
                            <p className="text-gray-500 text-sm">sales@airexpressmart.com</p>
                            <p className="text-gray-500 text-sm mt-1">+92-3331325935</p>

                            {/* <p className="text-gray-500 text-sm mt-1">VAT: 8657671212</p> */}
                        </div>
                    </div>

                    {/* Client info */}
                    <div className="grid grid-cols-2 items-center mt-8">
                        <div>
                            {/* <p className="font-bold text-gray-800">Bill to:</p> */}
                            <p>Bill to: <span className='text-gray-500'>{order.name}</span>
                                {/* <br />
            {order.address}, {order.city}, {order.country} */}
                            </p>
                            <p>Address: <span className="text-gray-500" >{order.address}, {order.city}, {order.country}</span></p>
                            <p>Email: <span className="text-gray-500">{order.email}</span></p>
                            <p>payment method: <span className="text-gray-500">{order.method}</span></p>
                            <p>Status: <span className="text-gray-500" >{order.status}</span></p>
                        </div>
                        <div className="text-right">
                            <p>
                                Invoice number: <span className="text-gray-500">INV-{order.id}</span>
                            </p>
                            <p>
                                Invoice date: <span className="text-gray-500">{order.created_at_formatted}</span>

                            </p>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="-mx-4 mt-8 flow-root sm:mx-0 py-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <colgroup>
                                    <col className="w-full sm:w-1/2" />
                                    <col className="w-full sm:w-1/6" />
                                    <col className="w-full sm:w-1/6" />
                                    <col className="w-full sm:w-1/6" />
                                    <col className="sm:w-1/6" />
                                    <col className="sm:w-1/6" />
                                    <col className="sm:w-1/6" />
                                </colgroup>
                                <thead className="border-b border-gray-300 text-gray-900">
                                    <tr >
                                        <th scope="col" className="pl-4 py-2 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 whitespace-nowrap">Product Name</th>
                                        <th scope="col" className="hidden px-3 py-2 text-left text-sm font-semibold text-gray-900 sm:table-cell whitespace-nowrap">Variation ID</th>
                                        <th scope="col" className="hidden px-3 py-2 text-left text-sm font-semibold text-gray-900 sm:table-cell whitespace-nowrap">Attribute</th>
                                        <th scope="col" className="hidden px-3 py-2 text-left text-sm font-semibold text-gray-900 sm:table-cell whitespace-nowrap">Category</th>
                                        <th scope="col" className="hidden px-3 py-2 text-left text-sm font-semibold text-gray-900 sm:table-cell whitespace-nowrap">Price</th>
                                        <th scope="col" className="hidden px-3 py-2 text-right text-sm font-semibold text-gray-900 sm:table-cell whitespace-nowrap">QTY</th>
                                        <th scope="col" className="pl-3 pr-4 py-2 text-right text-sm font-semibold text-gray-900 sm:pr-0 whitespace-nowrap">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td className="max-w-0  pl-4 py-2 pr-3 text-sm sm:pl-0">
                                                <div className="font-medium text-gray-900 text-sm leading-tight break-words max-w-full">{item.name}</div>

                                                {/* <div className="mt-1 truncate text-gray-500">{item.description}</div> */}
                                            </td>
                                            <td className="hidden px-3 py-2  text-left text-sm text-gray-500 sm:table-cell">{item.variation ? item.variation.id : "N/A"}
                                        
                                            </td>
                                            <td className="hidden px-3 py-2 text-left text-sm text-gray-500 sm:table-cell">
                                                {item.variation ? (
                                                    <ul className='list-disc list-inside'>
                                                        {JSON.parse(item.variation.attributes).map((id, index) => (
                                                            <li key={index} className="flex items-center">
                                                                <span className='font-bold'>
                                                                    {attribute.find(att => att.attribute_values.some(value => value.id === parseInt(id)))?.name}:
                                                                </span>
                                                                <span className="ml-1">
                                                                    {attribute.find(att => att.attribute_values.some(value => value.id === parseInt(id)))?.attribute_values.find(value => value.id === parseInt(id))?.value}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : "N/A"}
                                            </td>

                                            <td className="hidden px-3 py-2 text-left text-sm text-gray-500 sm:table-cell">{item.category || "NA"}
                                            </td>
                                            <td className="hidden px-3 py-2 text-right text-sm text-gray-500 sm:table-cell  whitespace-nowrap">Rs. {item.price || "NA"}</td>
                                            <td className="hidden px-3 text-center text-sm text-gray-500 sm:table-cell">{item.qty || "NA"}</td>
                                            <td className=" pl-3 pr-4 py-2 text-right text-sm text-gray-500 sm:pr-0 whitespace-nowrap">
                                                Rs. {(item.price * item.qty)?.toFixed(2) || "NA"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                            <tfoot className="justify-content-right">
                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 pr-3 py-2 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Subtotal</th>
                                    <th scope="row" className="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">Subtotal</th>
                                    <td className="pl-3 pr-6 pt-6 py-2 text-right text-sm text-gray-500 sm:pr-0">Rs. {order.total}</td>
                                </tr>
                                {order.couponcode && (
                                    <tr>
                                        <th scope="row" colSpan="6" className="hidden pl-4 py-2 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Discount</th>
                                        <th scope="row" className="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">Discount</th>
                                        <td className="pl-3 pr-6 pt-4 py-2 text-right text-sm text-gray-500 sm:pr-0">-Rs. {order.discount}</td>
                                    </tr>
                                )}
                                <tr>
                                    <th scope="row" colSpan="6" className="hidden pl-4 py-2 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">Total</th>
                                    <th scope="row" className="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">Total</th>
                                    <td className="pl-3 pr-4 py-2 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">Rs. {order.payable}</td>
                                </tr>
                            </tfoot>
                        </div>

                    </div>


                    {/* Footer
                    <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
                        Please pay the invoice before the due date. You can pay the invoice by logging in to your account from our client portal.
                    </div> */}
                </div>
            </div>
        </Authenticated>
    );
};

export default View;
