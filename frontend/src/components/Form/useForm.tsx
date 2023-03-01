import React, { useReducer, useState } from "react";

type useFormProps<T> = {
  initialValues: T,
  onSubmit: ((values: T) => Promise<void>) | ((values: T) => void),
}

type ErrorAction =
  | {
    type: 'ADD_ERROR';
    name: string;
    error: string;
  }
  | {
    type: 'REMOVE_ERROR';
    name: string;
  }

const errorReducer = (state: { [name: string]: string}, action: ErrorAction) => {
  switch (action.type) {
    case 'ADD_ERROR': {
      return {
        ...state,
        [action.name]: action.error
      };
    }
    case 'REMOVE_ERROR': {
      let newState = {...state};
      delete newState[action.name];
      return newState;
    }
    default: {
      return state;
    }
  }
}

export default function useForm<T>(props: useFormProps<T>) {
  const [values, setValues] = useState<T>(props.initialValues);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, dispatch] = useReducer(errorReducer, {});

  const handleChange = (name: string, value: string | number | boolean | { [name: string]: boolean } | null) => {
    setValues({
      ...values,
      [name]: value,
    });
  }

  const handleValidate = (name: string, error: string | null) => {
    if (error !== null) {
      dispatch({
        type: 'ADD_ERROR',
        name: name,
        error: error,
      });
    }
    else {
      dispatch({
        type: 'REMOVE_ERROR',
        name: name,
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await props.onSubmit(values);
    setIsLoading(false);
  }

  return {
    handleChange: handleChange,
    handleValidate: handleValidate,
    handleSubmit: handleSubmit,
    values: values,
    errors: errors,
    hasError: Object.keys(errors).length > 0,
    isLoading: isLoading,
  };
}