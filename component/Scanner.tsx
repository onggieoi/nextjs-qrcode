import React, { useState } from 'react';
import nProgress from 'nprogress';
import QrReader from 'react-qr-reader'
import { NotificationManager } from 'react-notifications';

const Scanner = () => {
  const [isOpen, setOpen] = useState(false);
  const [id, setId] = useState('');

  const handleOpenCamera = () => {
    setOpen(!isOpen);
  }

  const handleActive = () => {
    nProgress.start();

    setTimeout(async () => {
      const fetched = await fetch('/api/active', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const { result } = await fetched.json();

      if (result && result.isDone) {
        NotificationManager.success(
          result.message,
          'Active successful',
          2000,
        );
      } else {
        NotificationManager.error(
          result.message,
          'Active Failed',
          2000,
        );
      }

      setId('');
      nProgress.done();
    }, 500);
  }

  return (
    <>
      <div className='mx-auto my-5 max-w-xl'>
        <div className='flex'>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
            focus:outline-none focus:shadow mx-auto" type="button" onClick={handleOpenCamera}>
            {isOpen ? 'Close' : 'Open'} Scanner
          </button>
        </div>
        {id ? (
          <div className='my-3'>
            <p className='text-center'>{id}</p>
            <div className='flex'>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded 
                    focus:outline-none focus:shadow mx-auto" type="button" onClick={handleActive}>
                active
              </button>
            </div>
          </div>
        ) : null}
        <div className='flex'>
          {isOpen ? (
            <div className='mx-auto my-5'>
              <QrReader
                style={{
                  height: 240,
                  width: 320,
                }}
                onScan={(result) => {
                  if (result) {
                    setId(result.toString());
                  }
                }}
                onError={err => console.log(err)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Scanner;
