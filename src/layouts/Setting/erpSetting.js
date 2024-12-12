import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import GeneralSettings from './GeneralSettings';
import UserPreferences from './UserPreferences';
import SecuritySettings from './SecuritySettings';
import PermissionsSettings from './PermissionsSettings';
import NotificationSettings from './NotificationSettings';
import SystemPreferences from './SystemPreferences';
import DataBackup from './DataBackup';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

const SettingsModule = () => {
  const [activeTab, setActiveTab] = useState('general');

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <DashboardLayout>
    <Container fluid>
      <Row className="mt-3">
        <Col md={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link onClick={() => handleTabChange('general')} active={activeTab === 'general'}>
                General Settings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleTabChange('user_preferences')} active={activeTab === 'user_preferences'}>
                User Preferences
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleTabChange('security')} active={activeTab === 'security'}>
                Security
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleTabChange('permissions')} active={activeTab === 'permissions'}>
                Role Permissions
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleTabChange('notifications')} active={activeTab === 'notifications'}>
                Notification Settings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleTabChange('system_preferences')} active={activeTab === 'system_preferences'}>
                System Preferences
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleTabChange('data_backup')} active={activeTab === 'data_backup'}>
                Data Backup
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        <Col md={9}>
          <Card className="p-3">
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'user_preferences' && <UserPreferences />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'permissions' && <PermissionsSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'system_preferences' && <SystemPreferences />}
            {activeTab === 'data_backup' && <DataBackup />}
          </Card>
        </Col>
      </Row>
    </Container>
    </DashboardLayout>
  );
};

export default SettingsModule;
