import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaRegTrashCan } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import Modal from '@/Components/Modal';

const View = (props) => {
    const { nextId, users, products, coupons, order } = props; // Assuming 'order' contains existing order data
    const [selectedName, setSelectedName] = useState(order ? order.name : '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(order ? order.items : []);
    const [totalPrice, setTotalPrice] = useState(order ? order.total : 0);
    const [finalPrice, setFinalPrice] = useState(order ? order.payable : 0);
    const [couponCode, setCouponCode] = useState(order ? order.coupon : null);

    const handleEmailChange = (e, setFieldValue) => {
        const selectedEmail = e.target.value;
        const selectedUser = users.find(user => user.email === selectedEmail);
        const userName = selectedUser ? selectedUser.name : '';

        setSelectedName(userName);
        setFieldValue('name', userName); // Set the name field value
        setFieldValue('email', selectedEmail);
        const userId = selectedUser ? selectedUser.id : '';
        setFieldValue('user_id', userId); // Set the user_id field value
    };

    const calculateTotalPrice = () => {
        return setTotalPrice(selectedItem.reduce((total, item) => total + (item.price * item.qty), 0).toFixed(2));
    };

    useEffect(() => {
        calculateTotalPrice();
        if (couponCode && couponCode.code) {
            if (totalPrice == 0.00) {
                setFinalPrice(0);
            } else {
                setFinalPrice((totalPrice - couponCode.value).toFixed(2));
            }
        } else {
            setFinalPrice(totalPrice);
        }
    }, [selectedItem, totalPrice]);

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
                            name: order ? order.name : '',
                            email: order ? order.email : '',
                            phone: order ? order.phone : '',
                            address: order ? order.address : '',
                            zipcode: order ? order.zipcode : '',
                            city: order ? order.city : '',
                            country: order ? order.country : '',
                            method: order ? order.method : '',
                            total: totalPrice,
                            couponcode: couponCode ? couponCode.code : '',
                            coupontype: couponCode ? couponCode.type : '',
                            discount: couponCode ? couponCode.value : 0,
                            status: order ? order.status : 'pending',
                            payable: finalPrice,
                            user_id: order ? order.user_id : '',
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
                        })}
                        onSubmit={(values, { resetForm }) => {
                            router.post(route('order.store'), {
                                ...values,
                                total: totalPrice,
                                discount: couponCode ? couponCode.value : 0,
                                couponcode: couponCode ? couponCode.code : '',
                                coupontype: couponCode ? couponCode.type : '',
                                status: 'pending',
                                payable: finalPrice,
                                items: selectedItem,
                                coupon: couponCode,
                            }, {
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
                                            onChange={(e) => handleEmailChange(e, setFieldValue)}
                                        >
                                            <option value="">Select Email</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.email}>
                                                    {user.email}
                                                </option>
                                            ))}
                                        </Field>
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
                                        <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Other Fields (Phone, Address, etc.) */}
                                {/* ... */}

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
                                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
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
                                                        <FaRegTrashCan className="text-red-500 cursor-pointer" onClick={() => setSelectedItem(prevItems => prevItems.filter((_, i) => i !== index))} size={20} />
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan={4} class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-right">
                                                    Sub Total
                                                </td>
                                                <td class="px-6 py-4">
                                                    {totalPrice}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-right">
                                                    Coupon Discount
                                                </td>
                                                <td class="px-6 py-4">
                                                    -{couponCode ? couponCode.value : 0}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} class="px-6 py-4 font-bold text-gray-900 whitespace-nowrap dark:text-white text-right">
                                                    Total Amount
                                                </td>
                                                <td class="px-6 py-4">
                                                    {finalPrice}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Payment Details */}
                                {/* ... */}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
                                >
                                    {isSubmitting ? 'Processing...' : 'Create Order'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-lg font-bold mb-4">Select Product</h2>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Product name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={product.id}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {product.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {product.category}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        <IoMdAddCircleOutline
                                            className="text-green-500 cursor-pointer"
                                            size={25}
                                            onClick={() => {
                                                setSelectedItem(prevItems => [...prevItems, { id: product.id, name: product.name, price: product.price, qty: 1, category: product.category }]);
                                                setIsModalOpen(false);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </Authenticated>
    );
};

export default View;
