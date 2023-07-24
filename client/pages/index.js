import React, { useEffect, useState } from 'react';
import WrongNetworkMessage from '../components/WrongNetworkMessage';
import ConnectWalletButton from '../components/ConnectWalletButton';
import TodoList from '../components/TodoList';
import { TaskContractAddress } from '../config.js';
import TaskAbi from '../../backend/build/contracts/TaskContract.json';
import NameForm from '../components/NameForm'; // Import the NameForm component
const ethers = require("ethers");

export default function Home() {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tasksCount, setTasksCount] = useState(0);
  const [userName, setUserName] = useState('');

  

  useEffect(() => {
    // Retrieve the user's name from localStorage based on their Ethereum address
    const storedUserName = typeof window !== 'undefined' && localStorage.getItem(currentAccount);
    setUserName(storedUserName || '');

     getAllTasks();
  }, [currentAccount, userName]);

  useEffect(() => {
    connectWallet();
    getAllTasks();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Metamask not detected');
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log('connected to chain:', chainId);

      const sepoliaChainId = '0xaa36a7';
      if (chainId !== sepoliaChainId) {
        alert('you are not connected to the sepolia testnet!');
        setCorrectNetwork(false);
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log('Found account', accounts[0]);
      setIsUserLoggedIn(true);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
 
        let allTasks = await TaskContract.getMyTask();
        console.log(allTasks)
        setTasks(allTasks);
      } else {
        console.log("Ethereum object down not exist.")
      }
    } catch (error) {
      console.log(error)
    }
  };

  const addTask = async (e) => {
    e.preventDefault(); // Avoid refresh

    let task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        TaskContract.addTask(task.taskText, task.isDeleted)
          .then((tx) => {
            console.log('Transaction sent:', tx.hash);
            tx.wait().then(() => {
              console.log('Transaction confirmed:', tx.hash);
              setTasks([...tasks, task]);
              console.log('Added task');
              //window.location.reload();
              getAllTasks();
            });
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        console.log('ethereum object does not exist!');
      }
    } catch (error) {
      console.log(error);
    }
    setInput('')
  };

  const deleteTask = (key) => async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const TaskContract = new ethers.Contract(
        TaskContractAddress,
        TaskAbi.abi,
        signer
      );
      const deleteTaskTx = await TaskContract.deleteTask(key, true);
      console.log("successfully deleted : ✨", deleteTaskTx);

      // Update the tasks state to remove the deleted task
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== key));
    } else {
      console.log('ethereum object does not exist!');
    }
  } catch (error) {
    console.log(error);
  }
};


  const handleUserNameSubmit = (name) => {
    // Save the user's name to localStorage based on their Ethereum address
    localStorage.setItem(currentAccount, name);
    setUserName(name);
  };

  return (
    <div className='bg-[#000000] h-screen w-screen flex justify-center py-6'>
      {!isUserLoggedIn ? (
        <ConnectWalletButton connectWallet={connectWallet} />
      ) : correctNetwork && !userName ? (
        <NameForm handleUserNameSubmit={handleUserNameSubmit} />
      ) : correctNetwork ? (
        <TodoList
          tasks={tasks}
          input={input}
          setInput={setInput}
          addTask={addTask}
          deleteTask={deleteTask}
          userName={userName}
        />
      ) : (
        <WrongNetworkMessage />
      )}
    </div>
  );
}
