import React, { useState } from 'react';
import { Database, FileText, Settings, Layout } from 'lucide-react';
import CombinedInputForm from './components/CombinedInputForm';
import './index.css';

function App() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Scribe Data Importer
          </h1>
          <p className="text-text-secondary text-lg">
            Manage your user guides and questions database seamlessly.
          </p>
        </header>

        {/* Content */}
        <main className="fade-in">
          <CombinedInputForm />
        </main>
      </div>
    </div>
  );
}

export default App;
