"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import WorkflowStep from './WorkflowStep';

interface Step {
  id: string;
  type: 'action' | 'condition';
  actionType?: string;
  action?: string;
  conditions?: { field: string; operator: string; value: string }[];
  operator?: 'AND' | 'OR';
  description: string;
}

export default function WorkflowBuilder({ workflowId, workflowName }) {
  const [steps, setSteps] = useState<Step[]>([]);

  const addStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      type: 'action',
      description: '',
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (updatedStep: Step) => {
    setSteps(steps.map(step => step.id === updatedStep.id ? updatedStep : step));
  };

  const moveStep = (dragIndex: number, hoverIndex: number) => {
    const dragStep = steps[dragIndex];
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps.splice(dragIndex, 1);
      newSteps.splice(hoverIndex, 0, dragStep);
      return newSteps;
    });
  };

  const addBranch = (parentId: string) => {
    const parentIndex = steps.findIndex(step => step.id === parentId);
    if (parentIndex !== -1) {
      const newStep: Step = {
        id: Date.now().toString(),
        type: 'action',
        description: '',
      };
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        newSteps.splice(parentIndex + 1, 0, newStep);
        return newSteps;
      });
    }
  };

  const renderSteps = () => {
    return steps.map((step, index) => (
      <WorkflowStep
        key={step.id}
        {...step}
        index={index}
        moveStep={moveStep}
        updateStep={updateStep}
        addBranch={addBranch}
        depth={0}
      />
    ));
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-2 text-foreground">{workflowName}</h2>
      <div className="space-y-1">
        {renderSteps()}
      </div>
      <Button onClick={addStep} variant="secondary" size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground compact-button">
        <Plus className="mr-1 h-3 w-3" /> Add Step
      </Button>
    </div>
  );
}