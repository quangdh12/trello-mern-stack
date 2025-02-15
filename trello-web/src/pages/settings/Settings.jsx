import { Person, Security } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Container, Link, Tab } from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TABS } from '~/utils/constants';
import AccountTab from './AccountTab';
import SecurityTab from './SecurityTab';
import AppBar from '~/components/AppBar/AppBar';

const Settings = () => {
    const location = useLocation();
    const getDefaultTab = () => {
        if (location.pathname.includes(TABS.SECURITY)) return TABS.SECURITY;
        return TABS.ACCOUNT;
    };
    const [activeTab, setActiveTab] = useState(getDefaultTab());

    const handleChangeTab = (event, newTab) => {
        setActiveTab(newTab);
    };

    return (
        <Container disableGutters maxWidth={false}>
            <AppBar />
            <TabContext value={activeTab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChangeTab}>
                        <Tab
                            label="Account"
                            value={TABS.ACCOUNT}
                            icon={<Person />}
                            iconPosition="start"
                            component={Link}
                            to="/settings/account"
                        />
                        <Tab
                            label="Security"
                            value={TABS.SECURITY}
                            icon={<Security />}
                            iconPosition="start"
                            component={Link}
                            to="/settings/security"
                        />
                    </TabList>
                </Box>
                <TabPanel value={TABS.ACCOUNT}>
                    <AccountTab />
                </TabPanel>
                <TabPanel value={TABS.SECURITY}>
                    <SecurityTab />
                </TabPanel>
            </TabContext>
        </Container>
    );
};

export default Settings;
