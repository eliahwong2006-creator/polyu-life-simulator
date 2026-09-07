// src/components/player/RadarChart.js
// Radar chart component for displaying player attributes

import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { theme } from '../../styles/theme';
import { GAME_CONSTANTS } from '../../firebase/config';

const RadarChart = ({ attributes, size = 300 }) => {
  // Convert attributes object to array format required by Recharts
  const data = [
    {
      attribute: 'Wisdom',
      value: attributes?.wisdom ?? 0,
      fullMark: GAME_CONSTANTS.MAX_ATTRIBUTE_VALUE,
    },
    {
      attribute: 'Strength',
      value: attributes?.strength ?? 0,
      fullMark: GAME_CONSTANTS.MAX_ATTRIBUTE_VALUE,
    },
    {
      attribute: 'Social',
      value: attributes?.social ?? 0,
      fullMark: GAME_CONSTANTS.MAX_ATTRIBUTE_VALUE,
    },
    {
      attribute: 'Sanity',
      value: attributes?.sanity ?? 0,
      fullMark: GAME_CONSTANTS.MAX_ATTRIBUTE_VALUE,
    },
    {
      attribute: 'Energy',
      value: attributes?.energy ?? 0,
      fullMark: GAME_CONSTANTS.MAX_ATTRIBUTE_VALUE,
    },
  ];

  return (
    <div style={{ width: '100%', height: size, maxWidth: size, margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} outerRadius="70%">
          <PolarGrid stroke={theme.radarChart.grid} />
          <PolarAngleAxis
            dataKey="attribute"
            tick={{ fill: theme.colors.text, fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, GAME_CONSTANTS.MAX_ATTRIBUTE_VALUE]}
            tick={{ fill: theme.colors.textSecondary, fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Attributes"
            dataKey="value"
            stroke={theme.radarChart.fill}
            fill={theme.radarChart.fill}
            fillOpacity={0.6}
            strokeWidth={2}
          />
          <Legend wrapperStyle={{ color: theme.colors.text }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.secondary}`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: theme.colors.text }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;