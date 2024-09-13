import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import InputLabel from '@/Components/InputLabel';
import { FaEdit, FaWallet  } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


export default function Index(props) {
    const { shipments } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState({});
    
    
    const openShipmentModal = (user) => {
        //console.log(selectedShipment)
        setSelectedShipment(user);
        setIsModalOpen(true);
      }

    return (
        <>
            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Shipments List</h2>}
            >
                <Head title="Admin Dashboard" />

                <div className="flex">
                    <div className="max-w-7xl mt-10 mx-auto w-full">
                        <div className="flex justify-between items-center mt-6 mb-4">
                            <h3 className="text-lg font-bold">Shipments</h3>
                            <div className="flex space-x-2">
                                {/* <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                                >
                                    Create
                                </button> */}

                                <Link href={route('shipment.create')}
                                    style={{ background: '#fcb609' }}
                                    className="text-black py-2 px-4 rounded-lg hover:bg-green-600">
                                    Create
                                </Link>
                                <Formik enableReinitialize initialValues={{ search: '' }}
                                    onSubmit={(values) => {
                                        router.visit(route('shipment.index', { search: values.search }), {
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

                        <table className="min-w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr>
                                    {/* <th className="py-2 px-4 border-b text-left">#</th> */}
                                    <th className="py-2 px-4 border-b text-left">ID</th>
                                    <th className="py-2 px-4 border-b text-left">Name</th>
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
                                                {/* <td className="py-2 px-4 border-b text-left">{index + 1}</td> */}
                                                <td className="py-2 px-4 border-b text-left">{(shipments.current_page - 1) * shipments.per_page + index + 1}</td>
                                                <td className="py-2 px-4 border-b text-left">{shipment.area_name}</td>
                                                <td className="py-2 px-4 border-b text-left">Rs. {parseFloat(shipment.fee).toFixed(2)}</td>
                                                <td className="py-2 px-4 border-b text-left">
                                                    <div className="flex justify-center space-x-2">

                                                        {/* <Link
                                                            href={route('shipment.edit', shipment.id)}

                                                        >
                                                            <FaEdit
                                                                className="w-7 h-7 cursor-pointer" style={{ color: '#fcb609' }} />
                                                        </Link> */}

                                                        <FaEdit href={route('shipment.edit', shipment.id)} onClick={() => openShipmentModal(shipment)} className="w-7 h-7 ml-4 cursor-pointer" style={{ color: '#fcb609' }} />


                                                        {/* <button
                                                            onClick={() => {
                                                                setSelectedProduct(shipment);
                                                                setIsDeleteModalOpen(true);
                                                            }}

                                                        >
                                                            <MdDelete

                                                                className="w-7 h-7 cursor-pointer" style={{ color: '#fcb609' }} />
                                                        </button> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )
                                }

                            </tbody>
                        </table>


                        {/* Pagination */}
                        <div className="flex justify-end mt-4 space-x-1 mb-8">
                            {shipments.links.map((link, index) => (
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
                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                    <Formik
                        initialValues={{
                        fees: selectedShipment.fee,
                        }}
                        validationSchema={Yup.object({
                        fees: Yup.string().required('Fees is required'),
                        })}
                        onSubmit={(values, { resetForm, setErrors }) => {
                            console.log(selectedShipment.id)
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
                        {({ errors, touched }) => (
                        <Form className="bg-white p-6 w-full max-w-lg mx-auto flex flex-col items-center">
                            <h2 className="text-lg font-bold mb-4">Fees</h2>
                            {/* Name Field */}
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
                                <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 mt-4" > Update Fees </button>
                            </div>
                        </Form>
                        )}
                    </Formik>
                    </Modal>

            </AuthenticatedLayout>
        </>
    );
}
