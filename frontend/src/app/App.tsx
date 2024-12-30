import React from 'react';
import { JobList } from './components/JobList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Tracker</h1>
      </header>
      <main>
        <JobList />
      </main>
    </div>
  );
}

export default App;
