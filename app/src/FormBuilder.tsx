import React, { useRef, useLayoutEffect, MutableRefObject } from 'react';
import { Builder } from 'tripetto';
import 'tripetto-block-text';

import { IDefinition } from 'tripetto-runner-foundation';
import { IAutoscrollController } from 'tripetto-runner-autoscroll';

interface BuilderProps {
  controller?: MutableRefObject<[IAutoscrollController | undefined]>;
}

const FormBuilder: React.FC<BuilderProps> = ({ controller }) => {
  const builderRef = useRef<Builder>();
  const elementRef = useRef<HTMLDivElement>(null);



  useLayoutEffect(() => {
    
    const formDefinition = {"name":"Test","clusters":[{"id":"158d68cf0f1ab34ca15e6847c0ee40fe0c727a3a3061ffcdcdf367637bcccc1f","nodes":[{"id":"a610392b2cdde7dbaccb75dae249757a0d7716e183c02e0cade8a1b61002bed3","name":"Test","nameVisible":true,"slots":[{"id":"8eeb905bfae8019d26ada8553364ebde4b3674f5bea7d73c2d427930d770206b","type":"text","kind":"static","reference":"value","label":"Text"}],"block":{"type":"tripetto-block-text","version":"5.0.0"}}]}],"builder":{"name":"tripetto","version":"4.0.1"}} as IDefinition;

    builderRef.current = Builder.open(formDefinition, {
      element: elementRef.current,
      zoom: 'fit-horizontal',
      disableLogo: true,
      disableCloseButton: true,
      disableTutorialButton: true,
      disableSaveButton: false,
      disableEditButton: true,
      disableOpenCloseAnimation: true,
      supportURL: false,
      onSave: (definition: IDefinition) => {
        console.log(definition);
      },
    });
  

    window.addEventListener('resize', () => {
      if (builderRef.current) builderRef.current.resize();
    });
    window.addEventListener('orientationchange', () => {
      if (builderRef.current) builderRef.current.resize();
    });
    
  }, [controller]);

  return <div ref={elementRef} id="builder"></div>;
};

export default FormBuilder;
