import React, { PropsWithChildren, ReactElement, useState } from 'react';
import Modal from './Modal';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import ModalLauncher from './ModalLauncher';
import useForm from '../Form/useForm';
import TextField, { TextFieldProps } from '../TextField/TextField';
import Form from '../Form/Form';
import Button from '../Button/Button';

export type FormModalProps<T extends { [name: string]: any }> = {
  title: string;
  showCloseButton?: boolean;
  showCancelButton?: boolean;
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
export default function FormModal<T extends { [name: string]: any }>(props: FormModalProps<T>) {
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

  const mapChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (c) => {
      const child = c as ReactElement;

      if (child === null) {
        return null;
      }

      if (child.props && child.props.children && child.type !== TextField && child.type !== ModalLauncher) {
        return React.cloneElement(child, {
          children: mapChildren(child.props.children),
        });
      }

      if (child.type === TextField) {
        const textField = child as ReactElement<PropsWithChildren<TextFieldProps>>;

        return React.cloneElement(child, {
          onChange: form.handleChange,
          onValidate: form.handleValidate,
          value: form.values[textField.props.name],
          error: form.errors[textField.props.name],
        });
      }
      else {
        return child;
      }
    })
  }

  return (
    <Modal
      header={<ModalHeader title={props.title} showCloseButton={props.showCloseButton} />}

      body={
        <ModalBody>
          <Form handleSubmit={form.handleSubmit}>
            {mapChildren(props.children)}
          </Form>
        </ModalBody>
      }

      footer={
        <ModalFooter>
          {({ closeModal }) => (
            <>
              {props.showCancelButton !== false &&
                <Button
                  variant='secondary'
                  onClick={() => {
                    if (props.onCancel) {
                      props.onCancel();
                    };
                    closeModal();
                  }}
                  label={props.cancelLabel || 'Cancel'}
                  disabled={isLoading}
                />
              }

              <Button
                variant='primary'
                onClick={async () => {
                  await handleSubmit(form.values);
                  closeModal();
                }}
                label={props.submitLabel || 'Save'}
                disabled={form.hasError}
                isLoading={isLoading}
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