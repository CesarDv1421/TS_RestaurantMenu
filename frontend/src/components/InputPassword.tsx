import { useState } from 'react';
import { Input } from '@nextui-org/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from './Icons';

interface ChildrenProps {
  label: string;
  validationState: string | false;
  errorMessage: string | boolean;
  value: string;
  onValueChange: (value: string) => void;
}

const InputPassword: React.FC<ChildrenProps> = ({ label, validationState, errorMessage, value, onValueChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      label={label}
      validationState={validationState ? 'valid' : 'invalid'}
      errorMessage={errorMessage}
      value={value}
      onValueChange={onValueChange}
      endContent={
        <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
          {isVisible ? (
            <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
          ) : (
            <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
    />
  );
};

export default InputPassword;
