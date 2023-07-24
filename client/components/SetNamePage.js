import React from 'react';
import NameForm from './NameForm';

const SetNamePage = ({ onNameSubmit }) => {
  // Define a function to handle name submission
  const handleNameSubmit = (name) => {
    // Call the onNameSubmit function passed from the parent component with the user's name
    onNameSubmit(name);
  };

  return (
    <div>
      <h2>Set Your Name</h2>
      <NameForm onSubmit={handleNameSubmit} />
    </div>
  );
};

export default SetNamePage;
