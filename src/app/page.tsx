"use client"
import React, { useState } from 'react';
import { Button, Checkbox,Input,RadioButton,Textarea } from '@/components/elements';

export default function Home() {
   const [isChecked, setIsChecked] = useState(false);
  const [checkboxStatus, setCheckboxStatus] = useState<'default' | 'error' | 'success'>('default');
    const [selectedValue, setSelectedValue] = useState('');
  const [radioStatus, setRadioStatus] = useState<'default' | 'error' | 'success'>('default');

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);

    // Example logic to change status based on checked value
    if (e.target.checked) {
      setCheckboxStatus('success');
    } else {
      setCheckboxStatus('error');
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
    if (e.target.value === 'option1') {
      setRadioStatus('default');
    } else if (e.target.value === 'option2') {
      setRadioStatus('success');
    } else {
      setRadioStatus('error');
    }
  };
  
  const [inputValue, setInputValue] = useState('');
  const [inputStatus, setInputStatus] = useState<'default' | 'error' | 'focus' | 'success'>('default');

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.length === 0) {
      setInputStatus('error');
    } else if (value.length > 3) {
      setInputStatus('success');
    } else {
      setInputStatus('default');
    }
  };
   const [textareaValue, setTextareaValue] = useState('');
  const [status, setStatus] = useState<'default' | 'error' | 'success' | 'focus'>('default');

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setTextareaValue(value);

    // Simple validation example
    if (value.length < 10) {
      setStatus('error');
    } else if (value.length >= 10 && value.length <= 50) {
      setStatus('success');
    } else {
      setStatus('default');
    }
  };
  return (
    <>
    <div className="homepage-main-wrapper custom-container">
  <div className="py-4">
      <h3>Select an Option:</h3>
      <Checkbox
        label="Check me!"
        name="custom-checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        status={checkboxStatus}
      />
    </div>
       <RadioButton
        label="Option 1"
        name="options"
        value="option1"
        checked={selectedValue === 'option1'}
        onChange={handleRadioChange}
        status={radioStatus}
      />
       <div className="btn-area flex flex-wrap items-center gap-4 py-4">
      <Button variant="primary" onClick={() => console.log('Should not click')}>
        Primary Button
      </Button>
       <Button variant="secondary" onClick={() => console.log('Should not click')}>
        Secondary Button
      </Button>
       <Button variant="tertiary" onClick={() => console.log('Should not click')}>
        Tertiary Button
      </Button>
       <Button variant="accend-link" onClick={() => console.log('Should not click')}>
        Accend Link Button
      </Button>
    </div>
     <div className="flex flex-wrap items-start gap-3 py-4">
      <Input
        type="email"
        placeholder="Enter email"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        label="Email address"
        status={inputStatus}
        className='flex-col'
        errorMessage={inputStatus === 'error' ? 'Input cannot be empty' : ''}
      />
       <Input
        type="email"
        placeholder="Enter email"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        label="Email address"
        status={'focus'}
        className='flex-col'
        errorMessage={inputStatus === 'error' ? 'Input cannot be empty' : ''}
      />
       <Input
        type="email"
        placeholder="Enter email"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        label="Email address"
        status={'success'}
        className='flex-col'
        errorMessage={inputStatus === 'error' ? 'Input cannot be empty' : ''}
      />
       <Input
        type="email"
        placeholder="Enter email"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        label="Email address"
        status={'error'}
        className='flex-col'
        errorMessage={inputStatus === 'error' ? 'Input cannot be empty' : ''}
      />
    </div>
    <div className="py-8">
      <h4>Enter Your Feedback:</h4>
      <Textarea
        label="Feedback"
        name="feedback"
        value={textareaValue}
        onChange={handleTextareaChange}
        placeholder="Write your feedback here..."
        rows={6}
        cols={50}
        status={status} // Controls the border color
        maxLength={200}
      />
    </div>
    </div>
    </>
  );
}
