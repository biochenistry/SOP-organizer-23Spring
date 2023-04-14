import React from 'react';
import { ChangeEvent, useEffect } from "react";
import View from '../View/View';
import { StyleSheet, css } from 'aphrodite';
import Paragraph from '../Paragraph/Paragraph';
import { Colors } from '../GlobalStyles';
import { FaRegTimesCircle } from 'react-icons/fa';


export type TextFieldProps = {
  name: string;
  value?: string | undefined;
  error?: string | null | undefined;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean | string;
  showClear?: boolean;
  onChange?: (name: string, value: string) => void;
  validate?: (name: string, value: string) => string | null;
  onValidate?: (name: string, error: string | null) => void;
  id?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  disabled?: boolean;
  testId?: string;
}

const styles = StyleSheet.create({
  description: {
    color: Colors.textSecondary,
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '4px',
  },
  error: {
    marginTop: '4px',
  },
  inputContainer: {
    display: 'flex',
    position: 'relative',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '4px',
  },
  required: {
    color: Colors.error,
    marginLeft: '4px',
  },
  inputShared: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: Colors.harlineGrey,
    borderRadius: '4px',
    boxShadow: 'none',
    boxSizing: 'border-box',
    color: Colors.textPrimary,
    fontSize: '16px',
    height: '40px',
    lineHeight: '24px',
    margin: '0',
    padding: '0 12px',
    flexGrow: 1,
    width: '100%',
    '-webkit-appearance': 'none',
  },
  errorField: {
    borderColor: Colors.error,
    ':focus': {
      borderColor: Colors.error,
    },
    ':focus-visible': {
      borderColor: Colors.error,
    }
  },
  infoContainer: {
    marginBottom: '4px',
  },
  inputDisabled: {
    backgroundColor: '#FBFBFB',
    color: '#919991',
  },
  clearButton: {
    backgroundColor: '#ffffff',
    color: Colors.textSecondary,
    cursor: 'pointer',
    fill: Colors.textSecondary,
  },
});

/**
 * A text input field used for collecting user input.
 * 
 * 
 * <TextField
 *   type='text'
 *   name='fieldName'
 *   value=''
 *   error=''
 *   label='Sample Field'
 *   onChange={() => {}} onValidate={() => {}}
 * />
 */

export default function TextField(props: TextFieldProps) {
  const { required, value, name, onValidate } = props;

  useEffect(() => {
    if (required !== undefined && (value === '' || value === null || value === undefined)) {
      onValidate && onValidate(name, '');
    }
    // Don't add depencies to array, as this causes infinite re-renders
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (props.required) {
      let error = null;

      if (props.validate) {
        error = props.validate(props.name, e.target.value);
      }

      if (error !== null) {
        props.onValidate && props.onValidate(props.name, error);
      }
      else {
        if (props.required !== undefined && e.target.value === '') {
          props.onValidate && props.onValidate(props.name, 'This field is required');
        }
        else {
          props.onValidate && props.onValidate(props.name, null);
        }
      }
    }

    props.onChange && props.onChange(props.name, e.target.value);
  }

  const handleClear = () => {
    if (props.required) {
      let error = null;

      if (props.validate) {
        error = props.validate(props.name, '');
      }

      if (error !== null) {
        props.onValidate && props.onValidate(props.name, error);
      }
      else {
        if (props.required !== undefined) {
          props.onValidate && props.onValidate(props.name, 'This field is required');
        }
        else {
          props.onValidate && props.onValidate(props.name, null);
        }
      }
    }

    props.onChange && props.onChange(props.name, '');
  }

  // Prevents the input value from changing when the user scrolls while the mouse is over the field (only for type=number inputs)
  const handleScroll = (e: React.WheelEvent) => {
    if (props.type === 'number') {
      const target = e.target as HTMLInputElement;
      target.blur();
    }
  }

  return (
    <View container flexDirection='column' flexGrow={1}>
      {(props.label || props.description) &&
        <div className={css(styles.infoContainer)}>
          {props.label && (
            <div className={css(styles.labelContainer)}>
              <label htmlFor={props.id || props.name + '-field'}><Paragraph>{props.label}{props.required !== undefined && <span className={css(styles.required)}>*</span>}</Paragraph></label>
            </div>
          )}

          {props.description && (
            <p className={css(styles.description)}>{props.description}</p>
          )}
        </div>
      }

      <div className={css(styles.inputContainer)}>
        <input
          type={props.type || 'text'}
          name={props.name}
          value={props.value}
          placeholder={props.placeholder}
          id={props.id || props.name + '-field'}
          data-testid={props.testId}
          onChange={handleChange}
          className={css(styles.inputShared, (typeof props.error === 'string' && props.error !== '') && styles.errorField, props.disabled && styles.inputDisabled)}
          disabled={props.disabled}
          onWheel={handleScroll}
        />
        {(props.showClear && props.value) &&
          <View container style={{ position: 'absolute', right: '2px', top: '2px', height: 'calc(100% - 4px)', alignItems: 'center', paddingRight: '4px', justifyContent: 'flex-end' }}>
            <View style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1))', height: '100%', width: '16px' }}></View>
            <FaRegTimesCircle className={css(styles.clearButton)} onClick={handleClear} />
          </View>
        }
      </div>

      {props.error && (
        <Paragraph style={{ color: Colors.error, marginTop: '4px' }}>{props.error}</Paragraph>
      )}
    </View>
  );
}