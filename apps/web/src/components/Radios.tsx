import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio as MuiRadio,
  RadioGroup,
} from '@mui/material';
import React from 'react';

type Option = {
  value: string | number;
  label: string;
};

interface RatioProps<TOption extends Option> {
  name: string;
  options: readonly TOption[];
  value: TOption['value'];
  onChange: (newValue: TOption['value']) => void;
  onBlur: () => void;
  label: string;
}

const RadiosInner = <TOption extends Option>(
  {label, options, value, onChange, onBlur, name}: RatioProps<TOption>,
  ref: React.Ref<HTMLDivElement>,
) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value as TOption['value'];
    onChange(newValue);
  };
  return (
    <FormControl fullWidth ref={ref}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        row
        value={value}
        onChange={handleOnChange}
        name={name}
        onBlur={onBlur}
      >
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<MuiRadio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

const Radios = React.forwardRef(RadiosInner);

export default Radios;
