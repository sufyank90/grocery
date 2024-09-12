import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";


function AdminManagement(props) {

  const { users } = props;

  // console.log(users)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleDelete = () => {
    if (deleteItem) {
      router.delete(route('admin.destroy', deleteItem));
      setIsDeleteModalOpen(false);
    }
  };

  const openDeleteModal = (userId) => {
    setDeleteItem(userId);
    setIsDeleteModalOpen(true);
  };

  const openWalletModal = (user) => {
    setSelectedUser(user);
    setIsWalletModalOpen(true);
  }
  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  }

  const handleUpdate = (values) => {
    router.put(route('admin.update', selectedUser.id), values, {
      onSuccess: () => {
        console.log(values)
        setIsEditModalOpen(false);
      },
    });
  };

  return (
    <>
      <AuthenticatedLayout
        auth={props.auth}
        errors={props.errors}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin List</h2>}
      >
        <Head title="Admin Dashboard" />

        <div className="flex">
          <div className="max-w-7xl mt-10 mx-auto w-full">
            <div className="flex justify-between items-center mt-6 mb-4">
              <h3 className="text-lg font-bold">Admin</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  style={{ background: '#fcb609' }}
                  className="text-black py-2 px-4 rounded-lg hover:bg-green-600"
                >
                  Create
                </button>
                {/* <FaUserPlus onClick={() => setIsModalOpen(true)}
                className="w-9 h-9 cursor-pointer"
                style={{ color: '#fcb609' }}
                /> */}

                <Formik enableReinitialize initialValues={{ search: '' }}
                  onSubmit={(values) => {
                    router.visit(route('admin.index', { search: values.search }), {
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
                  <th className="py-2 px-4 border-b text-left">#</th>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>

                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {users.data.length === 0 && (
                  <tr>
                    <td className="py-2 px-4 border-b text-center" colSpan="5">
                      No users found
                    </td>
                  </tr>
                )}
                {users.data.map((user, index) => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b text-left">{index + 1}</td>
                    <td className="py-2 px-4 border-b truncate text-left">{user.name}</td>
                    <td className="py-2 px-4 border-b text-left">{user.email}</td>
                    <td className="py-2 px-4 border-b text-left">
                      <div className="flex items-center">
                        {/* <button
            
          >
            Edit
          </button> */}
                        <FaEdit onClick={() => openEditModal(user)}
                          className="w-7 h-7 cursor-pointer" style={{ color: '#fcb609' }} />
                        <span className="mx-1"> </span>
                        <MdDelete
                          onClick={() => openDeleteModal(user.id)}
                          className="w-7 h-7 cursor-pointer" style={{ color: '#fcb609' }} />



                        {/* <button  className="text-white py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600">
            Delete
          </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {/* Pagination */}
            <div className="flex justify-end mt-4 space-x-1">
              {users.links.map((link, index) => (
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


       




        {/* Create User Modal */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
  <Formik
    initialValues={{
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    }}
    validationSchema={Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
      password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    })}
    onSubmit={(values, { resetForm , setErrors}) => {
      router.post(route('admin.store'), values, {
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
        <h2 className="text-lg font-bold mb-4">Create Admin</h2>

        {/* Name Field */}
        <div className="relative z-0 w-full mb-5 group">
          <Field
            type="text"
            name="name"
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

        {/* Email Field */}
        <div className="relative z-0 w-full mb-5 group">
          <Field
            type="email"
            name="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder=" "
           
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
          <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
        </div>

        {/* Password Field */}
        <div className="relative z-0 w-full mb-5 group">
          <Field
            type="password"
            name="password"
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
          <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
        </div>

        {/* Confirm Password Field */}
        <div className="relative z-0 w-full mb-5 group">
          <Field
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="password_confirmation"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm password
          </label>
          <ErrorMessage name="password_confirmation" component="div" className="text-red-600 text-sm mt-1" />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 mt-4"
          >
            Create Admin
          </button>
        </div>
      </Form>
    )}
  </Formik>
</Modal>


        {/* Edit User Modal */}
        <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="2xl">
          <Formik
            initialValues={{
              name: selectedUser?.name || '',
              email: selectedUser?.email || '',
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Name is required'),
              email: Yup.string().email('Invalid email address').required('Email is required'),
            })}
            onSubmit={(values) => {
              handleUpdate(values);
            }}
          >
            {({ errors, touched }) => (
              <Form className="bg-white p-6 w-full max-w-lg mx-auto flex flex-col items-center">
                <h2 className="text-lg font-bold mb-4">Edit Admin</h2>

                {/* Name Field */}
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    type="text"
                    name="name"
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

                {/* Email Field */}
                <div className="relative z-0 w-full mb-5 group">
  <Field
    type="email"
    name="email"
    id="email"
    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:opacity-50 disabled:cursor-not-allowed"
    placeholder=" "
    readOnly
    disabled
  />
  <label
    htmlFor="email"
    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  >
    Email
  </label>
  <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
</div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 mt-4"
                  >
                    Update User
                  </button>
                </div>

               
              </Form>
            )}
          </Formik>
        </Modal>


        {/* Delete Confirmation Modal */}
        <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
          <div className="p-6 text-center">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this Admin?</h2>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 ml-2"
            >
              Cancel
            </button>
          </div>
        </Modal>
      </AuthenticatedLayout>
    </>
  );
}

export default AdminManagement;
