import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaRegTrashCan } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import Modal from '@/Components/Modal';
const Create = (props) => {
    const { nextId, users, products } = props;
    const [selectedName, setSelectedName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);

    const handleEmailChange = (e, setFieldValue) => {
        const selectedEmail = e.target.value;
        const selectedUser = users.find(user => user.email === selectedEmail);
        const userName = selectedUser ? selectedUser.name : '';


        setSelectedName(userName);
        setFieldValue('name', userName); // Set the name field value
    };
    const calculateTotalPrice = () => {
        return selectedItem.reduce((total, item) => total + (item.price * item.qty), 0).toFixed(2);
    };
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Order # {nextId}</h2>}
        >
            <Head title="Create Order" />

            <div className='flex justify-center mt-10 '>
                <div className="block w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow h-full mb-10">
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
                        {({ isSubmitting, setFieldValue }) => (
                            <Form className="">
                                <h2 className="text-lg font-bold mb-4">Enter Customer Details</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            as="select"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            name="email"
                                            onChange={(e) => { handleEmailChange(e, setFieldValue); setFieldValue('email', e.target.value); }}
                                        >
                                            <option value="">Select Email</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.email}>
                                                    {user.email}
                                                </option>
                                            ))}
                                        </Field>
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                        </label>
                                        <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            type="text"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder="Enter your name"
                                            name="name"
                                            value={selectedName}
                                            disabled
                                        />
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                        </label>
                                        <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>



                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            type="text"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder="Enter your phone"
                                            name="phone"
                                        />
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                        </label>
                                        <ErrorMessage name="phone" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            type="text"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder="Enter your zipcode"
                                            name="zipcode"
                                        />
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                        </label>
                                        <ErrorMessage name="zipcode" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            type="text"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder="Enter your country"
                                            name="country"
                                        />
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                        </label>
                                        <ErrorMessage name="country" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            type="text"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder="Enter your city"
                                            name="city"
                                        />
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                        </label>
                                        <ErrorMessage name="city" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            type="text"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder="Enter your address"
                                            name="address"
                                        />
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                        </label>
                                        <ErrorMessage name="address" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            as="select"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder="Enter your method"
                                            name="method"
                                        >
                                            <option value="" disabled>Select Method</option>
                                            <option value="cod">COD</option>
                                            <option value="credit">Credit</option>
                                        </Field>

                                        <ErrorMessage name="method" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>


                                </div>

                                <h2 className="text-lg font-bold mb-4">Select Order Items</h2>

                                <div className='flex justify-end mb-4'>

                                    <Link className='text-blue-600 hover:text-blue-800' onClick={(e) => { e.preventDefault(); setIsModalOpen(true) }}>Add Item</Link>
                                </div>


                                <div class="relative overflow-x-auto">
                                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" class="px-6 py-3">
                                                    Product name
                                                </th>

                                                <th scope="col" class="px-6 py-3">
                                                    Category
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Price
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Qty
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedItem.map((item, index) => (


                                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {item.name}
                                                    </th>

                                                    <td class="px-6 py-4">
                                                        {item.category}
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        {item.price}
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        {item.qty}
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        <FaRegTrashCan className="text-red-500 cursor-pointer" onClick={() => setSelectedItem(prevItems => prevItems.filter((_, i) => i !== index)) } size={20} />
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                       
                                                </th>
                                                <td class="px-6 py-4"> 
                                                    
                                                </td>
                                                <td class="px-6 py-4"> 
                                                    
                                                    </td>
                                                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"> 
                                                    Total
                                                </td>
                                                <td class="px-6 py-4 ">
                                                {calculateTotalPrice()}
                                                    </td>
                                            </tr>

                                        </tbody>
                                    </table>
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
                </div>
            </div>



            {/* add item */}
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                maxWidth="2xl"
            >
                <Formik
                    initialValues={{
                        item: '',
                        qty: 0

                    }}
                    validationSchema={Yup.object({
                        item: Yup.string().required('Required'),
                        qty: Yup.number().required('Required').min(1, 'Quantity must be greater than 0').max(100, 'Quantity must be less than 100'),

                    })}
                    onSubmit={(values, { resetForm }) => {
                        const items = products.find(product => product.id === parseInt(values.item));
                        setSelectedItem(prevItems => [
                            ...prevItems,
                            {
                                order_id: nextId,
                                product_id: items.id,
                                name: items.name,
                                category: items.categories[0].name,
                                price: items.price,
                                qty: values.qty
                            }
                        ]);


                        resetForm();
                        setIsModalOpen(false);

                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto flex flex-col items-center ">
                            <h2 className="text-lg font-bold mb-4">Add Item</h2>
                            <div className="overflow-y-auto max-h-80 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            as="select"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            name="item"

                                        >
                                            <option value="" disabled>Select Product</option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id}>{product.name}</option>
                                            ))}
                                        </Field>
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                        </label>
                                        <ErrorMessage name="item" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>


                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            type="number"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            name="qty"
                                        />
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                        </label>
                                        <ErrorMessage name="qty" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>


                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Adding...' : 'Add'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>



        </Authenticated>
    )
}

export default Create