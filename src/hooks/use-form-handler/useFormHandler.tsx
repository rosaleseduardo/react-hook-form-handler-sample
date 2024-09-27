import { isEqual } from 'lodash';
import {
  type FieldValues,
  type KeepStateOptions,
  type Path,
  type PathValue,
  useForm,
} from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import type { FormHandlerProps, SetValueProps } from '@interfaces';

import type { DebugModeState } from './interfaces';

/**
 * Custom hook to manage a form
 *
 * @see
 *  [useForm](https://react-hook-form.com/docs/useform)
 *
 * @returns Methods exposing individual functions to manage the form state.
 */
const useFormHandler = <T extends FieldValues>(props: FormHandlerProps<T>) => {
  /**
   * It is a custom hook for managing forms with ease. It takes one object as
   * optional argument
   *
   * Link to official documentation
   * {@link https://react-hook-form.com/docs/useform}
   */
  const formInstance = useForm<T>({
    defaultValues: props.defaultValues,
    mode: props.mode ?? 'onChange',
    // @ts-expect-error: Type 'FieldValues' is not assignable to type
    // 'MakeKeysOptional<T>'
    resolver: yupResolver(props.schema),
    ...props.options,
  });

  /**
   * This function allows you to dynamically set the value of a registered field
   * and have the options to validate and update the form state. At the same
   * time, it tries to avoid unnecessary rerender.
   *
   * Link to official documentation
   * {@link https://react-hook-form.com/docs/useform/setvalue}
   */
  const setFormValue = (args: SetValueProps) => {
    formInstance.setValue(
      args.name as Path<T>,
      args.value as PathValue<T, Path<T>>,
      { shouldValidate: true, shouldDirty: true, ...args.options },
    );
  };

  /**
   * This object contains information about the entire form state. It helps you
   * to keep on track with the user's interaction with your form application.
   *
   * Link to official documentation
   * {@link https://react-hook-form.com/docs/useform/formstate}
   */
  const formState = () => {
    const { defaultValues, isValid, errors } = formInstance.formState;

    return {
      defaultValues,
      currentState: formInstance.getValues(),
      isValid: !isValid,
      errors,
      hasBeenUpdated: !isEqual(defaultValues, formInstance.getValues()),
    };
  };

  /**
   * This method is introduced in react-hook-form (v7.25.0) to return individual
   * field state. It's useful in case you are trying to retrieve nested field
   * state in a typesafe way.
   *
   * Link to official documentation
   * {@link https://react-hook-form.com/docs/useform/getfieldstate}
   */
  const fieldState = (name: Path<T>) => {
    const { isDirty, isTouched, invalid, error } =
      formInstance.getFieldState(name);

    return { isDirty, isTouched, invalid, error: error?.message ?? '' };
  };

  /**
   * This function can manually clear errors in the form.
   *
   * Link to official documentation
   * {@link https://github.com/react-hook-form/react-hook-form/discussions/2704}
   */
  const clearErrors = (input?: Path<T> | Array<Path<T>>) => {
    if (typeof input === 'string') formInstance.clearErrors(input);
    if (typeof input === 'object') formInstance.clearErrors(input);
    formInstance.clearErrors();
  };

  /**
   * Reset the entire form state, fields reference, and subscriptions. There are
   * optional arguments and will allow partial form state reset.
   *
   * Link to official documentation
   * {@link https://react-hook-form.com/docs/useform/reset}
   */
  const resetForm = (values?: T, options?: KeepStateOptions) => {
    if (values != null) {
      formInstance.reset(values, options);
      return;
    }

    formInstance.reset(props.defaultValues, options);
  };

  /**
   * Manually triggers form or input validation. This method is also useful when
   * you have dependant validation (input validation depends on another input's
   * value).
   *
   * Link to official documentation
   * {@link https://react-hook-form.com/docs/useform/trigger}
   */
  const triggerValidation = async (input?: string | string[]) => {
    if (typeof input === 'string') {
      return await formInstance.trigger(input as Path<T>);
    }
    if (typeof input === 'object') {
      return await formInstance.trigger(input as Array<Path<T>>);
    }

    return await formInstance.trigger();
  };

  /**
   * This function will receive the form data if form validation is successful.
   *
   * Link to official documentation
   * {@link https://react-hook-form.com/docs/useform/handlesubmit}
   */
  const onSubmitHandler = formInstance.handleSubmit(
    props.onSubmit,
    props.onError,
  );

  /**
   * Get a debug snapshot of the current state of the form instance.
   *
   * @returns An object representing the debug snapshot of the current form
   * state.
   */
  const debugMode = (): DebugModeState => {
    const { defaultValues, currentState, isValid, errors, hasBeenUpdated } =
      formState();

    return {
      defaultValues,
      currentState,
      isValid: !isValid,
      errors,
      hasBeenUpdated,
    };
  };

  return {
    setFormValue,
    formState,
    fieldState,
    clearErrors,
    resetForm,
    triggerValidation,
    onSubmitHandler,
    debugMode,
  };
};

export default useFormHandler;
