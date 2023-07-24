import React from 'react';
import Navbar from './Navbar';
import { IoMdAddCircle } from 'react-icons/io';
import Task from './Task';

const TodoList = ({ tasks, input, setInput, addTask, deleteTask , userName }) => (
  <div className='w-[70%] bg-[#fca311] py-4 px-9 rounded-[30px] overflow-y-hidden'>
    <Navbar />
    <h2 className='text-4xl font-bold text-black pb-8'>
      What&apos;s up, {userName}!
    </h2>
    <div className='py-3 text-[#000000]'>TODAY&apos;S TASKS</div>
    <form className='flex items-center justify-center'>
      <input
        className='rounded-[10px] w-full p-[10px] border-none outline-none bg-[#000000] text-white mb-[10px]'
        placeholder='Add a task for today...'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <IoMdAddCircle
        onClick={addTask}
        className='text-[#000000] text-[50px] cursor-pointer ml-[20px] mb-[10px]'
      />
    </form>
    <ul>
  {/* Loop through all tasks here using the Task component */}
  {tasks.map(item => (
    <Task
      key={item.id}
      taskText={item.tasktext}
      onClick={deleteTask(item.id)}
      //onClick delete
    />
  ))}
</ul>
  </div>
);

export default TodoList;
