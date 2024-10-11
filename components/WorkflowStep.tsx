"use client"

import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GripVertical, Plus, X } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

interface WorkflowStepProps {
  id: string;
  type: 'action' | 'condition';
  actionType?: string;
  action?: string;
  conditions?: { field: string; operator: string; value: string }[];
  operator?: 'AND' | 'OR';
  description: string;
  index: number;
  moveStep: (dragIndex: number, hoverIndex: number) => void;
  updateStep: (step: any) => void;
  addBranch: (parentId: string) => void;
  depth: number;
}

const actionTypes = ['Send Email', 'Update Record', 'Create Task', 'API Call'];

export default function WorkflowStep({ id, type, actionType, action, conditions, operator, description, index, moveStep, updateStep, addBranch, depth }: WorkflowStepProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'workflow-step',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveStep(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'workflow-step',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  const handleTypeChange = (value: 'action' | 'condition') => {
    updateStep({ ...{ id, type, actionType, action, conditions, operator, description }, type: value });
  };

  const handleActionTypeChange = (value: string) => {
    updateStep({ ...{ id, type, actionType, action, conditions, operator, description }, actionType: value });
  };

  const handleDescriptionChange = (value: string) => {
    updateStep({ ...{ id, type, actionType, action, conditions, operator, description }, description: value });
  };

  const renderActionContent = () => (
    <div className="space-y-1">
      <div className="flex space-x-1">
        <div className="flex-1">
          <Label htmlFor="actionType" className="text-xs">Type</Label>
          <Select value={actionType} onValueChange={handleActionTypeChange}>
            <SelectTrigger className="w-full compact-select">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {actionTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="action" className="text-xs">Details</Label>
          <Input
            id="action"
            value={action}
            onChange={(e) => updateStep({ ...{ id, type, actionType, action, conditions, operator, description }, action: e.target.value })}
            className="compact-input"
            placeholder="Action details"
          />
        </div>
      </div>
    </div>
  );

  const renderConditionContent = () => (
    <div className="space-y-1">
      <Label className="text-xs">Conditions</Label>
      {conditions?.map((condition, index) => (
        <div key={index} className="flex space-x-1">
          <Input
            value={condition.field}
            onChange={(e) => {
              const newConditions = [...conditions];
              newConditions[index].field = e.target.value;
              updateStep({ ...{ id, type, actionType, action, conditions: newConditions, operator, description } });
            }}
            placeholder="Field"
            className="flex-1 compact-input"
          />
          <Select
            value={condition.operator}
            onValueChange={(value) => {
              const newConditions = [...conditions];
              newConditions[index].operator = value;
              updateStep({ ...{ id, type, actionType, action, conditions: newConditions, operator, description } });
            }}
          >
            <SelectTrigger className="w-20 compact-select">
              <SelectValue placeholder="Op" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">=</SelectItem>
              <SelectItem value="not_equals">≠</SelectItem>
              <SelectItem value="greater_than">&gt;</SelectItem>
              <SelectItem value="less_than">&lt;</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={condition.value}
            onChange={(e) => {
              const newConditions = [...conditions];
              newConditions[index].value = e.target.value;
              updateStep({ ...{ id, type, actionType, action, conditions: newConditions, operator, description } });
            }}
            placeholder="Value"
            className="flex-1 compact-input"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 p-0"
            onClick={() => {
              const newConditions = conditions.filter((_, i) => i !== index);
              updateStep({ ...{ id, type, actionType, action, conditions: newConditions, operator, description } });
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="sm"
          className="compact-button flex-1"
          onClick={() => {
            const newConditions = [...(conditions || []), { field: '', operator: 'equals', value: '' }];
            updateStep({ ...{ id, type, actionType, action, conditions: newConditions, operator, description } });
          }}
        >
          <Plus className="mr-1 h-3 w-3" /> Add
        </Button>
        <Select
          value={operator}
          onValueChange={(value: 'AND' | 'OR') => updateStep({ ...{ id, type, actionType, action, conditions, operator: value, description } })}
        >
          <SelectTrigger className="w-20 compact-select">
            <SelectValue placeholder="AND/OR" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className={`ml-${depth * 2}`} ref={ref}>
      <Card 
        className="workflow-step bg-card text-card-foreground hover:shadow-md transition-shadow duration-200 mb-1" 
        style={{ opacity }} 
        data-handler-id={handlerId}
      >
        <CardContent className="p-2">
          <div className="flex items-center space-x-1 mb-1">
            <GripVertical className="text-muted-foreground cursor-move h-4 w-4" />
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-24 compact-select">
                <SelectValue placeholder="Step type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="condition">Condition</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="flex-1 compact-input"
              placeholder="Description"
            />
          </div>
          <div className="space-y-1">
            {type === 'action' ? renderActionContent() : renderConditionContent()}
          </div>
        </CardContent>
      </Card>
      {type === 'condition' && (
        <div className="ml-2 pl-2 border-l border-primary">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addBranch(id)}
            className="mt-1 compact-button"
          >
            <Plus className="mr-1 h-3 w-3" /> Branch
          </Button>
        </div>
      )}
    </div>
  );
}