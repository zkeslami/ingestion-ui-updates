import React, { useState } from 'react';
import { Index, CreateIndexForm } from './types';
import IndexList from './pages/IndexList';
import CreateIndex from './pages/CreateIndex';
import './styles/global.css';

type View = 'list' | 'create' | 'edit';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [editingIndex, setEditingIndex] = useState<Index | undefined>();

  const handleCreateIndex = () => {
    setEditingIndex(undefined);
    setCurrentView('create');
  };

  const handleEditIndex = (index: Index) => {
    setEditingIndex(index);
    setCurrentView('edit');
  };

  const handleCancel = () => {
    setEditingIndex(undefined);
    setCurrentView('list');
  };

  const handleSave = (form: CreateIndexForm) => {
    console.log('Saving form:', form);
    // In a real app, this would save to the backend
    setEditingIndex(undefined);
    setCurrentView('list');
  };

  return (
    <div className="app">
      {currentView === 'list' && (
        <IndexList
          onCreateIndex={handleCreateIndex}
          onEditIndex={handleEditIndex}
        />
      )}
      {(currentView === 'create' || currentView === 'edit') && (
        <CreateIndex
          editingIndex={editingIndex}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default App;
