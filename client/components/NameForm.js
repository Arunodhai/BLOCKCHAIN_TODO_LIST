import React, { useState } from 'react';

const NameForm = ({ handleUserNameSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUserNameSubmit(name); // Pass the entered name to handleUserNameSubmit function
  };

  return (
    <div className='w-[70%] bg-[#fca311] py-4 px-9 rounded-[30px]'>
      <h2 className='text-4xl font-bold text-black pb-8'>Welcome to the App!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          className='rounded-[10px] w-full p-[10px] border-none outline-none bg-[#000000] text-white mb-[10px]'
          placeholder='Enter your name...'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type='submit'
          className='rounded-[10px] w-full p-[10px] bg-[#000000] text-white font-semibold'
        >
          Enter
        </button>
      </form>
    </div>
  );
};

export default NameForm;
