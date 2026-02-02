import React from 'react';
import { FreshnessConfig } from '../types';
import './DataFreshnessIndicator.css';

interface DataFreshnessIndicatorProps {
  config: FreshnessConfig;
  onConfigChange: (config: FreshnessConfig) => void;
}

const refreshCadenceOptions = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'manual', label: 'Manual only' },
];

const DataFreshnessIndicator: React.FC<DataFreshnessIndicatorProps> = ({
  config,
  onConfigChange,
}) => {
  return (
    <div className="data-freshness">
      <div className="freshness-header">
        <h3>Data Freshness Indicator</h3>
        <p className="freshness-description">
          Configure how data synchronization and freshness is managed for this data source.
        </p>
      </div>

      <div className="freshness-type-selection">
        <label className="radio-wrapper">
          <input
            type="radio"
            name="freshnessType"
            checked={config.type === 'persistent'}
            onChange={() =>
              onConfigChange({
                ...config,
                type: 'persistent',
                isRealTime: false,
              })
            }
          />
          <div className="radio-content">
            <span className="radio-label">Persistent Source</span>
            <span className="radio-description">
              Data is cached and synced at regular intervals. Best for storage buckets and file uploads.
            </span>
          </div>
        </label>

        <label className="radio-wrapper">
          <input
            type="radio"
            name="freshnessType"
            checked={config.type === 'live'}
            onChange={() =>
              onConfigChange({
                ...config,
                type: 'live',
                isRealTime: true,
                lastSyncTimestamp: undefined,
                refreshCadence: undefined,
              })
            }
          />
          <div className="radio-content">
            <span className="radio-label">Live Source</span>
            <span className="radio-description">
              Real-time data with no caching. Best for SQL databases, Salesforce, and other live connectors.
            </span>
          </div>
        </label>
      </div>

      {config.type === 'persistent' && (
        <div className="persistent-settings">
          <div className="field-group">
            <label>Refresh Cadence</label>
            <select
              value={config.refreshCadence || 'daily'}
              onChange={(e) =>
                onConfigChange({ ...config, refreshCadence: e.target.value })
              }
            >
              {refreshCadenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {config.lastSyncTimestamp && (
            <div className="last-sync-info">
              <span className="sync-icon">↻</span>
              <span>Last synced: {config.lastSyncTimestamp}</span>
            </div>
          )}

          <div className="freshness-preview">
            <div className="preview-header">
              <span className="preview-icon persistent">●</span>
              <span>Persistent</span>
            </div>
            <p>Data will be synced {config.refreshCadence || 'daily'}</p>
          </div>
        </div>
      )}

      {config.type === 'live' && (
        <div className="live-settings">
          <div className="freshness-preview live">
            <div className="preview-header">
              <span className="preview-icon live">●</span>
              <span>Real-time</span>
            </div>
            <p>Data is queried directly from the source with no caching</p>
          </div>

          <div className="info-box">
            <span className="info-box-icon">ℹ</span>
            <div>
              <strong>Live data sources</strong>
              <p>
                Queries will be executed directly against the source system. Ensure the source has
                appropriate performance capacity for expected query volume.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFreshnessIndicator;
