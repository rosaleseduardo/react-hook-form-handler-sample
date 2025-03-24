import { afterEach, describe, expect, it } from 'vitest';

import { cleanup, renderHook } from '@testing-library/react';

import { useDemoForm } from '.';

const performRender = () => renderHook(() => useDemoForm());

describe('useDemoForm Hook', () => {
  afterEach(() => {
    cleanup();
  });

  it('Returns expected methods and properties for form interaction', () => {
    const { result } = performRender();

    expect(Object.keys(result.current)).toEqual(['defaultValues', 'onSubmit', 'formHandler', 'contextValue']);
  });

  it('Type definitions for returned methods/data are as expected', () => {
    const { result } = performRender();

    expect(result.current).toEqual({
      defaultValues: expect.any(Object),
      onSubmit: expect.any(Function),
      formHandler: expect.any(Object),
      contextValue: expect.any(Object),
    });
  });

  it('The default values provided to the form match expectations', () => {
    const { result } = performRender();

    expect(result.current.defaultValues).toStrictEqual({
      name: '',
      lastName: '',
      contactDetails: {
        email: '',
        phoneNumber: '',
      },
    });
  });
});
