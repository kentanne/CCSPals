export const formatStudentId = (input: string): string => {
  // Remove all non-alphanumeric characters and convert to uppercase
  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
};

export const formatEmail = (input: string): string => {
  return input.trim().toLowerCase();
};

export const maskPassword = (password: string): string => {
  return '•'.repeat(password.length);
};

export const formatRoleDisplay = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: 'Administrator',
    mentor: 'Mentor',
    learner: 'Learner',
    user: 'User'
  };
  
  return roleMap[role.toLowerCase()] || role;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};