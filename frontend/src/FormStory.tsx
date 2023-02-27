
import Form, { FormProps } from './Form';
import useForm from './useForm';
import TextField from './TextField';



type FormExampleType = {
  firstName: string;
  lastName: string;
}

export const Default = () => {
  const form = useForm<FormExampleType>({
    initialValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async (values: { [name: string]: any }) => {
      window.alert('First Name: ' + values.firstName + '\nLast Name: ' + values.lastName);
    }
  });

  return (
    
      <Form handleSubmit={form.handleSubmit}>
        
          <TextField label='First Name' description='Your first name' name='firstName' value={form.values.firstName} error={form.errors.firstName} onChange={form.handleChange} onValidate={form.handleValidate} required />
          
          <TextField label='Last Name' description='Your last name' name='lastName' value={form.values.lastName} error={form.errors.lastName} onChange={form.handleChange} onValidate={form.handleValidate} required />
        
        
      </Form>
    
  );
}
Default.parameters = {
  docs: {
    storyDescription: 'Test Story'
  }
}