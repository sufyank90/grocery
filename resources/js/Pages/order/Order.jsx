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
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const [selectId, setSelectId] = useState([]);

    const openEditModal = (order) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };

    return (
        <>
            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={
                    <>
                        <div className='flex flex-col px-4'>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Orders List</h2>
                        </div>
                    </>
                }
            >
                <Head title="Admin Dashboard" />

                {/* max-w-7xl mt-10 mx-auto w-full */}
                <div className="flex flex-col px-4 md:pl-32 md:pr-32">
                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-4">
                        <h3 className="text-lg font-bold">Orders</h3>
                        <div className="flex flex-col md:flex-row space-x-0 md:space-x-2 mt-2 md:mt-0">
                            {selectId.length > 0 &&
                                <button
                                    onClick={() => setIsBulkDeleteModalOpen(true)}
                                    className="text-white py-2 px-4 bg-red-500 rounded-lg hover:bg-green-600"
                                >
                                    Bulk Delete
                                </button>
                            }
                            <Link
                                href={route('order.create')}
                                style={{ background: '#fcb609' }}
                                className="text-black py-2 px-4 rounded-lg hover:bg-green-600"
                            >
                                Create
                            </Link>
                            <Formik
                                enableReinitialize
                                initialValues={{ search: '', status: '' }}
                                onSubmit={(values) => {
                                    router.visit(route('order.index', { search: values.search, status: values.status }), {
                                        method: 'get',
                                        preserveState: true,
                                    });
                                }}
                            >
                                {({ submitForm, setFieldValue }) => (
                                    <Form className="flex flex-col md:flex-row space-x-0 md:space-x-2 mt-2 md:mt-0">
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
                                                className="py-2 px-4 mt-2 md:mt-0 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            style={{ background: '#fcb609' }}
                                            className="text-black mt-2 md:mt-0 py-2 px-4 rounded-lg hover:bg-blue-600"
                                        >
                                            Search
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-lg">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-gray-600"
                                            onChange={(e) => setSelectId(e.target.checked ? orders.data.map((product) => product.id) : [])}
                                            checked={selectId.length === orders.data.length}
                                        />
                                    </th>
                                    {/* <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">#</th> */}
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
                                ) : (<>
                                    {orders.data.map((order, index) => (
                                        <tr key={order.id} className="hover:bg-gray-100">
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 text-gray-600"
                                                    value={order.id}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectId([...selectId, order.id]);
                                                        } else {
                                                            setSelectId(selectId.filter((id) => id !== order.id));
                                                        }
                                                    }}
                                                    checked={selectId.includes(order.id)}
                                                />
                                            </td>
                                            {/* <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{index + 1}</td> */}
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{(orders.current_page - 1) * orders.per_page + index + 1}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.user.name}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.user.email}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.phone}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.address}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">Rs. {order.total}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{order.created_at_formatted}</td>
                                            <td className="py-2 px-4 border-b text-left">
                                                {order.shipping_rate ? order.shipping_rate.area_name : 'Not Available'}
                                            </td>

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

                                            <td className="py-2 mb-5 px-4 border-b border-gray-200 text-right">
                                                <div className="text-right space-x-2">

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
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center md:items-end mt-4 mb-4">
                        <div className="flex justify-center md:justify-end mt-4 space-x-1 md:mb-0">
                            {orders.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-1 mt-1 border rounded-md text-sm ${link.active ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-yellow-300'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                        {/* Show total pages if applicable */}
                        <div className="text-sm mt-2">
                            {orders.links.length > 0 && (
                                <span>
                                    Page {orders.current_page} of {orders.last_page}
                                </span>
                            )}
                        </div>
                    </div>
                </div>



                {/* change status Modal */}
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
                                                className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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



                {/*Bulk Delete Confirmation Modal */}
                <Modal
                    show={isBulkDeleteModalOpen}
                    onClose={() => setIsBulkDeleteModalOpen(false)}
                    maxWidth="sm"
                >
                    <Formik
                        initialValues={{ confirmation: '' }}
                        validationSchema={Yup.object({
                            confirmation: Yup.string().required('Type "DELETE" to confirm').oneOf(['DELETE'], 'Type "DELETE" to confirm'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            console.log(selectId); // Ensure selectId is an array of IDs
                            router.post(route('order.bulkdestroy'), { ids: selectId.join(',') }, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsBulkDeleteModalOpen(false);
                                    setSelectId([]);
                                },
                            });
                        }}

                    >
                        <Form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto flex flex-col items-center">
                            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                            <p className="mb-4 text-gray-700">Are you sure you want to delete this order?</p>
                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="confirmation"
                                    type="text"
                                    id="delete_confirmation"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
                                    placeholder="Type DELETE to confirm"
                                />
                                <ErrorMessage name="confirmation" component="div" className="text-red-600 text-sm mt-1" />
                            </div>



                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="submit"
                                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsBulkDeleteModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </Modal>

            </AuthenticatedLayout>
        </>
    );
}

export default Orders;
