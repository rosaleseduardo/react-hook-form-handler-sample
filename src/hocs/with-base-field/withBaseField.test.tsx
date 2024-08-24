// import React from 'react';
// import { vi } from 'vitest';

// import { render, screen } from '@testing-library/react';

// import { withBaseField } from './withBaseField';

// // Create a mock form handler
// const mockFormHandler = {
//   setFormValue: vi.fn(),
//   formState: vi.fn().mockReturnValue({
//     currentState: {},
//   }),
//   fieldState: vi.fn().mockReturnValue({
//     invalid: false,
//     error: '',
//   }),
//   debugMode: vi.fn(),
// };

// // Create a mock WrappedComponent
// const MockComponent: React.FC<{
//   onChange: React.ChangeEvent<HTMLInputElement>;
//   onBlur: React.FocusEvent<HTMLInputElement>;
//   value: number;
// }> = props => (
//   <div>
//     <input
//       data-testid="mock-input"
//       onChange={props.onChange}
//       onBlur={props.onBlur}
//       value={props.value}
//     />
//   </div>
// );

// const EnhancedComponent = withBaseField(MockComponent);

// describe('withBaseField', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it('Should render the enhanced component', () => {
//     render(
//       <EnhancedComponent formhandler={mockFormHandler} name="fieldName" />,
//     );

//     const inputElement = screen.getByTestId('mock-input');
//     expect(inputElement).toBeInTheDocument();
//   });
// });
