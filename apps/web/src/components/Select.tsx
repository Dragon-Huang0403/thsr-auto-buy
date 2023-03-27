import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';

type Option = {
  value: string;
  label: string;
};

interface SelectProps<TOption extends Option> {
  name: string;
  options: readonly TOption[];
  value: TOption['value'];
  onChange: (newValue: TOption['value']) => void;
  onBlur: () => void;
  label: string;
}

const SelectInner = <TOption extends Option>(
  {label, options, value, onChange, onBlur, name}: SelectProps<TOption>,
  ref: React.Ref<HTMLDivElement>,
) => {
  const handleOnChange = (e: SelectChangeEvent<TOption['value']>) => {
    const newValue = e.target.value as TOption['value'];
    onChange(newValue);
  };
  return (
    <FormControl fullWidth ref={ref}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        value={value}
        onChange={handleOnChange}
        label={label}
        name={name}
        onBlur={onBlur}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

const Select = React.forwardRef(SelectInner);

export default Select;
