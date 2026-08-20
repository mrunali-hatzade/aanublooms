import React from 'react';
import { CustomOrderBuilder } from '../components/custom/CustomOrderBuilder';

export const CustomOrderPage = ({ onNavigate }) => {
  return (
    <div className="min-h-[75vh]">
      <CustomOrderBuilder onNavigate={onNavigate} />
    </div>
  );
};
