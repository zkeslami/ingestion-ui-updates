import React, { useState } from 'react';
import { FieldDefinition } from '../types';
import './FieldDefinitions.css';

interface FieldDefinitionsProps {
  fields: FieldDefinition[];
  onFieldsChange: (fields: FieldDefinition[]) => void;
}

const dataTypes = ['string', 'number', 'date', 'boolean', 'array', 'object'];

const FieldDefinitions: React.FC<FieldDefinitionsProps> = ({ fields, onFieldsChange }) => {
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);

  const addField = () => {
    const newField: FieldDefinition = {
      id: Date.now().toString(),
      fieldName: '',
      displayName: '',
      dataType: 'string',
      description: '',
      exampleValues: [],
      isQueryable: true,
      isFilterable: false,
      isRequired: false,
      isPII: false,
    };
    onFieldsChange([...fields, newField]);
    setExpandedFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FieldDefinition>) => {
    onFieldsChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (id: string) => {
    onFieldsChange(fields.filter((field) => field.id !== id));
    if (expandedFieldId === id) {
      setExpandedFieldId(null);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedFieldId(expandedFieldId === id ? null : id);
  };

  return (
    <div className="field-definitions">
      <div className="field-definitions-header">
        <div className="field-definitions-title">
          <h3>Field Definitions</h3>
          <span className="field-count">{fields.length} fields</span>
        </div>
        <p className="field-definitions-description">
          Define which fields are queryable/filterable. Mark required fields for retrieval vs. optional enrichment.
        </p>
      </div>

      <div className="fields-list">
        {fields.map((field) => (
          <div key={field.id} className="field-item">
            <div
              className="field-item-header"
              onClick={() => toggleExpanded(field.id)}
            >
              <div className="field-item-info">
                <span className="expand-icon">
                  {expandedFieldId === field.id ? '▼' : '▶'}
                </span>
                <span className="field-name">
                  {field.displayName || field.fieldName || 'New Field'}
                </span>
                <span className="field-type-badge">{field.dataType}</span>
                {field.isRequired && (
                  <span className="tag required">Required</span>
                )}
                {field.isPII && <span className="tag pii">PII</span>}
              </div>
              <div className="field-item-actions">
                <button
                  className="btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeField(field.id);
                  }}
                  title="Remove field"
                >
                  ×
                </button>
              </div>
            </div>

            {expandedFieldId === field.id && (
              <div className="field-item-details">
                <div className="field-row">
                  <div className="field-group">
                    <label>Field Name *</label>
                    <input
                      type="text"
                      value={field.fieldName}
                      onChange={(e) =>
                        updateField(field.id, { fieldName: e.target.value })
                      }
                      placeholder="e.g., patient_id"
                    />
                  </div>
                  <div className="field-group">
                    <label>Display Name *</label>
                    <input
                      type="text"
                      value={field.displayName}
                      onChange={(e) =>
                        updateField(field.id, { displayName: e.target.value })
                      }
                      placeholder="e.g., Patient ID"
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label>Data Type</label>
                    <select
                      value={field.dataType}
                      onChange={(e) =>
                        updateField(field.id, {
                          dataType: e.target.value as FieldDefinition['dataType'],
                        })
                      }
                    >
                      {dataTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group">
                    <label>Example Values</label>
                    <input
                      type="text"
                      value={field.exampleValues.join(', ')}
                      onChange={(e) =>
                        updateField(field.id, {
                          exampleValues: e.target.value
                            .split(',')
                            .map((v) => v.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Comma-separated values"
                    />
                  </div>
                </div>

                <div className="field-group full-width">
                  <label>Description</label>
                  <textarea
                    value={field.description}
                    onChange={(e) =>
                      updateField(field.id, { description: e.target.value })
                    }
                    placeholder="Describe what this field represents..."
                    rows={2}
                  />
                </div>

                <div className="field-options">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={field.isQueryable}
                      onChange={(e) =>
                        updateField(field.id, { isQueryable: e.target.checked })
                      }
                    />
                    <span>Queryable</span>
                  </label>
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={field.isFilterable}
                      onChange={(e) =>
                        updateField(field.id, { isFilterable: e.target.checked })
                      }
                    />
                    <span>Filterable</span>
                  </label>
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={field.isRequired}
                      onChange={(e) =>
                        updateField(field.id, { isRequired: e.target.checked })
                      }
                    />
                    <span>Required for retrieval</span>
                  </label>
                  <label className="checkbox-wrapper pii-checkbox">
                    <input
                      type="checkbox"
                      checked={field.isPII}
                      onChange={(e) =>
                        updateField(field.id, { isPII: e.target.checked })
                      }
                    />
                    <span>Sensitive/PII field</span>
                    <span className="pii-hint">(excluded from agent context by default)</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="btn btn-secondary add-field-btn" onClick={addField}>
        + Add Field Definition
      </button>
    </div>
  );
};

export default FieldDefinitions;
