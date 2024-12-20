import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import InputLabel from '@/Components/InputLabel';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { FaFileDownload } from "react-icons/fa";
import { SiMicrosoftexcel } from "react-icons/si";
import { toast } from 'react-toastify';

export default function Product(props) {
    const { products, categories } = props;
    console.log(products)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const [selectId, setSelectId] = useState([]);


    const openEditModal = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    // Function to handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0]; // Selecting the first file from the FileList object
        if (file) {
            // Check if the selected file is a CSV file
            if (file.type === "text/csv" || file.name.endsWith(".csv")|| file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
                // FileReader instance to read file contents
                // const reader = new FileReader();
                // reader.onload = (e) => {
                //     const csvContent = e.target.result;
                //     const rows = csvContent.split("\n").slice(1); // Split by lines and exclude the header row
    
                //     // Parse CSV rows into JSON objects
                //     const jsonData = rows.reduce((acc, row) => {
                //         const columns = parseCSVRow(row); // Use custom CSV parsing function
                //         // Check if all columns are empty
                //         if (columns.every(col => col.trim() === "")) {
                //             return acc; // Ignore empty rows
                //         }
    
                //         // Construct JSON object
                //         const data = {
                //             name: columns[0] || null,
                //             description: columns[1] ? columns[1].replace(/,/g, '') : null, // Remove commas if not null
                //             price: columns[2] || null,
                //             status: columns[3] || null,
                //             sku: columns[4] || null,
                //             sale_price: columns[5] || null,
                //             regular_price: columns[6] || null,
                //             tax_class: columns[7] || null,
                //             tax: columns[8] || null,
                //             stock_count: columns[9] || null,
                //         };
    
                //         acc.push(data); // Push non-empty row to accumulator
                //         return acc;
                //     }, []);
    
                //     console.log("Parsed JSON:", jsonData);
                //     router.post(route('product.csvstore'), jsonData);
                // };
                // reader.readAsText(file); 

                router.post(route('product.csvstore'), {
                    file: file
                });

            } else {
                console.error("Please select a CSV file."); // Handle non-CSV file selection
            }
        }
    };
    
    // Function to parse CSV row correctly considering quoted strings
    function parseCSVRow(row) {
        const regex = /("([^"]|"")*"|[^,]+)/g; // Match quoted strings and other values
        const matches = row.match(regex);
        return matches ? matches.map(m => m.replace(/(^"|"$)|""/g, '').trim()) : [];
    }
    

    return (
        <>




            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={
                    <>
                        <div className='flex flex-col px-4'>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Products List</h2>
                        </div>
                    </>
                }

            >
                <Head title="Admin Dashboard" />

                <div className="flex flex-col px-4 max-w-7xl mt-10 mx-auto w-full">

                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 mb-4">
                        <h3 className="text-lg font-bold mb-4 sm:mb-0">Products</h3>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            {selectId.length > 0 &&
                                <button
                                    onClick={() => setIsBulkDeleteModalOpen(true)}
                                    className="text-white py-2 px-4 bg-red-500 rounded-lg hover:bg-green-600"
                                >
                                    Bulk Delete
                                </button>
                            }
                            <a
                                href='/productexample.csv'
                                className='group relative flex items-center justify-center p-0.5 text-center font-medium transition-all focus:z-10 focus:outline-none border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700 rounded-lg'
                                download={'productexample.csv'}
                            >
                                <span className="flex items-center transition-all duration-200 rounded-md px-4 py-2 text-sm">
                                    <FaFileDownload className="mr-2 h-5 w-5" />
                                    Download CSV Template
                                </span>
                            </a>

                            {/* Import CSV File Button */}
                            <label className='group relative flex items-center justify-center p-0.5 text-center font-medium transition-all focus:z-10 focus:outline-none border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700 rounded-lg'>
                                <span className="flex items-center transition-all duration-200 rounded-md px-4 py-2 text-sm">
                                    <SiMicrosoftexcel className="mr-2 h-5 w-5" />
                                    Import CSV File
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </span>
                            </label>

                            {/* Export CSV File Button */}
                            <a
                                href={route('product.csvexport')}
                                className='group relative flex items-center justify-center p-0.5 text-center font-medium transition-all focus:z-10 focus:outline-none border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700 rounded-lg'
                            >
                                <span className="flex items-center transition-all duration-200 rounded-md px-4 py-2 text-sm">
                                    <SiMicrosoftexcel className="mr-2 h-5 w-5" />
                                    Export CSV File
                                </span>
                            </a>

                            {/* Create Product Link */}
                            <Link href={route('product.create')}
                                style={{ background: '#fcb609' }}
                                className="text-black py-2 px-4 rounded-lg hover:bg-green-600 text-center"
                            >
                                Create
                            </Link>

                            {/* Search Form */}
                            <Formik enableReinitialize initialValues={{ search: '' }}
                                onSubmit={(values) => {
                                    router.visit(route('product.index', { search: values.search }), {
                                        method: 'get', // or 'post' depending on your needs
                                        preserveState: true,
                                    });
                                }}
                            >
                                <Form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <div>
                                        <Field name="search"
                                            type="text"
                                            placeholder="Search..."
                                            className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                    <button type="submit"
                                        style={{ background: '#fcb609' }}
                                        className="text-black py-2 px-4 rounded-lg hover:bg-blue-600 text-center"
                                    >
                                        Search
                                    </button>
                                </Form>
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
                                            onChange={(e) => setSelectId(e.target.checked ? products.data.map((product) => product.id) : [])}
                                            checked={selectId.length === products.data.length}
                                        />
                                    </th>
                                    <th className="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">ID</th>
                                    <th className="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">Name</th>
                                    <th className="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">Description</th>
                                    <th className="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">Price</th>
                                    <th className="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">Sale Price</th>
                                    <th className="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">Areas</th>
                                    <th className="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">Image</th>
                                    <th className="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">Stock Count</th>
                                    <th className="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">Status</th>
                                    <th className="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">Actions</th>
                                </tr>
                            </thead>

                            <tbody className='text-center'>
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="py-2 px-4 border-b text-center">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {products.data.map((product, index) => (
                                            console.log(product),
                                            <tr key={product.id} className="hover:bg-gray-100">
                                                <td className="py-4 px-2 border-b border-gray-200 text-left text-gray-700">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-5 w-5 text-gray-600"
                                                        value={product.id}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectId([...selectId, product.id]);
                                                            } else {
                                                                setSelectId(selectId.filter((id) => id !== product.id));
                                                            }
                                                        }}
                                                        checked={selectId.includes(product.id)}
                                                    />
                                                </td>
                                                <td className="py-4 px-2 border-b text-left">{(products.current_page - 1) * products.per_page + index + 1}</td>

                                                {/* Wider columns with more height */}
                                                <td className="py-4 px-2 border-b text-left max-w-[200px]">{product.name}</td>
                                                <td className="py-4 px-2 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">{product.description}</td>

                                                <td className="py-4 px-2 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                                                    Rs. {parseFloat(product.regular_price).toFixed(2)}
                                                </td>
                                                <td className="py-4 px-2 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                                                    Rs. {parseFloat(product.sale_price).toFixed(2)}
                                                </td>

                                                {/* Adjusted area column */}
                                                <td className="py-4 px-2 border-b text-left max-w-[200px]">
                                                    {product.shipping_rates.length > 0 ? product.shipping_rates.map((area) => area.area_name).join(', ') : 'All'}
                                                </td>

                                                <td className="py-4 px-2 border-b text-left">
                                                    {product.media && product.media.length > 0 ? (
                                                        <img
                                                            src={product.media[0].original_url}
                                                            height={80}
                                                            width={80}
                                                            className='rounded-lg'
                                                            alt="Product Image"
                                                        />
                                                    ) : (
                                                        'No Image'
                                                    )}
                                                </td>
                                                <td className="py-4 px-2 border-b text-left">{product.stock_count}</td>
                                                <td className="py-4 px-2 border-b text-left">
                                                    <span
                                                        onClick={() => {
                                                            setIsStatusModalOpen(true);
                                                            setSelectedProduct(product);
                                                        }}
                                                        className={`cursor-pointer text-xs font-medium me-2 px-2.5 py-0.5 rounded ${product.status === 'instock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 border-b text-left">
                                                    <div className="flex justify-center space-x-2">
                                                        <Link href={route('product.edit', product.id)}>
                                                            <FaEdit className="w-6 h-6 cursor-pointer" style={{ color: '#fcb609' }} />
                                                        </Link>
                                                        <button onClick={() => {
                                                            setSelectedProduct(product);
                                                            setIsDeleteModalOpen(true);
                                                        }}>
                                                            <MdDelete className="w-6 h-6 cursor-pointer" style={{ color: '#fcb609' }} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    </>
                                )
                                }

                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center md:items-end mt-4 mb-4">
                        <div className="flex justify-center sm:justify-end mt-4 space-x-1 flex-wrap">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 mt-1 py-1 border rounded-lg text-center transition-colors ${link.active
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-gray-200 text-black hover:bg-yellow-300'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                        {/* Show total pages if applicable */}
                        <div className="text-sm mt-2">
                            {products.links.length > 0 && (
                                <span>
                                    Page {products.current_page} of {products.last_page}
                                </span>
                            )}
                        </div>
                    </div>
                </div>




                {/* status change modal */}

                <Modal
                    show={isStatusModalOpen}
                    onClose={() => setIsStatusModalOpen(false)}
                    maxWidth="sm"
                >
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-4">Change Status </h3>

                        <Formik
                            enableReinitialize
                            initialValues={{ status: selectedProduct?.status }}
                            validationSchema={Yup.object({
                                status: Yup.string().required('Required'),


                            })}
                            onSubmit={async (values) => {
                                // Handle form submission


                                await router.put(route('product.status', selectedProduct.id), values, {

                                    onSuccess: () => {
                                        setIsStatusModalOpen(false);
                                        setSelectedProduct(null);
                                        toast.success("Product status updated successfully");
                                    },
                                });
                            }}
                        >
                            {({ values }) => (
                                <Form>
                                    <div>
                                        <label>
                                            <Field type="radio" name="status" value="instock" />
                                            &nbsp;  Instock  &nbsp;
                                        </label>
                                        <label>
                                            <Field type="radio" name="status" value="outofstock" />
                                            &nbsp; Out of Stock  &nbsp;
                                        </label>

                                    </div>


                                    <div className="flex justify-end mt-4 space-x-2">
                                        <button type='submit'
                                            className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsStatusModalOpen(false)}
                                            type='button'
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






                {/* Create Product Modal */}
                {/* <Modal
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    maxWidth="2xl"
                >
                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                            price: '',
                            status: 'instock',
                            categories: [],
                            file: null,
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            description: Yup.string().required('Required'),
                            // price: Yup.number().required('Required').positive(),
                            status: Yup.string().required('Required'),
                            categories: Yup.array().min(1, 'At least one category is required').required('Required'),
                            file: Yup.mixed()
                                .required('File is required')
                                .test(
                                    'fileFormat',
                                    'Unsupported file format',
                                    (value) => {
                                        console.log(value)
                                        if (!value) return true; // If no file uploaded, skip validation
                                        return ['image/svg+xml', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(value.type);
                                    }
                                )
                        })}
                        onSubmit={(values, { resetForm }) => {

                            router.post(route('product.store'), values, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsModalOpen(false);
                                    toast.success("Product created successfully");
                                },
                            });
                        }}
                    >
                        {({ values, setFieldValue }) => (
                            <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
                                <h2 className="text-lg font-bold mb-4">Create Product</h2>
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

                                <div className="relative z-0 w-full mb-5 group">
                                    <Field
                                        name="price"
                                        type="number"
                                        id="price"
                                        step="0.01"
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

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        type="submit"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Submit
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
                </Modal> */}


                {/* Edit Product Modal */}
                {/* <Modal
                    show={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    maxWidth="2xl"
                >
                    <Formik
                        initialValues={{
                            name: selectedProduct ? selectedProduct.name : '',
                            description: selectedProduct ? selectedProduct.description : '',
                            price: selectedProduct ? selectedProduct.price : '',
                            status: selectedProduct ? selectedProduct.status : 'instock',
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            description: Yup.string().required('Required'),
                            price: Yup.number().required('Required').positive(),
                            status: Yup.string().required('Required'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            router.put(route('product.update', selectedProduct.id), values, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsEditModalOpen(false);
                                    toast.success('Product updated successfully');
                                },
                            });
                        }}
                    >
                        <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
                            <h2 className="text-lg font-bold mb-4">Edit Product</h2>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="name"
                                    type="text"
                                    id="edit_name"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="edit_name"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Name
                                </label>
                                <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="description"
                                    as="textarea"
                                    id="edit_description"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="edit_description"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Description
                                </label>
                                <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="price"
                                    type="number"
                                    id="edit_price"
                                    step="0.01"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="edit_price"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Price
                                </label>
                                <ErrorMessage name="price" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    as="select"
                                    name="status"
                                    id="edit_status"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                >
                                    <option value="instock">In Stock</option>
                                    <option value="outofstock">Out of Stock</option>
                                    <option value="active">Active</option>
                                </Field>
                                <label
                                    htmlFor="edit_status"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Status
                                </label>
                                <ErrorMessage name="status" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </Modal> */}



                {/* Delete Confirmation Modal */}
                <Modal
                    show={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    maxWidth="sm"
                >
                    <Formik
                        initialValues={{ confirmation: '' }}
                        validationSchema={Yup.object({
                            confirmation: Yup.string().required('Type "DELETE" to confirm').oneOf(['DELETE'], 'Type "DELETE" to confirm'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            router.delete(route('product.destroy', selectedProduct.id), {
                                onSuccess: () => {
                                    resetForm();
                                    setIsDeleteModalOpen(false);
                                    toast.success('Product deleted successfully');
                                },
                            });
                        }}
                    >
                        <Form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto flex flex-col items-center">
                            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                            <p className="mb-4 text-gray-700">Are you sure you want to delete this product?</p>
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
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </Modal>

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
                            router.post(route('product.bulkdestroy'), { ids: selectId.join(',') }, {
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
                            <p className="mb-4 text-gray-700">Are you sure you want to delete this product?</p>
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
