import React from 'react';
import Head from 'next/head';
import { useFormik } from 'formik';
import nProgress from 'nprogress';
import * as Yup from 'yup';
import { NotificationManager } from 'react-notifications';

const initialValues = {
  fullname: '',
  email: '',
  phoneNumber: '',
};

const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(6, 'Minimum 6 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('fullname is required'),
  email: Yup.string()
    .min(6, 'Minimum 6 symbols')
    .max(50, 'Maximum 50 symbols')
    .email('Invalid')
    .required('email is required'),
  phoneNumber: Yup.string()
    .min(6, 'Minimum 6 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('phoneNumber is required'),
});

const FormPage = () => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, action) => {
      nProgress.start();
      action.setSubmitting(true);

      setTimeout(async () => {
        const fetched = await fetch('/api/info', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const { result } = await fetched.json();

        if (result && result.isDone) {
          NotificationManager.success(
            'Sent qrcode successful',
            'Send email',
            2000,
          );

          action.resetForm();
        } else {
          action.setStatus(result.message);

          NotificationManager.error(
            `Sent email fail ${result?.message}`,
            'Send Email',
            2000,
          );
        }

        action.setSubmitting(false);
        nProgress.done();
      }, 500);
    }
  });

  const errStyle = (field: string) => {
    if (formik.touched && formik.errors[field]) {
      return 'border-red-500';
    }

    return ''
  }

  return (
    <>
      <Head>
        <title>Dam Sen Park</title>
      </Head>
      <div className='flex'>
        <div className="w-full max-w-xl mx-auto mt-3">
          <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow ${errStyle('fullname')}`}
                type="text" placeholder="Jon Snow" name='fullname'
                value={formik.values.fullname} onChange={formik.handleChange} />
              {
                (formik.touched.fullname && formik.errors.fullname) && (
                  <p className="text-red-500 text-xs italic">Invalid fullname</p>
                )
              }
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow ${errStyle('email')}`}
                type="text" placeholder="JonKnow0thing@gmail.com" name='email'
                value={formik.values.email} onChange={formik.handleChange} />
              {
                (formik.touched.email && formik.errors.email) && (
                  <p className="text-red-500 text-xs italic">Invalid Email</p>
                )
              }
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
              <input className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow ${errStyle('phoneNumber')}`}
                type="text" placeholder="+84 1990 125" name='phoneNumber'
                value={formik.values.phoneNumber} onChange={formik.handleChange} />
              {
                (formik.touched.phoneNumber && formik.errors.phoneNumber) && (
                  <p className="text-red-500 text-xs italic">Invalid Phone Number</p>
                )
              }
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
              focus:outline-none focus:shadow mx-auto" type="submit" disabled={formik.isSubmitting}>
                Submit
              </button>
            </div>
            {
              formik.status && (
                <p className="text-red-500 text-xs italic mt-2">{formik.status}</p>
              )
            }
          </form>
          {/* <p className="text-center text-gray-500 text-xs">&copy;2020 Acme Corp. All rights reserved.</p> */}
        </div>
      </div>
    </>
  );
};

export default FormPage;