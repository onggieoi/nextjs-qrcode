import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import nProgress from 'nprogress';

import * as Secret from 'utils/secret';
import { getLocalStorge, setLocalStorge } from 'utils/localStorage';

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Auth = ({ children }) => {
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    const token = getLocalStorge('token');

    if (token === Secret.token) setAuth(true);
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, actions) => {
      nProgress.start();
      actions.setSubmitting(true);

      setTimeout(() => {
        if (values.username === Secret.admin.username
          && values.password === Secret.admin.password) {
          setLocalStorge('token', 'abcd');
          setAuth(true);
        } else {
          actions.setStatus('Invalid username or password');
        }
      }, 500);

      nProgress.done();
      actions.setSubmitting(false)
    }
  })

  const errStyle = (field: string) => {
    if (formik.touched && formik.errors[field]) {
      return 'border-red-500';
    }

    return ''
  }

  if (!isAuth) {
    return (
      <>
        <Head>
          <title>Login</title>
        </Head>

        <div className='mx-auto my-5 max-w-xl rounded-md shadow-md p-5'>
          <div className='text-lg font-bold mb-3 text-center'>
            Login
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow ${errStyle('username')}`}
                type="text" placeholder="Jon Snow" name='username'
                value={formik.values.username} onChange={formik.handleChange} />
              {
                (formik.touched.username && formik.errors.username) && (
                  <p className="text-red-500 text-xs italic mt-2">Invalid username</p>
                )
              }
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 
                leading-tight focus:outline-none focus:shadow ${errStyle('password')}`}
                type="password" name='password'
                value={formik.values.password} onChange={formik.handleChange} />
              {
                (formik.touched.password && formik.errors.password) && (
                  <p className="text-red-500 text-xs italic mt-2">Invalid password</p>
                )
              }
            </div>

            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
              focus:outline-none focus:shadow mx-auto" type="submit" disabled={formik.isSubmitting}>
                Login
              </button>
            </div>
            {
              formik.status && (
                <p className="text-red-500 text-xs italic">{formik.status}</p>
              )
            }
          </form>
        </div>
      </>
    );
  }

  return children;

};

export default Auth;