import React from 'react';


export type FormProps = {
  children?: React.ReactNode;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  id?: string;
  testId?: string;
}

/**
 * Form is used in combination with the `useForm` hook as a wrapper for form elements. The `useForm` hook keeps track of all form state (values, errors, loading status, etc.) for a single `Form` component.
 * 
 * The form can be submitted by a Button component with type `submit`. The submit button can optionally be disabled if the form contains any errors or unfilled required fields.
 * 
 * The child elements of a `Form` are automatically wrapped in a `View`. To position input fields in the same row, wrap them in another `View` with `flexDirection: 'row'`.
 * 
 * ### Usage
 * 
 * ```jsx
 * import { Form, TextField, useForm } from '@barscience/global-components';
 * 
 * type ExampleFormType = {
 *   firstName: string;
 *   lastName: string;
 * }
 * 
 * const form = useForm<ExampleFormType>({
 *   initialValues: {
 *     firstName: '',
 *     lastName: '',
 *   },
 *  onSubmit: async (values: { [name: string]: any }) => {
 *    window.alert('First Name: ' + values.firstName + '\nLast Name: ' + values.lastName);
 *  }
 * });
 * 
 * <Form handleSubmit={form.handleSubmit}>
 *  <TextField label='First Name' name='firstName' value={form.values.firstName} error={form.errors.firstName} onChange={form.handleChange} onValidate={form.handleValidate} />
 *  <TextField label='Last Name' name='lastName' value={form.values.lastName} error={form.errors.lastName} onChange={form.handleChange} onValidate={form.handleValidate} />
 * </Form>
 * ```
 */
export default function Form(props: FormProps) {
  return (
    <form onSubmit={props.handleSubmit} id={props.id} data-testid={props.testId}>
        {props.children}
    </form>
  );
}