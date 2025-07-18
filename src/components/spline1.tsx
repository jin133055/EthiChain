// spline1.tsx
import React from 'react';
import Spline from '@splinetool/react-spline';

export const SplineViewer: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Spline scene="https://my.spline.design/applewatchcopy-ZWWWvdYs6UKWIjKpruwuRc6n/" />
    </div>
  );
};
