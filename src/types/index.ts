export interface Index {
  id: string;
  name: string;
  folder: string;
  dataSource: string;
  description: string;
  score: number;
  storageSize: string;
  ingestionStatus: 'Successful' | 'In Progress' | 'Failed' | 'Pending';
  lastSync: string;
  lastQueried: string;
  fieldDefinitions?: FieldDefinition[];
  ontology?: OntologyAttachment;
  freshnessConfig?: FreshnessConfig;
}

export interface FieldDefinition {
  id: string;
  fieldName: string;
  displayName: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  description: string;
  exampleValues: string[];
  isQueryable: boolean;
  isFilterable: boolean;
  isRequired: boolean;
  isPII: boolean;
}

export interface OntologyAttachment {
  id: string;
  name: string;
  type: 'existing' | 'inline' | 'template';
  source?: string;
  terms?: DictionaryTerm[];
  relationships?: EntityRelationship[];
}

export interface DictionaryTerm {
  id: string;
  term: string;
  synonyms: string[];
  definition: string;
  relatedTerms: string[];
}

export interface EntityRelationship {
  id: string;
  sourceEntity: string;
  targetEntity: string;
  relationshipField: string;
  relationshipType: string;
}

export interface FreshnessConfig {
  type: 'persistent' | 'live';
  lastSyncTimestamp?: string;
  refreshCadence?: string;
  isRealTime?: boolean;
}

export interface CreateIndexForm {
  name: string;
  description: string;
  folder: string;
  dataSource: 'storage-bucket' | 'connector' | '';
  ingestionType: 'basic' | 'advanced';
  enableSchedule: boolean;
  scheduleFrequency?: string;
  fieldDefinitions: FieldDefinition[];
  ontology?: OntologyAttachment;
  freshnessConfig: FreshnessConfig;
}

export type DataSourceType = 'ECS Index' | 'Data Fabric' | 'IXP Project' | 'File Upload' | 'Connector';

export interface OntologyTemplate {
  id: string;
  name: string;
  standard: string;
  description: string;
}
