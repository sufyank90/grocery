import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                                >

                                    Create
                                </button> */}
                                <Link href={route('order.create')} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
                                    Create
                                </Link>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                                    Search
                                </button>
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
                                ):(<>
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
                                                <button
                                                    onClick={() => openEditModal(order)}
                                                    className="text-white py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600"
                                                >
                                                    View
                                                </button>
                                             
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
                                    className={`px-3 py-1 border ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Create Order Modal */}
                <Modal
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    maxWidth="2xl"
                >
                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            phone: '',
                            address: '',
                            zipcode: '',
                            city: '',
                            country: '',
                            method: '',
                            total: '',
                            couponcode: '',
                            coupontype: '',
                            discount: '',
                            status: '',
                            payable: '',
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            email: Yup.string().email('Invalid email address').required('Required'),
                            phone: Yup.string().required('Required'),
                            address: Yup.string().required('Required'),
                            zipcode: Yup.string().required('Required'),
                            city: Yup.string().required('Required'),
                            country: Yup.string().required('Required'),
                            method: Yup.string().required('Required'),
                            total: Yup.number().required('Required'),
                            couponcode: Yup.string(),
                            coupontype: Yup.string(),
                            discount: Yup.number(),
                            status: Yup.string().required('Required'),
                            payable: Yup.number().required('Required'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            router.post(route('order.store'), values, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsModalOpen(false);
                                },
                            });
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto flex flex-col items-center">
                                <h2 className="text-lg font-bold mb-4">Create Order</h2>
                                <div className="overflow-y-auto max-h-80 w-full">
                                    {['name', 'email', 'phone', 'address', 'zipcode', 'city', 'country', 'method', 'total', 'couponcode', 'coupontype', 'discount', 'status', 'payable'].map(field => (
                                        <div key={field} className="relative z-0 w-full mb-5 group">
                                            <Field
                                                name={field}
                                                type={field === 'total' || field === 'discount' || field === 'payable' ? 'number' : 'text'}
                                                id={field}
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                placeholder=" "
                                            />
                                            <label
                                                htmlFor={field}
                                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                            >
                                                {field.charAt(0).toUpperCase() + field.slice(1)}
                                            </label>
                                            <ErrorMessage name={field} component="div" className="text-red-600 text-sm mt-1" />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal>


                {/* Edit Order Modal */}
                {selectedOrder && (
                    <Modal
                        show={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        maxWidth="2xl"
                    >
                        <Formik
                            initialValues={{
                                name: selectedOrder.name || '',
                                email: selectedOrder.email || '',
                                phone: selectedOrder.phone || '',
                                address: selectedOrder.address || '',
                                zipcode: selectedOrder.zipcode || '',
                                city: selectedOrder.city || '',
                                country: selectedOrder.country || '',
                                method: selectedOrder.method || '',
                                total: selectedOrder.total || '',
                                couponcode: selectedOrder.couponcode || '',
                                coupontype: selectedOrder.coupontype || '',
                                discount: selectedOrder.discount || '',
                                status: selectedOrder.status || '',
                                payable: selectedOrder.payable || '',
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string().required('Required'),
                                email: Yup.string().email('Invalid email address').required('Required'),
                                phone: Yup.string().required('Required'),
                                address: Yup.string().required('Required'),
                                zipcode: Yup.string().required('Required'),
                                city: Yup.string().required('Required'),
                                country: Yup.string().required('Required'),
                                method: Yup.string().required('Required'),
                                total: Yup.number().required('Required'),
                                couponcode: Yup.string(),
                                coupontype: Yup.string(),
                                discount: Yup.number(),
                                status: Yup.string().required('Required'),
                                payable: Yup.number().required('Required'),
                            })}
                            onSubmit={(values) => {
                                router.put(route('order.update', selectedOrder.id), values, {
                                    onSuccess: () => {
                                        setIsEditModalOpen(false);
                                        setSelectedOrder(null);
                                    },
                                });
                            }}
                        >
                            <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
                                <h2 className="text-lg font-bold mb-4">Edit Order</h2>
                                {['name', 'email', 'phone', 'address', 'zipcode', 'city', 'country', 'method', 'total', 'couponcode', 'coupontype', 'discount', 'status', 'payable'].map(field => (
                                    <div key={field} className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name={field}
                                            type={field === 'total' || field === 'discount' || field === 'payable' ? 'number' : 'text'}
                                            id={field}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor={field}
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <ErrorMessage name={field} component="div" className="text-red-600 text-sm mt-1" />
                                    </div>
                                ))}

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        type="submit"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                    </Modal>
                )}

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
                                        validationSchema={Yup.object({ status: Yup.string().required('Required'),
                                            
                                            reason:Yup.string().when("status", {
                                            is: 'cancelled',
                                            then: schema => schema.required(),
                                            otherwise: schema => schema.optional(),
                                          })
                                        
                                        })}
                                        onSubmit={(values) => {
                                            // Handle form submission


                                            router.put(route('order.status', selectedOrder.id),values, {
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
                                <button
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
