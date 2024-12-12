// src/components/WorkflowStats.js
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const WorkflowStats = ({ stats }) => {
  const theme = useTheme();
  return (
    <Grid container spacing={2}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" component="h2">
                {stat.title}
              </Typography>
              <Typography variant="h4" component="p" color="textPrimary">
                {stat.count}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stat.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// إضافة PropTypes للتحقق من صحة الخصائص
WorkflowStats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default WorkflowStats;
