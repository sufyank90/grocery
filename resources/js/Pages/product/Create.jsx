import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import InputLabel from '@/Components/InputLabel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import Select from 'react-select';
import { useEffect } from 'react';


const FormObserver = () => {
    const { values } = useFormikContext();

    useEffect(() => {
        console.log("Form values have changed:", values);
    }, [values]);

    return null;
};

const data = [
    {
        weight: '500g',
        sizes: ['Small', 'Large'],
        colors: ['Red', 'Blue'],
        packOptions: ['Pack of 1', 'Pack of 10'],
        salePrice: 100,
        regularPrice: 500,
        sku: 3454,
        stock: 60,
        status: 'instock',
    },
    {
        weight: '500g',
        sizes: ['Small', 'Large'],
        colors: ['Red', 'Blue'],
        packOptions: ['Pack of 1', 'Pack of 10'],
        salePrice: 100,
        regularPrice: 500,
        sku: 3454,
        stock: 60,
        status: 'instock',
    },
    // You can add more items if needed
];
function Create(props) {
    const { products, categories, shippingRates, attribute } = props;

    console.log(attribute);



    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Product</h2>}
        >
            <Head title="Admin Dashboard" />
            <div className='flex justify-center mt-10 '>
                <div className="block w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow h-full mb-10">
                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                            price: '',
                            status: 'instock',
                            categories: [],
                            shipping_rates: [],
                            file: [],
                            attribute_id: [],
                            thumbnail: null, // Separate thumbnail field
                            regular_price: '',
                            sale_price: '',
                            stock: '',
                            sku: '',
                            tax_class: '',
                            tax: '',
                            stock_count: '',
                            attributes_price: [],

                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            description: Yup.string().required('Required'),
                            price: Yup.number().required('Required').positive(),
                            status: Yup.string().required('Required'),
                            categories: Yup.array().min(1, 'At least one category is required').required('Required'),
                            file: Yup.array()
                                .min(1, 'At least one image is required')
                                .test('fileFormat', 'Unsupported file format', (files) => {
                                    if (!files || files.length === 0) return true;
                                    return files.every(file =>
                                        ['image/svg+xml', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(file.type)
                                    );
                                }),
                            thumbnail: Yup.mixed().required('Thumbnail is required'),
                            regular_price: Yup.number()
                                .required('Regular price is required')
                                .positive('Regular price must be a positive number'),
                            sale_price: Yup.number()
                                .positive('Sale price must be a positive number')
                                .test(
                                    'is-less-than-or-equal-to-regular-price',
                                    'Sale price must be less than or equal to regular price',
                                    function (value) {
                                        const { regular_price } = this.parent;
                                        return !value || value <= regular_price;
                                    }
                                ),
                            tax_class: Yup.string().required('Required'),
                            tax: Yup.number().required('Required'),
                            sku: Yup.string().required('Required'),
                            stock_count: Yup.number().required('Required').positive(),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            // console.log(values)
                            const formData = {
                                ...values,
                                file: [values.thumbnail, ...values.file], // Ensure thumbnail is always the first element
                            };
                            router.post(route('product.store'), formData, {
                                onSuccess: () => {
                                    resetForm();
                                },
                            });
                        }}
                    >
                        {({ values, setFieldValue }) => {
                            // Update the price field value whenever regular_price or sale_price changes
                            useEffect(() => {
                                const price = values.sale_price < values.regular_price ? values.sale_price : values.regular_price;
                                setFieldValue('price', price);
                            }, [values.sale_price, values.regular_price, setFieldValue]);

                            return (
                                <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
                                    <h2 className="text-lg font-bold mb-4">Create Product</h2>

                                    {/* Name Field */}
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="name"
                                            type="text"
                                            id="name"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="name"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Name
                                        </label>
                                        <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    {/* Description Field */}
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="description"
                                            as="textarea"
                                            id="description"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="description"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Description
                                        </label>
                                        <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    {/* Price Field */}
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="price"
                                            type="number"
                                            id="price"
                                            step="0.01"
                                            min="0"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="price"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Price
                                        </label>
                                        <ErrorMessage name="price" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="regular_price"
                                            type="number"
                                            id="regular_price"
                                            step="0.01"
                                            min="0"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="regular_price"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Regular price
                                        </label>
                                        <ErrorMessage name="regular_price" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="sale_price"
                                            type="number"
                                            id="sale_price"
                                            min="0"
                                            step="0.01"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="sale_price"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Sale price
                                        </label>
                                        <ErrorMessage name="sale_price" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            as="select"
                                            name="tax_class"
                                            id="tax_class"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        >
                                            <option value="fixed">Fixed</option>
                                            <option value="percentage">Percentage</option>
                                        </Field>
                                        <label
                                            htmlFor="tax_class"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Tax Class
                                        </label>
                                        <ErrorMessage name="tax_class" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="tax"
                                            type="number"
                                            id="tax"
                                            min="0"
                                            step="0"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="tax"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Tax
                                        </label>
                                        <ErrorMessage name="tax" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="sku"
                                            type="text"
                                            id="sku"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="sku"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            SKU
                                        </label>
                                        <ErrorMessage name="sku" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>
                                    {/* Status Field */}
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            as="select"
                                            name="status"
                                            id="status"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        >
                                            <option value="instock">In Stock</option>
                                            <option value="outofstock">Out of Stock</option>
                                            <option value="active">Active</option>
                                        </Field>

                                        <label
                                            htmlFor="status"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Status
                                        </label>
                                        <ErrorMessage name="status" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="stock_count"
                                            type="number"
                                            id="stock_count"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="Stock Count"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Stock Count
                                        </label>
                                        <ErrorMessage name="stock_count" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>



                                    <div className="relative z-0 w-full mb-5 group bg-gray-100 p-3 rounded-lg">
                                        <InputLabel value={"Select Attribute"} />
                                        <ul className="list-disc list-inside">
                                            {attribute.length > 0 && attribute.map((attributes) => (
                                                <li key={attributes.id}>
                                                    {attributes.name} :
                                                    <ul className='ml-8'>
                                                        {attributes.attribute_values && attributes.attribute_values.map((item) => (
                                                            <li key={item.id} className="flex items-center gap-2 my-1">
                                                                <Field
                                                                    type="checkbox"
                                                                    name="attribute_id"
                                                                    value={item.id}
                                                                    checked={values.attribute_id && values.attribute_id.includes(item.id)}
                                                                    onChange={(e) => {
                                                                        const { checked } = e.target; // corrected to get the checked status directly
                                                                        const currentValues = values.attribute_id || []; // Get current values from Formik

                                                                        let newValues;
                                                                        if (checked) {
                                                                            // Add the ID if the checkbox is checked
                                                                            newValues = [...currentValues, item.id];
                                                                        } else {
                                                                            // Remove the ID if the checkbox is unchecked
                                                                            newValues = currentValues.filter(id => id !== item.id);
                                                                        }
                                                                        setFieldValue("attribute_id", newValues);
                                                                    }}
                                                                />
                                                                {item.value}
                                                                {values.attribute_id && values.attribute_id.includes(item.id) && (
                                                                    <Field type="number" name="attribute_price" placeholder="price" className="w-20 border-gray-300 rounded h-8" />
                                                                )}

                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                        <button type="button" className='bg-[#fcb609] text-white px-3 py-1 rounded mt-3' >Create Variation</button>
                                    </div>


                                    <div className="overflow-x-auto">
                                        <table className="bg-white w-full border border-gray-200 rounded-lg shadow-sm">
                                            <thead>
                                                <tr className="w-full bg-gray-200 text-gray-600 uppercase text-xs leading-normal">
                                                    <th className="py-1 px-2 text-left">Wgt</th>
                                                    <th className="py-1 px-2 text-left">Size</th>
                                                    <th className="py-1 px-2 text-left">Color</th>
                                                    <th className="py-1 px-2 text-left">Pack</th>
                                                    <th className="py-1 px-2 text-left">Sale</th>
                                                    <th className="py-1 px-2 text-left">Regular</th>
                                                    <th className="py-1 px-2 text-left">SKU</th>
                                                    <th className="py-1 px-2 text-left">Stock</th>
                                                    <th className="py-1 px-2 text-left">Status</th>
                                                    <th className="py-1 px-2 text-left">Act</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600 text-xs font-light">
                                                {data.map((item, index) => (
                                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                                        <td className="py-1 px-2">{item.weight}</td>
                                                        <td className="py-1 px-2">{item.sizes.join(', ')}</td>
                                                        <td className="py-1 px-2">{item.colors.join(', ')}</td>
                                                        <td className="py-1 px-2">{item.packOptions.join(', ')}</td>
                                                        <td className="py-1 px-2">
                                                            <input
                                                                type="number"
                                                                value={item.salePrice}
                                                                onChange={(e) => handleChange(index, 'salePrice', e.target.value)}
                                                                className="border border-gray-300 rounded p-0.5 text-xs w-full"
                                                            />
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            <input
                                                                type="number"
                                                                value={item.regularPrice}
                                                                onChange={(e) => handleChange(index, 'regularPrice', e.target.value)}
                                                                className="border border-gray-300 rounded p-0.5 text-xs w-full"
                                                            />
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            <input
                                                                type="text"
                                                                value={item.sku}
                                                                onChange={(e) => handleChange(index, 'sku', e.target.value)}
                                                                className="border border-gray-300 rounded p-0.5 text-xs w-full"
                                                            />
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            <input
                                                                type="number"
                                                                value={item.stock}
                                                                onChange={(e) => handleChange(index, 'stock', e.target.value)}
                                                                className="border border-gray-300 rounded p-0.5 text-xs w-full"
                                                            />
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            <select
                                                                value={item.status}
                                                                onChange={(e) => handleChange(index, 'status', e.target.value)}
                                                                className="border border-gray-300 rounded p-0.5 text-xs w-full"
                                                            >
                                                                <option value="instock">In</option>
                                                                <option value="outofstock">Out</option>
                                                                <option value="preorder">Pre</option>
                                                            </select>
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            <button className="text-blue-500 hover:underline text-xs">Save</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>



                                    {/* Categories Field */}
                                    <div className="relative z-0 w-full mb-5 group">
                                        <InputLabel className="" value={"Select Category"} />
                                        {categories.map((category) => (
                                            <div key={category.id} className="flex items-center">
                                                <label className="flex items-center">
                                                    <Field
                                                        type="checkbox"
                                                        name="categories"
                                                        value={category.id}
                                                        checked={values.categories.includes(category.id)}
                                                        onChange={(e) => {
                                                            const { checked } = e.target;
                                                            if (checked) {
                                                                setFieldValue("categories", [...values.categories, category.id]);
                                                            } else {
                                                                setFieldValue("categories", values.categories.filter((id) => id !== category.id));
                                                            }
                                                        }}
                                                        className="mr-2"
                                                    />
                                                    {category.name}

                                                </label>
                                            </div>
                                        ))}
                                        <ErrorMessage name="categories" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    {/* Thumbnail Upload */}
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="thumbnail" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {!values.thumbnail ? (
                                                    <>
                                                        <svg className="w-8 h-8 mb-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                    </>
                                                ) : (
                                                    <span></span>
                                                )}
                                            </div>
                                            <input
                                                onChange={(event) => {
                                                    const file = event.currentTarget.files[0];
                                                    setFieldValue('thumbnail', file);
                                                }}
                                                id="thumbnail"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>

                                    {/* Thumbnail Preview */}
                                    <div className='w-full space-y-4 mb-5'>
                                        {values.thumbnail && (
                                            <div className="relative flex items-center justify-between bg-[#f3d08140] px-2 py-2 rounded-lg">
                                                <img
                                                    height={100}
                                                    width={100}
                                                    className="rounded-lg"
                                                    src={URL.createObjectURL(values.thumbnail)}
                                                    alt="Thumbnail Preview"
                                                />
                                                {/* Delete Icon */}
                                                <IoMdRemoveCircleOutline
                                                    size={30}
                                                    onClick={() => {
                                                        // Clear the file input
                                                        document.getElementById('thumbnail').value = null;
                                                        // Reset the thumbnail in Formik state
                                                        setFieldValue('thumbnail', null);
                                                    }}
                                                    className="absolute top-[-10px] right-[-10px] m-2 p-1 bg-white rounded-full cursor-pointer text-red-500"
                                                    title="Remove Thumbnail"
                                                />
                                            </div>
                                        )}
                                        <ErrorMessage name="thumbnail" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>


                                    {/* File Upload */}
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {!values.file || values.file.length === 0 ? (
                                                    <>
                                                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                    </>
                                                ) : (
                                                    <span></span>
                                                )}
                                            </div>
                                            <input
                                                onChange={(event) => {
                                                    const newFiles = Array.from(event.currentTarget.files);
                                                    const updatedFiles = values.file ? [...values.file, ...newFiles] : newFiles;
                                                    setFieldValue('file', updatedFiles);
                                                }}
                                                id="dropzone-file"
                                                type="file"
                                                className="hidden"
                                                multiple
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>

                                    <div className="w-full space-y-4">
                                        {values.file && Array.from(values.file).map((file, index) => (
                                            <div key={index} className="relative flex items-center justify-between bg-[#f3d08140] px-2 py-2 rounded-lg">
                                                <img
                                                    height={100}
                                                    width={100}
                                                    className="rounded-lg"
                                                    src={file.url ? file.url : URL.createObjectURL(file)}
                                                    alt="Preview"
                                                />
                                                {/* Delete Icon */}
                                                <IoMdRemoveCircleOutline
                                                    size={30}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newFiles = Array.from(values.file).filter((_, i) => i !== index);
                                                        setFieldValue('file', newFiles.length > 0 ? newFiles : null);
                                                    }}
                                                    className="absolute top-[-10px] right-[-10px] m-2 p-1 bg-white rounded-full cursor-pointer text-red-500"
                                                    title="Remove Image"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name="file" component="div" className="text-red-500 text-sm" />

                                    {/* Shipping Rates */}
                                    <div className="relative z-0 w-full mb-5 mt-5 group">
                                        <InputLabel className="" value={"Select for specific areas"} />
                                        <Select
                                            onChange={(e) => {
                                                setFieldValue("shipping_rates", e.map((item) => item.value));
                                            }}
                                            isMulti
                                            name="shipping_rates"
                                            options={shippingRates}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                        />
                                        <ErrorMessage name="shipping_rates" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button
                                            type="submit"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.get(route('product.index'))}
                                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <FormObserver />
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Create;
