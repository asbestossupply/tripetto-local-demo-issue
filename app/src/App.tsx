import React, { useRef } from 'react';
import FormBuilder from './FormBuilder';
import { IAutoscrollController } from 'tripetto-runner-autoscroll';
import './App.css';

const App: React.FC = () => {
  const controllerRef = useRef<[IAutoscrollController | undefined]>([
    undefined,
  ]);

  return (
    <>
      <FormBuilder controller={controllerRef} />
    </>
  );
}

export default App;


