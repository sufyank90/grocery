import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';

export default function Index(props) {
    const { shipments, createPolicy } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState({});
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const [selectId, setSelectId] = useState([]);

    const openShipmentModal = (shipment) => {
        setSelectedShipment(shipment);
        setIsModalOpen(true);
    }

    const openCreateModal = () => {
        setSelectedShipment({});
        setIsModalOpenCreate(true);
    }

    return (
        <>
            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={
                    <>
                        <div className="flex flex-col px-4">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Shipments List</h2>
                        </div>
                    </>
                }
            >
                <Head title="Admin Dashboard" />
                <div className='flex flex-col px-4 md:pl-32 md:pr-32'>
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-4">
                            <h3 className="text-lg font-bold">Shipments</h3>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-2 md:mt-0">
                                {selectId.length > 0 && (
                                    <button
                                        onClick={() => setIsBulkDeleteModalOpen(true)}
                                        className="text-white py-2 px-4 bg-red-500 rounded-lg hover:bg-green-600"
                                    >
                                        Bulk Delete
                                    </button>
                                )}

                                {createPolicy && (
                                    <button
                                        onClick={openCreateModal}
                                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                                    >
                                        Create
                                    </button>
                                )}

                                <Formik
                                    enableReinitialize
                                    initialValues={{ search: '' }}
                                    onSubmit={(values) => {
                                        router.visit(route('shipment.index', { search: values.search }), {
                                            method: 'get',
                                            preserveState: true,
                                        });
                                    }}
                                >
                                    <Form className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full">
                                        <div className="flex-1">
                                            <Field
                                                name="search"
                                                type="text"
                                                placeholder="Search..."
                                                className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            style={{ background: '#fcb609' }}
                                            className="text-black py-2 px-4 rounded-lg hover:bg-blue-600 w-full md:w-auto"
                                        >
                                            Search
                                        </button>
                                    </Form>
                                </Formik>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-gray-600"
                                                onChange={(e) => setSelectId(e.target.checked ? shipments.data.map((product) => product.id) : [])}
                                                checked={selectId.length === shipments.data.length}
                                            />
                                        </th>
                                        <th className="py-2 px-4 border-b text-left">ID</th>
                                        <th className="py-2 px-4 border-b text-left">Country</th>
                                        <th className="py-2 px-4 border-b text-left">State</th>
                                        <th className="py-2 px-4 border-b text-left">City</th>
                                        <th className="py-2 px-4 border-b text-left">Area</th>
                                        <th className="py-2 px-4 border-b text-left">Fees</th>
                                        <th className="py-2 px-4 border-b text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {shipments.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-2 px-4 border-b text-center">
                                                No shipment found
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {shipments.data.map((shipment, index) => (
                                                <tr key={shipment.id}>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-gray-600"
                                                            value={shipment.id}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectId([...selectId, shipment.id]);
                                                                } else {
                                                                    setSelectId(selectId.filter((id) => id !== shipment.id));
                                                                }
                                                            }}
                                                            checked={selectId.includes(shipment.id)}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4 border-b text-left">{(shipments.current_page - 1) * shipments.per_page + index + 1}</td>
                                                    <td className="py-2 px-4 border-b text-left">{shipment.country_name}</td>
                                                    <td className="py-2 px-4 border-b text-left">{shipment.state_name}</td>
                                                    <td className="py-2 px-4 border-b text-left">{shipment.city_name}</td>
                                                    <td className="py-2 px-4 border-b text-left">{shipment.area_name}</td>
                                                    <td className="py-2 px-4 border-b text-left">Rs. {parseFloat(shipment.fee).toFixed(2)}</td>
                                                    <td className="py-2 px-4 border-b text-left">
                                                        <div className="flex justify-center space-x-2">
                                                            <FaEdit onClick={() => openShipmentModal(shipment)} className="w-7 h-7 ml-4 cursor-pointer" style={{ color: '#fcb609' }} />
                                                            <FaTrash onClick={async () => {
                                                                if (confirm('Are you sure you want to delete this shipping rate?')) {
                                                                    await router.delete(route('shipment.destroy', shipment.id));
                                                                    // Optionally refresh the page or update the state
                                                                }
                                                            }} className="w-7 h-7 ml-4 cursor-pointer" style={{ color: '#fcb609' }} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="flex flex-col items-center md:items-end mt-4 mb-4">
                            <div className="flex flex-wrap justify-center md:justify-end space-x-1">
                                {shipments.links.map((link, index) => (
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
                                {shipments.links.length > 0 && (
                                    <span>
                                        Page {shipments.current_page} of {shipments.last_page}
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Update Fees Modal */}
                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                    <Formik
                        initialValues={{
                            fees: selectedShipment.fee,
                        }}
                        validationSchema={Yup.object({
                            fees: Yup.number().required('Fees is required').positive('Fees must be a positive number'),
                        })}
                        onSubmit={(values, { resetForm, setErrors }) => {
                            router.put(route('shipment.update', selectedShipment.id), values, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsModalOpen(false);
                                },
                                onError: (errors) => {
                                    setErrors(errors);
                                },
                            });
                        }}
                    >
                        {({ errors }) => (
                            <Form className="bg-white p-6 w-full max-w-lg mx-auto flex flex-col items-center">
                                <h2 className="text-lg font-bold mb-4">Update Fees</h2>
                                <div className="relative z-0 w-full mb-5 group">
                                    <Field
                                        type="number"
                                        name="fees"
                                        id="fees"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="fees"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Fees
                                    </label>
                                    <ErrorMessage name="fees" component="div" className="text-red-600 text-sm mt-1" />
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 mt-4">Update Fees</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal>

                {createPolicy &&
                    <Modal show={isModalOpenCreate} onClose={() => setIsModalOpenCreate(false)} maxWidth="2xl">
                        <Formik
                            initialValues={{
                                country_name: 'Pakistan',
                                state_name: 'Sindh',
                                city_name: 'Karachi',
                                area_name: '',
                                fee: '',
                                rate_id: 'null',
                                zone_id: 'null',
                                weight_status: 'null',
                                merchant_id: 'null',
                                country_id: 'null',
                                state_id: 'null',
                                city_id: 'null',
                                postal_code: 'null',
                                area_id: 'null',
                                branch_id: 'null',
                                latitude: 'null',
                                longitude: 'null',
                                minimum: '1',
                                min_for_free_delivery: '1',
                                delivery_estimation: '1',
                                sequence: '1',
                                date_created: '2023-05-01',
                                date_modified: '2023-05-01',
                                ip_address: '1',
                                weight_charges: '1',
                                additional_weight_charges: '1',
                                end_weight_range: '1',


                            }}
                            validationSchema={Yup.object({
                                area_name: Yup.string().required('Area is required'),
                                fee: Yup.number().required('Fees is required').positive('Fees must be a positive number'),
                            })}
                            onSubmit={(values, { resetForm, setErrors }) => {
                                router.post(route('shipment.store'), values, {
                                    onSuccess: () => {
                                        resetForm();
                                        setIsModalOpenCreate(false);

                                    },
                                    onError: (errors) => {
                                        setErrors(errors);

                                    },
                                });
                            }}
                        >
                            {({ errors }) => (
                                <Form className="bg-white p-6 w-full max-w-lg mx-auto flex flex-col items-center">
                                    <h2 className="text-lg font-bold mb-4">Create Shipment</h2>

                                    {/* <div className="relative z-0 w-full mb-5 group">
                                    <Field
                                        type="text"
                                        name="country"
                                        id="country"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="country"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Country
                                    </label>
                                    <ErrorMessage name="country" component="div" className="text-red-600 text-sm mt-1" />
                                </div>

                                <div className="relative z-0 w-full mb-5 group">
                                    <Field
                                        type="text"
                                        name="state"
                                        id="state"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="state"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        State
                                    </label>
                                    <ErrorMessage name="state" component="div" className="text-red-600 text-sm mt-1" />
                                </div>

                                <div className="relative z-0 w-full mb-5 group">
                                    <Field
                                        type="text"
                                        name="city"
                                        id="city"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="city"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        City
                                    </label>
                                    <ErrorMessage name="city" component="div" className="text-red-600 text-sm mt-1" />
                                </div> */}

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            type="text"
                                            name="area_name"
                                            id="area_name"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="area_name"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Area
                                        </label>
                                        <ErrorMessage name="area_name" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            type="number"
                                            name="fee"
                                            id="fee"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="fee"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Fees
                                        </label>
                                        <ErrorMessage name="fee" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="flex justify-end">
                                        <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 mt-4">Create Shipment</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal>
                }



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
                            router.post(route('shipment.bulkdestroy'), { ids: selectId.join(',') }, {
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
                            <p className="mb-4 text-gray-700">Are you sure you want to delete this shipment?</p>
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
