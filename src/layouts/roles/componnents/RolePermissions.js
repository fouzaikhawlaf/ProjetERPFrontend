// src/layouts/roles/components/RolePermissions.js
import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RolePermissions = () => {
  const [permissions, setPermissions] = useState({
    Admin: { view: true, edit: true, delete: true },
    Manager: { view: true, edit: true, delete: false },
    Employee: { view: true, edit: false, delete: false },
  });

  const handlePermissionChange = (role, permission) => {
    setPermissions({
      ...permissions,
      [role]: {
        ...permissions[role],
        [permission]: !permissions[role][permission],
      },
    });
  };

  return (
    <div>
      {Object.keys(permissions).map((role) => (
        <Accordion key={role}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{role} Permissions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={<Checkbox checked={permissions[role].view} onChange={() => handlePermissionChange(role, 'view')} />}
              label="View"
            />
            <FormControlLabel
              control={<Checkbox checked={permissions[role].edit} onChange={() => handlePermissionChange(role, 'edit')} />}
              label="Edit"
            />
            <FormControlLabel
              control={<Checkbox checked={permissions[role].delete} onChange={() => handlePermissionChange(role, 'delete')} />}
              label="Delete"
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default RolePermissions;
