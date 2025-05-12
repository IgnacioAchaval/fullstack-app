import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TaskList from './components/TaskList';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Task Manager
          </Typography>
          <TaskList />
        </Box>
      </Container>
    </Layout>
  );
}

export default App; 