import React, { useState } from 'react';
import { OntologyAttachment, DictionaryTerm, EntityRelationship } from '../types';
import { ontologyTemplates } from '../data/mockData';
import './OntologyAttachment.css';

interface OntologyAttachmentProps {
  ontology?: OntologyAttachment;
  onOntologyChange: (ontology: OntologyAttachment | undefined) => void;
}

const OntologyAttachmentComponent: React.FC<OntologyAttachmentProps> = ({
  ontology,
  onOntologyChange,
}) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'inline' | 'template'>('existing');
  const [showTermForm, setShowTermForm] = useState(false);
  const [showRelationshipForm, setShowRelationshipForm] = useState(false);
  const [newTerm, setNewTerm] = useState<Partial<DictionaryTerm>>({
    term: '',
    synonyms: [],
    definition: '',
    relatedTerms: [],
  });
  const [newRelationship, setNewRelationship] = useState<Partial<EntityRelationship>>({
    sourceEntity: '',
    targetEntity: '',
    relationshipField: '',
    relationshipType: 'relates_to',
  });

  const createNewOntology = (type: 'existing' | 'inline' | 'template'): OntologyAttachment => ({
    id: Date.now().toString(),
    name: '',
    type,
    terms: [],
    relationships: [],
  });

  const updateOntology = (updates: Partial<OntologyAttachment>) => {
    if (!ontology) {
      onOntologyChange({ ...createNewOntology(activeTab), ...updates });
    } else {
      onOntologyChange({ ...ontology, ...updates });
    }
  };

  const addTerm = () => {
    if (newTerm.term && newTerm.definition) {
      const term: DictionaryTerm = {
        id: Date.now().toString(),
        term: newTerm.term || '',
        synonyms: newTerm.synonyms || [],
        definition: newTerm.definition || '',
        relatedTerms: newTerm.relatedTerms || [],
      };
      updateOntology({
        terms: [...(ontology?.terms || []), term],
      });
      setNewTerm({ term: '', synonyms: [], definition: '', relatedTerms: [] });
      setShowTermForm(false);
    }
  };

  const removeTerm = (termId: string) => {
    updateOntology({
      terms: (ontology?.terms || []).filter((t) => t.id !== termId),
    });
  };

  const addRelationship = () => {
    if (newRelationship.sourceEntity && newRelationship.targetEntity && newRelationship.relationshipField) {
      const relationship: EntityRelationship = {
        id: Date.now().toString(),
        sourceEntity: newRelationship.sourceEntity || '',
        targetEntity: newRelationship.targetEntity || '',
        relationshipField: newRelationship.relationshipField || '',
        relationshipType: newRelationship.relationshipType || 'relates_to',
      };
      updateOntology({
        relationships: [...(ontology?.relationships || []), relationship],
      });
      setNewRelationship({ sourceEntity: '', targetEntity: '', relationshipField: '', relationshipType: 'relates_to' });
      setShowRelationshipForm(false);
    }
  };

  const removeRelationship = (relId: string) => {
    updateOntology({
      relationships: (ontology?.relationships || []).filter((r) => r.id !== relId),
    });
  };

  const selectTemplate = (templateId: string) => {
    const template = ontologyTemplates.find((t) => t.id === templateId);
    if (template) {
      updateOntology({
        name: template.name,
        source: template.standard,
        type: 'template',
      });
    }
  };

  const clearOntology = () => {
    onOntologyChange(undefined);
  };

  return (
    <div className="ontology-attachment">
      <div className="ontology-header">
        <div className="ontology-title">
          <h3>Dictionary/Ontology Attachment</h3>
          {ontology && (
            <button className="btn-text clear-btn" onClick={clearOntology}>
              Clear
            </button>
          )}
        </div>
        <p className="ontology-description">
          Attach existing ontology artifacts or create inline dictionaries to improve query accuracy.
        </p>
      </div>

      <div className="ontology-tabs">
        <button
          className={`ontology-tab ${activeTab === 'existing' ? 'active' : ''}`}
          onClick={() => setActiveTab('existing')}
        >
          Existing Ontology
        </button>
        <button
          className={`ontology-tab ${activeTab === 'inline' ? 'active' : ''}`}
          onClick={() => setActiveTab('inline')}
        >
          Inline Dictionary
        </button>
        <button
          className={`ontology-tab ${activeTab === 'template' ? 'active' : ''}`}
          onClick={() => setActiveTab('template')}
        >
          Import Template
        </button>
      </div>

      <div className="ontology-content">
        {activeTab === 'existing' && (
          <div className="existing-ontology">
            <div className="field-group">
              <label>Select Ontology</label>
              <select
                value={ontology?.source || ''}
                onChange={(e) =>
                  updateOntology({
                    source: e.target.value,
                    name: e.target.value,
                    type: 'existing',
                  })
                }
              >
                <option value="">Select from Data Fabric or Ontology Definition...</option>
                <option value="healthcare-ontology">Healthcare Ontology v2.1</option>
                <option value="finance-ontology">Finance Ontology v1.3</option>
                <option value="manufacturing-ontology">Manufacturing Ontology v3.0</option>
              </select>
            </div>
            {ontology?.source && (
              <div className="selected-ontology-info">
                <div className="info-icon">✓</div>
                <div>
                  <strong>{ontology.name || ontology.source}</strong>
                  <p>Ontology will be attached to this data source</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inline' && (
          <div className="inline-dictionary">
            <div className="dictionary-section">
              <div className="section-title">
                <h4>Dictionary Terms</h4>
                <span className="item-count">{ontology?.terms?.length || 0} terms</span>
              </div>

              {ontology?.terms && ontology.terms.length > 0 && (
                <div className="terms-list">
                  {ontology.terms.map((term) => (
                    <div key={term.id} className="term-item">
                      <div className="term-info">
                        <strong>{term.term}</strong>
                        {term.synonyms.length > 0 && (
                          <span className="synonyms">
                            ({term.synonyms.join(', ')})
                          </span>
                        )}
                        <p>{term.definition}</p>
                        {term.relatedTerms.length > 0 && (
                          <div className="related-terms">
                            Related: {term.relatedTerms.join(', ')}
                          </div>
                        )}
                      </div>
                      <button
                        className="btn-icon"
                        onClick={() => removeTerm(term.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {showTermForm ? (
                <div className="term-form">
                  <div className="field-row">
                    <div className="field-group">
                      <label>Term *</label>
                      <input
                        type="text"
                        value={newTerm.term}
                        onChange={(e) =>
                          setNewTerm({ ...newTerm, term: e.target.value })
                        }
                        placeholder="e.g., Invoice"
                      />
                    </div>
                    <div className="field-group">
                      <label>Synonyms</label>
                      <input
                        type="text"
                        value={newTerm.synonyms?.join(', ') || ''}
                        onChange={(e) =>
                          setNewTerm({
                            ...newTerm,
                            synonyms: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Comma-separated synonyms"
                      />
                    </div>
                  </div>
                  <div className="field-group">
                    <label>Definition *</label>
                    <textarea
                      value={newTerm.definition}
                      onChange={(e) =>
                        setNewTerm({ ...newTerm, definition: e.target.value })
                      }
                      placeholder="Define what this term means in your business context..."
                      rows={2}
                    />
                  </div>
                  <div className="field-group">
                    <label>Related Terms</label>
                    <input
                      type="text"
                      value={newTerm.relatedTerms?.join(', ') || ''}
                      onChange={(e) =>
                        setNewTerm({
                          ...newTerm,
                          relatedTerms: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Comma-separated related terms"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowTermForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={addTerm}
                      disabled={!newTerm.term || !newTerm.definition}
                    >
                      Add Term
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-secondary add-btn"
                  onClick={() => setShowTermForm(true)}
                >
                  + Add Dictionary Term
                </button>
              )}
            </div>

            <div className="divider"></div>

            <div className="relationships-section">
              <div className="section-title">
                <h4>Entity Relationships</h4>
                <span className="item-count">{ontology?.relationships?.length || 0} relationships</span>
              </div>

              {ontology?.relationships && ontology.relationships.length > 0 && (
                <div className="relationships-list">
                  {ontology.relationships.map((rel) => (
                    <div key={rel.id} className="relationship-item">
                      <div className="relationship-info">
                        <span className="entity">{rel.sourceEntity}</span>
                        <span className="relationship-arrow">
                          —— {rel.relationshipType} via <code>{rel.relationshipField}</code> ——&gt;
                        </span>
                        <span className="entity">{rel.targetEntity}</span>
                      </div>
                      <button
                        className="btn-icon"
                        onClick={() => removeRelationship(rel.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {showRelationshipForm ? (
                <div className="relationship-form">
                  <div className="field-row three-col">
                    <div className="field-group">
                      <label>Source Entity *</label>
                      <input
                        type="text"
                        value={newRelationship.sourceEntity}
                        onChange={(e) =>
                          setNewRelationship({ ...newRelationship, sourceEntity: e.target.value })
                        }
                        placeholder="e.g., Invoice"
                      />
                    </div>
                    <div className="field-group">
                      <label>Target Entity *</label>
                      <input
                        type="text"
                        value={newRelationship.targetEntity}
                        onChange={(e) =>
                          setNewRelationship({ ...newRelationship, targetEntity: e.target.value })
                        }
                        placeholder="e.g., Payment"
                      />
                    </div>
                    <div className="field-group">
                      <label>Via Field *</label>
                      <input
                        type="text"
                        value={newRelationship.relationshipField}
                        onChange={(e) =>
                          setNewRelationship({ ...newRelationship, relationshipField: e.target.value })
                        }
                        placeholder="e.g., payment_id"
                      />
                    </div>
                  </div>
                  <div className="field-group">
                    <label>Relationship Type</label>
                    <select
                      value={newRelationship.relationshipType}
                      onChange={(e) =>
                        setNewRelationship({ ...newRelationship, relationshipType: e.target.value })
                      }
                    >
                      <option value="relates_to">relates to</option>
                      <option value="has_many">has many</option>
                      <option value="belongs_to">belongs to</option>
                      <option value="references">references</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowRelationshipForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={addRelationship}
                      disabled={
                        !newRelationship.sourceEntity ||
                        !newRelationship.targetEntity ||
                        !newRelationship.relationshipField
                      }
                    >
                      Add Relationship
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-secondary add-btn"
                  onClick={() => setShowRelationshipForm(true)}
                >
                  + Add Entity Relationship
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'template' && (
          <div className="template-import">
            <p className="template-description">
              Import from common standards as templates to quickly bootstrap your ontology.
            </p>
            <div className="templates-grid">
              {ontologyTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`template-card ${ontology?.source === template.standard ? 'selected' : ''}`}
                  onClick={() => selectTemplate(template.id)}
                >
                  <div className="template-header">
                    <h4>{template.name}</h4>
                    {ontology?.source === template.standard && (
                      <span className="selected-badge">Selected</span>
                    )}
                  </div>
                  <p className="template-standard">{template.standard}</p>
                  <p className="template-desc">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OntologyAttachmentComponent;
