import React, { useState } from 'react';
import { Index } from '../types';
import { mockIndexes, mockFolders } from '../data/mockData';
import Header from '../components/Header';
import './IndexList.css';

interface IndexListProps {
  onCreateIndex: () => void;
  onEditIndex: (index: Index) => void;
}

const IndexList: React.FC<IndexListProps> = ({ onCreateIndex, onEditIndex }) => {
  const [indexes] = useState<Index[]>(mockIndexes);
  const [searchTerm, setSearchTerm] = useState('');
  const [folderFilter, setFolderFilter] = useState('All');
  const [dataSourceFilter, setDataSourceFilter] = useState('All');
  const [scoreFilter, setScoreFilter] = useState('All');
  const [timeRange, setTimeRange] = useState('Last month');

  const filteredIndexes = indexes.filter((index) => {
    const matchesSearch = index.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = folderFilter === 'All' || index.folder === folderFilter;
    const matchesDataSource = dataSourceFilter === 'All' || index.dataSource === dataSourceFilter;
    return matchesSearch && matchesFolder && matchesDataSource;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  };

  const getStatusClass = (status: string) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="index-list-page">
      <Header
        title="Context Grounding Indexes"
        subtitle="Monitor the status of your indexes and their ingestion progress."
      />

      <p className="help-text">
        Need help getting started? Learn more about Context Grounding and how to create and manage indexes in our documentation.{' '}
        <a href="#docs">View documentation</a>
      </p>

      <div className="time-range-selector">
        <label>Time range:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option>Last month</option>
          <option>Last week</option>
          <option>Last 3 months</option>
          <option>Last year</option>
        </select>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Queries</h3>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {[1, 2, 1, 2, 8, 1, 1].map((height, i) => (
                <div
                  key={i}
                  className="bar"
                  style={{ height: `${height * 10}px` }}
                />
              ))}
            </div>
            <div className="chart-labels">
              <span>01/01</span>
              <span>01/07</span>
              <span>01/13</span>
              <span>01/19</span>
              <span>01/25</span>
              <span>01/31</span>
            </div>
          </div>
        </div>
        <div className="chart-card">
          <h3>Index Jobs</h3>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {[3, 0, 0, 6, 1].map((height, i) => (
                <div
                  key={i}
                  className="bar"
                  style={{ height: `${height * 10}px` }}
                />
              ))}
            </div>
            <div className="chart-labels">
              <span>01/05</span>
              <span>01/15</span>
              <span>01/25</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quota-banner">
        <div className="quota-info">
          <span className="quota-icon">ℹ</span>
          <div>
            <p><strong>Currently using 8 out of 100 indexes.</strong></p>
            <p>Quota usage: 8%</p>
            <p className="storage-info">Total storage used by all indexes: 2.21 MB</p>
          </div>
        </div>
        <span className="quota-remaining">92 indexes remaining</span>
        <button className="close-btn">×</button>
      </div>

      <div className="table-controls">
        <div className="search-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label>Folder:</label>
              <select value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)}>
                <option>All</option>
                {mockFolders.map((folder) => (
                  <option key={folder}>{folder}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Data Source:</label>
              <select value={dataSourceFilter} onChange={(e) => setDataSourceFilter(e.target.value)}>
                <option>All</option>
                <option>Storage Bucket</option>
                <option>Connector</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Score:</label>
              <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)}>
                <option>All</option>
                <option>High (90+)</option>
                <option>Medium (70-89)</option>
                <option>Low (&lt;70)</option>
              </select>
            </div>
          </div>
        </div>

        <button className="btn btn-primary create-btn" onClick={onCreateIndex}>
          + Create Index
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Index Name ↕</th>
              <th>Folder ↕</th>
              <th>Data Source</th>
              <th>Description</th>
              <th>Score ↕</th>
              <th>Storage Size ↕</th>
              <th>Ingestion status ↕</th>
              <th>Last Sync ↕</th>
              <th>Last Queried ↕</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredIndexes.map((index) => (
              <tr key={index.id} onClick={() => onEditIndex(index)} style={{ cursor: 'pointer' }}>
                <td>
                  <button className="index-name-link" onClick={(e) => { e.stopPropagation(); onEditIndex(index); }}>
                    {index.name}
                  </button>
                </td>
                <td>{index.folder}</td>
                <td>{index.dataSource}</td>
                <td className="description-cell">{index.description}</td>
                <td>
                  <div className="score-indicator">
                    <span className={`score-dot ${getScoreColor(index.score)}`}></span>
                    {index.score}/100
                  </div>
                </td>
                <td>{index.storageSize}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(index.ingestionStatus)}`}>
                    {index.ingestionStatus === 'Successful' && '✓ '}
                    {index.ingestionStatus}
                  </span>
                </td>
                <td>{index.lastSync}</td>
                <td>{index.lastQueried}</td>
                <td>
                  <button className="btn-icon more-btn" onClick={(e) => e.stopPropagation()}>⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span className="showing-info">1 - 7 / 7</span>
        <div className="pagination">
          <span>Page 1 / 1</span>
        </div>
        <div className="items-per-page">
          <span>Items</span>
          <select defaultValue="10">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default IndexList;
