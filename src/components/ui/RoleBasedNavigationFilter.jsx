import React, { createContext, useContext, useEffect, useState } from 'react';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

const RoleBasedNavigationFilter = ({ children }) => {
  const [userRole, setUserRole] = useState('nurse_manager');
  const [permissions, setPermissions] = useState([]);

  // Role hierarchy and permissions mapping
  const rolePermissions = {
    chief_nursing_officer: [
      'patient-care-overview',
      'staff-performance-analytics',
      'clinical-quality-monitor',
      'resource-utilization-hub',
      'patient-safety-dashboard',
      'admin',
      'settings',
      'help'
    ],
    nurse_manager: [
      'patient-care-overview',
      'staff-performance-analytics',
      'clinical-quality-monitor',
      'patient-safety-dashboard',
      'settings',
      'help'
    ],
    quality_assurance_manager: [
      'clinical-quality-monitor',
      'patient-safety-dashboard',
      'patient-care-overview',
      'settings',
      'help'
    ],
    clinical_supervisor: [
      'patient-care-overview',
      'patient-safety-dashboard',
      'help'
    ],
    staff_nurse: [
      'patient-care-overview',
      'patient-safety-dashboard'
    ]
  };

  // Initialize role from localStorage or default
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole && rolePermissions?.[savedRole]) {
      setUserRole(savedRole);
    } else {
      // Default role assignment logic could be based on authentication
      setUserRole('nurse_manager');
    }
  }, []);

  // Update permissions when role changes
  useEffect(() => {
    setPermissions(rolePermissions?.[userRole] || []);
  }, [userRole]);

  const hasPermission = (route) => {
    // Remove leading slash and convert to permission format
    const permission = route?.replace('/', '')?.replace(/\//g, '-');
    return permissions?.includes(permission);
  };

  const filterNavigationItems = (items) => {
    return items?.filter(item => {
      if (item?.items) {
        // Filter group items
        const filteredItems = item?.items?.filter(subItem => 
          hasPermission(subItem?.path)
        );
        return filteredItems?.length > 0;
      }
      return hasPermission(item?.path);
    })?.map(item => {
      if (item?.items) {
        return {
          ...item,
          items: item?.items?.filter(subItem => hasPermission(subItem?.path))
        };
      }
      return item;
    });
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      chief_nursing_officer: 'Jefe de Enfermería',
      nurse_manager: 'Gerente de Enfermería',
      quality_assurance_manager: 'Gerente de Calidad',
      clinical_supervisor: 'Supervisor Clínico',
      staff_nurse: 'Enfermero/a'
    };
    return roleNames?.[role] || role;
  };

  const changeRole = (newRole) => {
    if (rolePermissions?.[newRole]) {
      setUserRole(newRole);
      localStorage.setItem('userRole', newRole);
    }
  };

  const contextValue = {
    userRole,
    permissions,
    hasPermission,
    filterNavigationItems,
    getRoleDisplayName,
    changeRole,
    availableRoles: Object.keys(rolePermissions)
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleBasedNavigationFilter;