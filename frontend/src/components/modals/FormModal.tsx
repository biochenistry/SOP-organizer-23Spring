import React, { PropsWithChildren, ReactElement, useState } from 'react';
import Modal from './Modal';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import ModalLauncher from './ModalLauncher';
import useForm from '../Form/useForm';

export type FormModalProps<T extends {[name: string]: any}> = {
  title: string;
  showCloseButton?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: (data?: any) => void;
  onSubmit: ((values: T) => Promise<void>) | ((values: T) => void);
  handleClose?: () => void;
  children?: React.ReactNode;
  initialValues: T;
  data?: T;
  destructive?: boolean;
  id?: string;
  testId?: string;
}

/**
 * `FormModal` enables you to embed a `Form` within a `Modal` component. The form state is automatically managed by the `FormModal` component. You only need to provide the form data type and the form fields as child components.
 * 
 * You should **not** set the `onChange`, `onValidate`, `value`, or `error` props on any of the field components---these are automatically set by `FormModal`.
 * 
 * ### Usage
 * 
 * ```jsx 
 * type ExampleFormType = {
 *   firstName: string;
 *   lastName: string;
 * }
 * 
 * const initialValues: ExampleFormType = {
 *   firstName: '',
 *   lastName: '',
 * }
 * 
 * const handleSubmit = (values: { [name: string]: any }) => {
 *   // Do something with the form values here
 * }
 * 
 * <FormModal<ExampleFormType> title='Sample Form' onSubmit={handleSubmit} initialValues={initialValues} >
 *   <View>
 *     <TextField type='text' name='firstName' label='First Name' />
 *     <Strut size='16px' />
 *     <TextField type='text' name='lastName' label='Last Name' />
 *   </View>
 * </FormModal>
 * ```
 */
export default function FormModal<T extends {[name: string]: any}>(props: FormModalProps<T>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleSubmit = async (values: T) => {
    setIsLoading(true);

    await props.onSubmit(values);

    setIsLoading(false);
  }
  
  const form = useForm<T>({
    initialValues: props.data ? props.data : props.initialValues,
    onSubmit: handleSubmit
  });

  const getValue = (name: string) => {
    return form.values[name];
  }

  const setValue = (name: string, value: any) => {
    form.handleChange(name, value);
  }

  const getError = (name: string): string | null | undefined => {
    return form.errors[name];
  }

  const setError = (name: string, error: string | null) => {
    form.handleValidate(name, error);
  }

  const mapChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (c) => {
      const child = c as ReactElement;

      if (child === null) {
        return null;
      }

      if (child.props && child.props.children && child.type !== TextField && child.type !== MultiSelect && child.type !== TextArea && child.type !== ModalLauncher) {
        return React.cloneElement(child, {
          children: mapChildren(child.props.children),
        });
      }
      
      if (child.type === FormModalValueProvider) {
        const valueProvider = child as ReactElement<PropsWithChildren<FormModalValueProviderProps>>;

        return React.cloneElement(valueProvider, {
          getValue: getValue,
          setValue: setValue,
          getError: getError,
          setError: setError,
          mapChildren: mapChildren,
        });
      }
      else if (child.type === SingleSelect) {
        const singleSelect = child as ReactElement<PropsWithChildren<SingleSelectProps>>;
                
        return React.cloneElement(child, {
          onChange: form.handleChange,
          onValidate: form.handleValidate,
          value: form.values[singleSelect.props.name],
          error: form.errors[singleSelect.props.name],
        });
      }
      else if (child.type === TextField) {
        const textField = child as ReactElement<PropsWithChildren<TextFieldProps>>;
          
        return React.cloneElement(child, {
          onChange: form.handleChange,
          onValidate: form.handleValidate,
          value: form.values[textField.props.name],
          error: form.errors[textField.props.name],
        });
      }
      else if (child.type === Checkbox) {
        const checkbox = child as ReactElement<PropsWithChildren<CheckboxProps>>;
                
        return React.cloneElement(child, {
          onChange: form.handleChange,
          onValidate: form.handleValidate,
          checked: form.values[checkbox.props.name],
          error: form.errors[checkbox.props.name],
        });
      }
      else if (child.type === CheckboxGroup) {
        const checkboxGroup = child as ReactElement<PropsWithChildren<CheckboxGroupProps<T['']>>>;

        return React.cloneElement(child, {
          onChange: form.handleChange,
          onValidate: form.handleValidate,
          value: form.values[checkboxGroup.props.name],
          error: form.errors[checkboxGroup.props.name],
        });
      }
      else if (child.type === RadioGroup) {
        const radioGroup = child as ReactElement<PropsWithChildren<RadioGroupProps>>;

        return React.cloneElement(child, {
          onChange: form.handleChange,
          onValidate: form.handleValidate,
          value: form.values[radioGroup.props.name],
          error: form.errors[radioGroup.props.name],
        });
      }
      else if (child.type === DatePicker) {
        const datePicker = child as ReactElement<PropsWithChildren<DatePickerProps>>;

        return React.cloneElement(child, {
          onChange: form.handleChange,
          onValidate: form.handleValidate,
          value: form.values[datePicker.props.name],
          error: form.errors[datePicker.props.name],
        });
      }
      else if (child.type === MultiSelect) {
        const multiSelect = child as ReactElement<PropsWithChildren<MultiSelectProps<T['']>>>;
        
        return React.cloneElement(multiSelect, {
          onChange: form.handleChange,
          onValidate: form.handleValidate,
          value: form.values[multiSelect.props.name],
          error: form.errors[multiSelect.props.name],
        });
      }
      else if (child.type === TextArea) {
        const textArea = child as ReactElement<PropsWithChildren<TextAreaProps>>;

        return React.cloneElement(textArea, {
          onChange: form.handleChange,
          onValidate: form.handleValidate,
          value: form.values[textArea.props.name],
          error: form.errors[textArea.props.name],
        });
      }
      else {
        return child;
      }
    })
  }

  return (
    <Modal
      header={<ModalHeader title={props.title} subtitle={props.subtitle} showCloseButton={props.showCloseButton} />}

      body={
        <ModalBody>
          <Form handleSubmit={form.handleSubmit}>
            { mapChildren(props.children) }
          </Form>
        </ModalBody>
      }

      footer={
        <ModalFooter>
          {({ closeModal }) => (
            <>
              <Button
                variant='tertiary'
                role='button'
                action={() => {
                  if (props.onCancel) {
                    props.onCancel();
                  };
                  closeModal();
                }}
                label={props.cancelLabel || 'Cancel'}
                disabled={isLoading}
                destructive={props.destructive}
              />

              <Button
                variant='primary'
                role='button'
                action={async () => {
                  await handleSubmit(form.values);
                  closeModal();
                }}
                label={props.submitLabel || 'Save'}
                disabled={form.hasError}
                loading={isLoading}
                destructive={props.destructive}
              />
            </>
          )}
        </ModalFooter>
      }

      handleClose={props.handleClose}
      id={props.id}
      testId={props.testId}
    />
  );
}