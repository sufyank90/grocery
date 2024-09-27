import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { GrView } from 'react-icons/gr';
import { Field, Form, Formik } from 'formik';

export default function AdminPanel(props) {
    const { 
        countuser,
        countpendingorder,
        countcompletedorder,
        countorders, 
        salesToday, 
        salesThisWeek, 
        salesThisMonth,  
        orders 
    } = props;
    
    const [dateFilter, setDateFilter] = useState('');

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="flex flex-col">

                {/* Main Content */}
                <div className="max-w-7xl mt-10 mx-auto w-full">
                    <div className="py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Cards */}
                            <div className="bg-white border text-black p-4 rounded-lg shadow border-[#fcb609]">
                                <h3 className="text-lg font-bold">Total Customers</h3>
                                <p className="mt-2 text-xl">{countuser}</p>
                            </div>
                            <div className="bg-white border text-black p-4 rounded-lg shadow border-[#fcb609]">
                                <h3 className="text-lg font-bold">Pending Orders</h3>
                                <p className="mt-2 text-xl">{countpendingorder}</p>
                            </div>
                            <div className="bg-white border text-black p-4 rounded-lg shadow border-[#fcb609]">
                                <h3 className="text-lg font-bold">Completed Orders</h3>
                                <p className="mt-2 text-xl">{countcompletedorder}</p>
                            </div>
                            <div className="bg-white border text-black p-4 rounded-lg shadow border-[#fcb609]">
                                <h3 className="text-lg font-bold">Total Sales Today</h3>
                                <p className="mt-2 text-xl">Rs. {salesToday}</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Cards */}
                            <div className="bg-white border text-black p-4 rounded-lg shadow border-[#fcb609]">
                                <h3 className="text-lg font-bold">Total Sales This Week</h3>
                                <p className="mt-2 text-xl">Rs. {salesThisWeek}</p>
                            </div>
                            <div className="bg-white border text-black p-4 rounded-lg shadow border-[#fcb609]">
                                <h3 className="text-lg font-bold">Total Sales This Month</h3>
                                <p className="mt-2 text-xl">Rs. {salesThisMonth}</p>
                            </div>
                            <div className="bg-white border text-black p-4 rounded-lg shadow border-[#fcb609]">
                                <h3 className="text-lg font-bold">Total Orders</h3>
                                <p className="mt-2 text-xl">{countorders}</p>
                            </div>
                        </div>
                    </div>
 {/* Table (Hidden on mobile) */}
 <div className="hidden md:block">
                    <div className="w-full mt-10">
                        <div className="flex justify-between items-center mt-6 mb-4">
                            <h3 className="text-lg font-bold">Total Sales</h3>
                            <div className="flex space-x-2">
                                <Formik
                                    initialValues={{ status: '', search: '' }}
                                    onSubmit={(values) => {
                                        router.visit(route('dashboard', {
                                            status: values.status,
                                            search: values.search,
                                        }), {
                                            method: 'get',
                                            preserveState: true,
                                        });
                                    }}
                                >
                                    {({ submitForm, setFieldValue }) => (
                                        <Form className="flex space-x-2">
                                            <div>
                                                <Field
                                                    as="select"
                                                    name="status"
                                                    className="py-2 pr-7 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    onChange={(e) => {
                                                        setFieldValue('status', e.target.value);
                                                        submitForm();  // Automatically submit the form on change
                                                    }}
                                                >
                                                    <option value="">All</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </Field>
                                            </div>
                                            <div>
                                                <Field
                                                    name="search"
                                                    type="text"
                                                    placeholder="Search By Order Id"
                                                    className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                style={{ background: '#fcb609' }}
                                                className="text-black py-2 px-4 rounded-lg hover:bg-blue-600"
                                            >
                                                Search
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>

                       
                            <table className="min-w-full bg-white rounded-lg shadow-lg">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">ID</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Name</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Email</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Phone</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Address</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Total</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Ordered At</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Area</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Status</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-right font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="py-3 px-4 border-b border-gray-200 text-center text-gray-700">
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {orders.data.map((order, index) => (
                                                <tr key={order.id} className="hover:bg-gray-100">
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{(orders.current_page - 1) * orders.per_page + index + 1}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.name}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.email}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.phone}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.address}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">Rs. {order.total}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.created_at_formatted}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.shipping_rate ? order.shipping_rate.area_name : 'Not Available'}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">
                                                        <span className={`bg-${order.status === 'pending' ? 'yellow' : order.status === 'completed' ? 'green' : 'red'}-100 cursor-pointer text-${order.status === 'pending' ? 'yellow' : order.status === 'completed' ? 'green' : 'red'}-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 mb-5 px-4 border-b border-gray-200 text-right">
                                                        <div className="text-right space-x-2">
                                                            <Link href={route('order.show', order.id)}>
                                                                <GrView className="w-7 h-7" style={{ color: '#fcb609' }} />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="flex justify-end mt-4 space-x-1">
                                {orders.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-1 border ${link.active ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-yellow-300'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
