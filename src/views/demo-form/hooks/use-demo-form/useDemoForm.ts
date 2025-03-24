import { useState } from 'react';
import type { FieldErrors } from 'react-hook-form';
import * as yup from 'yup';

import { useFormHandler } from '@hooks';
import type { FormMode, UseFormHelperReturn } from '@interfaces';

import type { DemoFormSchema } from '../../interfaces';

/**
 * Custom hook for handling a demo form. It provides the form handler and
 * context value for the form.
 *
 * @returns An object containing the form handler and context value for the
 * demo form.
 *
 * @example
 * ```tsx
 * import { useDemoForm } from './path/to/useDemoForm';
 * import { DemoFormContext } from './path/to/DemoForm.context';
 * import { FormContent } from './path/to/DemoForm.component.Content';
 *
 * const Component = () => {
 *   const { contextValue } = useDemoForm();
 *
 *   return (
 *     <DemoFormContext.Provider value={contextValue}>
 *       <FormContent debugMode />
 *     </DemoFormContext.Provider>
 *   );
 * };
 * ```
 */
const useDemoForm = (): Omit<UseFormHelperReturn<DemoFormSchema>, 'onError' | 'schema'> => {
  /**
   * NOTE: Apply the logic to determine the Form Mode, which will serve to fuel
   * the right context to the local state.
   */
  const [mode] = useState<FormMode>('create');
  const defaultValues: DemoFormSchema = {
    name: '',
    lastName: '',
    contactDetails: {
      email: '',
      phoneNumber: '',
    },
  };

  const validationSchema: yup.ObjectSchema<DemoFormSchema> = yup.object().shape({
    name: yup.string().required('This field is required'),
    lastName: yup.string().required('This field is required'),
    contactDetails: yup.object().shape({
      email: yup.string().required('This field is required'),
      phoneNumber: yup.string().required('This field is required'),
    }),
  });

  const onSubmit = (values: DemoFormSchema) => {
    console.log('Data ', values);
  };

  const onError = (data: FieldErrors<DemoFormSchema>) => {
    console.log('Data ', data);
  };

  const formHandler = useFormHandler<DemoFormSchema>({
    defaultValues,
    schema: validationSchema,
    onSubmit,
    onError,
  });

  const contextValue = {
    formHandler,
    mode,
  };

  return {
    defaultValues,
    onSubmit,
    formHandler,
    contextValue,
  };
};

export default useDemoForm;
