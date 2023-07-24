// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TaskContract {
  event AddTask(address receipient, uint TaskId);
  event DeleteTask(uint TaskId, bool isDeleted);

  struct Task {
    uint id;
    string tasktext;
    bool isDeleted;
  }

  Task[] private tasks;
  mapping(uint256 => address) taskToOwner;

  function addTask(string memory taskText, bool isDeleted) external {

    uint taskId = tasks.length;
    tasks.push(Task(taskId, taskText, isDeleted));
    taskToOwner[taskId] = msg.sender;
    emit AddTask(msg.sender, taskId);
  }

  function getMyTask() external view returns(Task[] memory) {

    Task[] memory temporary = new Task[](tasks.length);
    uint counter = 0;

    for (uint i = 0; i < tasks.length; i++) {
      if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
        temporary[counter] = tasks[i];
        counter++;
      }
    }

    Task[] memory results = new Task[](counter);
    for (uint i = 0; i < counter; i++) {
      results[i] = temporary[i];
    }

    return results;
  }

  function deleteTask(uint taskId, bool isDeleted) external{
    if(taskToOwner[taskId]==msg.sender){
      tasks[taskId].isDeleted = isDeleted;
      emit DeleteTask(taskId,isDeleted);
    }
    
  }
}
