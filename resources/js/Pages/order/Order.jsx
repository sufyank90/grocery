import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { IoCreate } from "react-icons/io5";




function Orders(props) {
    const { orders } = props; // Update this to use orders instead of categorys

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openEditModal = (order) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };

    return (
        <>
            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Orders List</h2>}
            >
                <Head title="Admin Dashboard" />

                <div className="flex">
                    <div className="w-full pl-32 pr-32 mt-10">
                        <div className="flex justify-between items-center mt-6 mb-4">
                            <h3 className="text-lg font-bold">Orders</h3>
                            <div className="flex space-x-2">
                                {/* <button
                                    // onClick={() => setIsModalOpen(true)}
                                    href={route('order.create')}
                                    style={{ background: '#fcb609' }}
                                    className="text-black py-2 px-4 rounded-lg hover:bg-green-600"
                                >

                                    Create
                                </button> */}
                                <Link href={route('order.create')}
                                    style={{ background: '#fcb609' }}
                                    className="text-black py-2 px-4 rounded-lg hover:bg-green-600">
                                    Create
                                </Link>

                                {/* <Link 
                                
                                href={route('order.create')}>
                                    <IoCreate style={{ color: '#fcb609' }} className='w-8 h-8 cursor-pointer' />
                                </Link> */}



                                <Formik enableReinitialize initialValues={{ search: '' }}
                                    onSubmit={(values) => {
                                        router.visit(route('order.index', { search: values.search }), {
                                            method: 'get', // or 'post' depending on your needs
                                            preserveState: true,
                                        });
                                    }}
                                >
                                    <Form className="flex space-x-2">
                                        <div >
                                            <Field name="search"
                                                type="text"
                                                placeholder="Search..."
                                                className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />

                                        </div>
                                        <button type="submit"
                                            style={{ background: '#fcb609' }}
                                            className="text-black py-2 px-4 rounded-lg hover:bg-blue-600">
                                            Search
                                        </button>
                                    </Form>
                                </Formik>



                            </div>
                        </div>

                        <table className="min-w-full bg-white rounded-lg shadow-lg">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">#</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Name</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Email</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Phone</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Address</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Total</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Status</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-right font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-3 px-4 border-b border-gray-200 text-center text-gray-700">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (<>
                                    {orders.data.map((order, index) => (
                                        <tr key={order.id} className="hover:bg-gray-100">
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{index + 1}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.name}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.email}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.phone}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.address}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.total}</td>
                                            {/* <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.status}</td> */}
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">
                                                {order.status === 'pending' && (
                                                    <span
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="bg-yellow-100 cursor-pointer text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                                        {order.status}
                                                    </span>
                                                )}
                                                {order.status === 'completed' && (
                                                    <span
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="bg-green-100 cursor-pointer text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                                        {order.status}
                                                    </span>
                                                )}
                                                {order.status === 'cancelled' && (
                                                    <span
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="bg-red-100 cursor-pointer text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                                        {order.status}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-2 px-4 border-b border-gray-200 text-right">
                                                <div className="text-right space-x-2">
                                                    {/* <button
                                                    onClick={() => openEditModal(order)}
                                                    className="text-white py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600"
                                                >
                                                    View
                                                </button> */}
                                                    {/* <Link
                                                   
                                                    className="text-white py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600"
                                                >
                                                    View
                                                </Link> */}
                                                    <Link href={route('order.show', order.id)}>
                                                        <GrView className="w-7 h-7" style={{ color: '#fcb609' }} />
                                                    </Link>


                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                </>)}

                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex justify-end mt-4 space-x-1">
                            {orders.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    color=''
                                    className={`px-3 py-1 border ${link.active ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-yellow-300'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

              
                {/* Delete Confirmation Modal */}
                {selectedOrder && (
                    <Modal
                        show={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        maxWidth="sm"
                    >
                        <div className="bg-white p-4 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">Change Status </h3>

                            <Formik
                                enableReinitialize
                                initialValues={{ status: selectedOrder.status || '', reason: selectedOrder.reason || '' }}
                                validationSchema={Yup.object({
                                    status: Yup.string().required('Required'),

                                    reason: Yup.string().when("status", {
                                        is: 'cancelled',
                                        then: schema => schema.required(),
                                        otherwise: schema => schema.optional(),
                                    })

                                })}
                                onSubmit={(values) => {
                                    // Handle form submission


                                    router.put(route('order.status', selectedOrder.id), values, {

                                        onSuccess: () => {
                                            setIsDeleteModalOpen(false);
                                            setSelectedOrder(null);
                                        },
                                    });
                                }}
                            >
                                {({ values }) => (
                                    <Form>
                                        <div>
                                            <label>
                                                <Field type="radio" name="status" value="pending" />
                                                &nbsp;  Pending  &nbsp;
                                            </label>
                                            <label>
                                                <Field type="radio" name="status" value="completed" />
                                                &nbsp; Completed  &nbsp;
                                            </label>
                                            <label>
                                                <Field type="radio" name="status" value="cancelled" />
                                                &nbsp; Cancelled  &nbsp;
                                            </label>
                                        </div>
                                        <ErrorMessage name="status" component="div" className="text-red-600 text-sm mt-1" />
                                        {values.status === 'cancelled' && (
                                            <div className='mt-4'>
                                                <Field placeholder="Reason" className="w-full p-2 border border-gray-300 rounded" name="reason" />
                                                <ErrorMessage name="reason" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>

                                        )}

                                        <div className="flex justify-end mt-4 space-x-2">
                                            <button type='submit'
                                                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                            >
                                                Save
                                            </button>
                                            <button type='button'
                                                onClick={() => setIsDeleteModalOpen(false)}
                                                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                    </Form>
                                )}
                            </Formik>

                        </div>
                    </Modal>
                )}
            </AuthenticatedLayout>
        </>
    );
}

export default Orders;
