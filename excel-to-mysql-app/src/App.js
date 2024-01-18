import React from 'react';
import './App.css';
import FileUpload from './FileUpload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Excel to MySQL App</h1>
        <FileUpload />
      </header>
    </div>
  );
}

export default App;
