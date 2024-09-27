import { useEffect, useMemo } from 'react';
import type { FC } from 'react';
import type { FieldValues } from 'react-hook-form';

import { useWithBaseField } from '@hooks';
import type { BaseFieldProps } from '@interfaces';

/**
 * Enhances a given React component by providing form handling capabilities.
 *
 * It wraps the `WrappedComponent` with additional props such as `onChange`,
 * `onBlur`, `value`, `error`, and `helperText`.
 *
 * The form handling is powered by a `formhandler` instance implementing
 * specific methods.
 *
 * @param WrappedComponent - The React component to be enhanced with form
 * handling props.
 * @param ComponentType - The type of component to be enhanced
 *
 * @typeParam T - The type of form values managed by the form handler.
 *
 * @returns The enhanced component with form handling props.
 */
const withBaseField = <T extends FieldValues>(
  WrappedComponent: FC<T>,
  ComponentType: string,
) => {
  /**
   * The enhanced functional component with form handling capabilities.
   *
   * @param props - Props to be passed to the enhanced component.
   *
   * @returns JSX representing the enhanced component.
   */
  return function WithFormHandlerField(props: T & BaseFieldProps<T>) {
    const {
      setInitialValue,
      value,
      handleBlur,
      handleChange,
      debouncedHandleChange,
      debouncedBlurChange,
    } = useWithBaseField(props, ComponentType);

    const currentState = useMemo(
      () => props.formhandler?.formState().currentState,
      [props.formhandler],
    );

    useEffect(() => {
      setInitialValue();

      // Clean up debounced functions when component is unmounted
      return () => {
        debouncedHandleChange.cancel();
        debouncedBlurChange.cancel();
      };
    }, [currentState]);

    /**
     * Injects the additional props related to form handling to the
     * WrappedComponent.
     */
    return (
      <WrappedComponent
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        error={props.formhandler?.fieldState(props.name).invalid ?? props.error}
        /**
         * IMPORTANT
         *
         * If you are using an internationalization package (such as
         * react-i18next or react-intl), ensure that you call the package
         * translation function here (through the locallization provider). This
         * ensures the error message is translated and displayed seamlessly.
         *
         * NOTE
         *
         * Validation schema messages should only include the translation
         * token. This is the appropriate place to handle the translation of
         * the error message.
         */
        helperText={
          props.formhandler?.fieldState(props.name).error ?? props.helperText
        }
      />
    );
  };
};

export default withBaseField;
