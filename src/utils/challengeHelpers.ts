export const getSpecializationIcon = (specialization: string) => {
  switch (specialization) {
    case 'programming': return '💻';
    case 'mathematics': return '📊';
    case 'science': return '🔬';
    case 'language': return '📝';
    case 'business': return '💼';
    case 'design': return '🎨';
    case 'data-science': return '📈';
    case 'cybersecurity': return '🔒';
    default: return '🎯';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return '#4CAF50';
    case 'rejected': return '#F44336';
    case 'pending': return '#FF9800';
    default: return '#666';
  }
};

export const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'pdf': return '📄';
    case 'document': return '📝';
    case 'python': return '🐍';
    case 'zip': return '📦';
    case 'image': return '🖼️';
    case 'csv': return '📊';
    default: return '📎';
  }
};

export const formatSpecialization = (spec: string) => {
  return spec.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};