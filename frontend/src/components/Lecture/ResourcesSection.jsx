import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './ResourcesSection.css';

const ResourcesSection = ({ resources: initialResources, lectureId, isAdmin }) => {
  const [resources, setResources] = useState(initialResources);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const [newResource, setNewResource] = useState({ title: '', description: '' });

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', newResource.title);
    formData.append('description', newResource.description);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/v1/resources/${lectureId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResources([data.resource, ...resources]);
      setNewResource({ title: '', description: '' });
      fileInputRef.current.value = '';
      toast.success('Resource uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading resource');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      await axios.delete(`/api/v1/resources/${resourceId}`);
      setResources(resources.filter(resource => resource._id !== resourceId));
      toast.success('Resource deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting resource');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="resources-section">
      {isAdmin && (
        <form className="resource-form" onSubmit={handleFileUpload}>
          <input
            type="text"
            placeholder="Resource Title"
            value={newResource.title}
            onChange={(e) => setNewResource({...newResource, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Resource Description"
            value={newResource.description}
            onChange={(e) => setNewResource({...newResource, description: e.target.value})}
            required
          />
          <input
            type="file"
            ref={fileInputRef}
            className="file-input"
            required
          />
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </form>
      )}

      <div className="resources-list">
        {resources.length === 0 ? (
          <p className="no-resources">No resources available for this lecture.</p>
        ) : (
          resources.map(resource => (
            <div key={resource._id} className="resource-card">
              <div className="resource-info">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <div className="resource-meta">
                  <span className="file-size">
                    {formatFileSize(resource.size)}
                  </span>
                  <span className="file-type">
                    {resource.fileType}
                  </span>
                </div>
              </div>
              <div className="resource-actions">
                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-button"
                >
                  Download
                </a>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteResource(resource._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResourcesSection; 