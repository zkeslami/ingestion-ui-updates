import React, { useState } from 'react';
import { CreateIndexForm, Index } from '../types';
import { mockFolders, sampleFieldDefinitions } from '../data/mockData';
import Header from '../components/Header';
import FieldDefinitions from '../components/FieldDefinitions';
import OntologyAttachment from '../components/OntologyAttachment';
import DataFreshnessIndicator from '../components/DataFreshnessIndicator';
import './CreateIndex.css';

interface CreateIndexProps {
  editingIndex?: Index;
  onCancel: () => void;
  onSave: (form: CreateIndexForm) => void;
}

const CreateIndex: React.FC<CreateIndexProps> = ({ editingIndex, onCancel, onSave }) => {
  const [form, setForm] = useState<CreateIndexForm>({
    name: editingIndex?.name || '',
    description: editingIndex?.description || '',
    folder: editingIndex?.folder || '',
    dataSource: editingIndex ? 'storage-bucket' : '',
    ingestionType: 'advanced',
    enableSchedule: false,
    scheduleFrequency: 'daily',
    fieldDefinitions: editingIndex?.fieldDefinitions || [],
    ontology: editingIndex?.ontology,
    freshnessConfig: editingIndex?.freshnessConfig || {
      type: 'persistent',
      refreshCadence: 'daily',
    },
  });

  const [showDataSourceSettings, setShowDataSourceSettings] = useState(!!editingIndex);

  const updateForm = (updates: Partial<CreateIndexForm>) => {
    setForm({ ...form, ...updates });
  };

  const handleDataSourceChange = (source: 'storage-bucket' | 'connector') => {
    updateForm({ dataSource: source });
    setShowDataSourceSettings(true);
  };

  const handleSave = () => {
    onSave(form);
  };

  const isFormValid = form.name && form.folder && form.dataSource;

  const loadSampleFields = () => {
    updateForm({ fieldDefinitions: sampleFieldDefinitions });
  };

  return (
    <div className="create-index-page">
      <Header
        title={editingIndex ? 'Edit Index' : 'Create Index'}
        subtitle="Create Context Grounding indexes which can be used to ground LLM calls in your business data. Once created, you can monitor when the indexes have been synced with the latest data, or queried by various products like agents."
        breadcrumbs={[
          { label: 'Context Grounding Indexes', href: '#' },
          { label: editingIndex ? 'Edit Index' : 'Create Index' },
        ]}
      />

      <p className="documentation-link">
        <a href="#docs">View documentation</a>
      </p>

      <div className="form-layout">
        <div className="form-main">
          <section className="form-section">
            <h2 className="section-header">General Details</h2>

            <div className="field-group">
              <label htmlFor="indexName">Index Name *</label>
              <input
                id="indexName"
                type="text"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                placeholder="Enter index name"
              />
            </div>

            <div className="field-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="Describe the purpose of this index..."
                rows={3}
              />
              <span className="char-count">{form.description.length}/1024</span>
            </div>

            <div className="field-group">
              <label htmlFor="folder">Folder *</label>
              <select
                id="folder"
                value={form.folder}
                onChange={(e) => updateForm({ folder: e.target.value })}
              >
                <option value="">Select a folder...</option>
                {mockFolders.map((folder) => (
                  <option key={folder} value={folder}>
                    {folder}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-header">Data Settings</h2>

            <div className="field-group">
              <label>Data Source *</label>
              <div className="radio-options">
                <label className="radio-wrapper">
                  <input
                    type="radio"
                    name="dataSource"
                    checked={form.dataSource === 'storage-bucket'}
                    onChange={() => handleDataSourceChange('storage-bucket')}
                  />
                  <div className="radio-content">
                    <span className="radio-label">Storage Bucket</span>
                  </div>
                </label>

                <label className="radio-wrapper">
                  <input
                    type="radio"
                    name="dataSource"
                    checked={form.dataSource === 'connector'}
                    onChange={() => handleDataSourceChange('connector')}
                  />
                  <div className="radio-content">
                    <span className="radio-label">Connector</span>
                  </div>
                </label>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-header">Schedule Ingestion</h2>
            <p className="section-description">
              <span className="info-icon">ℹ</span>
              Schedule automatic ingestion at regular intervals. Without a schedule, ingestion must be triggered manually.
            </p>

            <div className="toggle-row">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={form.enableSchedule}
                  onChange={(e) => updateForm({ enableSchedule: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
              <span>Enable Schedule</span>
            </div>

            {form.enableSchedule && (
              <div className="field-group schedule-options">
                <label>Frequency</label>
                <select
                  value={form.scheduleFrequency}
                  onChange={(e) => updateForm({ scheduleFrequency: e.target.value })}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </section>

          {/* New Data Source Settings Panel */}
          {showDataSourceSettings && (
            <section className="form-section data-source-settings">
              <h2 className="section-header">
                Data Source Settings
                <span className="new-badge">New</span>
              </h2>
              <p className="section-description">
                Configure field-level metadata, dictionaries, and data freshness to improve retrieval precision and query accuracy.
              </p>

              <div className="settings-panels">
                <FieldDefinitions
                  fields={form.fieldDefinitions}
                  onFieldsChange={(fields) => updateForm({ fieldDefinitions: fields })}
                />

                {form.fieldDefinitions.length === 0 && (
                  <div className="info-box warning">
                    <span className="info-box-icon">⚠</span>
                    <div>
                      <strong>Improve accuracy by adding field definitions</strong>
                      <p>
                        Define field-level metadata to help retrieval algorithms filter and rank more intelligently.
                      </p>
                      <button className="btn btn-text" onClick={loadSampleFields}>
                        Load sample fields
                      </button>
                    </div>
                  </div>
                )}

                <OntologyAttachment
                  ontology={form.ontology}
                  onOntologyChange={(ontology) => updateForm({ ontology })}
                />

                <DataFreshnessIndicator
                  config={form.freshnessConfig}
                  onConfigChange={(config) => updateForm({ freshnessConfig: config })}
                />
              </div>
            </section>
          )}
        </div>

        <div className="form-sidebar">
          <section className="form-section">
            <h2 className="section-header">Additional Settings</h2>

            <div className="field-group">
              <label>Ingestion *</label>
              <div className="radio-options vertical">
                <label className="radio-wrapper">
                  <input
                    type="radio"
                    name="ingestionType"
                    checked={form.ingestionType === 'basic'}
                    onChange={() => updateForm({ ingestionType: 'basic' })}
                  />
                  <div className="radio-content">
                    <span className="radio-label">Basic</span>
                    <span className="radio-description">
                      Best for documents with only text. Free of charge.
                    </span>
                  </div>
                </label>

                <label className="radio-wrapper selected">
                  <input
                    type="radio"
                    name="ingestionType"
                    checked={form.ingestionType === 'advanced'}
                    onChange={() => updateForm({ ingestionType: 'advanced' })}
                  />
                  <div className="radio-content">
                    <span className="radio-label">Advanced (Recommended)</span>
                    <span className="radio-description">
                      Best for documents which contain text, images, tables or graphs. Costs Platform Units.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-header">File Upload</h2>
            <p className="section-description">
              <span className="info-icon">ℹ</span>
              Files will be uploaded directly to the storage bucket selected. You can upload files both when creating a new index or when editing an existing index to add new documents for ingestion.
            </p>

            <div className="file-upload-area">
              {form.dataSource === 'storage-bucket' ? (
                <div className="upload-dropzone">
                  <p>Drag & drop files here or click to browse</p>
                  <button className="btn btn-secondary">Browse Files</button>
                </div>
              ) : (
                <p className="upload-disabled">
                  File upload will be available once you select a storage bucket as your data source.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-text" onClick={() => setForm({
          name: '',
          description: '',
          folder: '',
          dataSource: '',
          ingestionType: 'advanced',
          enableSchedule: false,
          fieldDefinitions: [],
          freshnessConfig: { type: 'persistent', refreshCadence: 'daily' },
        })}>
          Reset
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!isFormValid}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateIndex;
