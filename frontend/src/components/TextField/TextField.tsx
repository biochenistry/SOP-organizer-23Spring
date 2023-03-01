import React from 'react';
import { ChangeEvent, useEffect } from "react";


export type TextFieldProps = {
  name: string;
  value?: string | undefined;
  error?: string | null | undefined;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean | string;
  onChange?: (name: string, value: string) => void;
  validate?: (name: string, value: string) => string | null;
  onValidate?: (name: string, error: string | null) => void;
  helpModal?: React.ReactNode;
  id?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'currency';
  disabled?: boolean;
  testId?: string;
}



/**
 * A text input field used for collecting user input.
 * 
 * ### Usage
 * 
 * ```jsx
 * import { TextField } from '@barscience/global-components';
 * 
 * <TextField
 *   type='text'
 *   name='fieldName'
 *   value=''
 *   error=''
 *   label='Sample Field'
 *   onChange={() => {}} onValidate={() => {}}
 * />
 * ```
 */
export default function TextField(props: TextFieldProps) {
  useEffect(() => {
    if (props.required !== undefined && (props.value === '' || props.value === null || props.value === undefined)) {
      props.onValidate && props.onValidate(props.name, '');
    }
  }, []);

  const validate = (value: string) => {
    let error = null;

    if (props.validate) {
      error = props.validate(props.name, value);
    }

    if (error !== null) {
      props.onValidate && props.onValidate(props.name, error);
    }
    else {
      if (props.required !== undefined && value === '') {
        props.onValidate && props.onValidate(props.name, typeof props.required === 'boolean' ? 'This field is required' : props.required);
      }
      else {
        props.onValidate && props.onValidate(props.name, null);
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (props.required) {
      let error = null;

      if (props.validate) {
        error = props.validate(props.name, e.target.value);
      }

      if (error !== null) {
        props.onValidate && props.onValidate(props.name, '');
      }
      else {
        if (props.required !== undefined && e.target.value === '') {
          props.onValidate && props.onValidate(props.name, '');
        }
        else {
          props.onValidate && props.onValidate(props.name, null);
        }
      }
    }

    props.onChange && props.onChange(props.name, e.target.value);
  }

  /*
  const handleBlur = () => {
    if (props.type === 'currency') {      
      if (props.value) {
        const formattedValue = currency(props.value).format();
        props.onChange && props.onChange(props.name, formattedValue);
      }
      else {
        props.onChange && props.onChange(props.name, '');
      }
    }

    validate(props.value || '');
  }
  */

  // Prevents the input value from changing when the user scrolls while the mouse is over the field (only for type=number inputs)
  const handleScroll = (e: React.WheelEvent) => {
    if (props.type === 'number' || props.type === 'currency') {
      const target = e.target as HTMLInputElement;
      target.blur();
    }
  }

  return (
    <div>
        <input
          type={getType(props.type) || 'text'}
          name={props.name}
          value={props.type === 'currency' ? props.value?.replace('$', '') : props.value}
          placeholder={props.placeholder}
          id={props.id || props.name + '-field'}
          data-testid={props.testId}
          onChange={handleChange}
          disabled={props.disabled}
          onWheel={handleScroll}
        />
      </div>

      
  );
}

const getType = (type?: string) => {
  switch (type) {
    case 'currency':
      return 'text';
    default:
      return type;
  }
}