"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import WorkflowBuilder from './WorkflowBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';

interface Workflow {
  id: string;
  name: string;
  steps: any[]; // Replace 'any' with a more specific type if available
}

export default function WorkflowDashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    { id: '1', name: 'Workflow 1', steps: [] },
    { id: '2', name: 'Workflow 2', steps: [] },
  ]);
  const [activeWorkflow, setActiveWorkflow] = useState<string>(workflows[0]?.id || '');
  const [newWorkflowName, setNewWorkflowName] = useState('');

  const addWorkflow = () => {
    if (newWorkflowName.trim()) {
      const newWorkflow: Workflow = {
        id: Date.now().toString(),
        name: newWorkflowName.trim(),
        steps: [],
      };
      setWorkflows([...workflows, newWorkflow]);
      setActiveWorkflow(newWorkflow.id);
      setNewWorkflowName('');
    }
  };

  const exportWorkflows = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflows));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "workflows.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importWorkflows = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedWorkflows = JSON.parse(e.target?.result as string);
          setWorkflows(importedWorkflows);
          setActiveWorkflow(importedWorkflows[0]?.id || '');
        } catch (error) {
          console.error("Error parsing imported workflows:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardContent className="p-4">
        <Tabs value={activeWorkflow} onValueChange={setActiveWorkflow} className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <TabsList className="bg-secondary rounded-md p-1">
              {workflows.map((workflow) => (
                <TabsTrigger
                  key={workflow.id}
                  value={workflow.id}
                  className="px-2 py-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {workflow.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex space-x-1">
              <Input
                type="text"
                placeholder="New workflow name"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                className="h-7 text-xs"
              />
              <Button onClick={addWorkflow} variant="secondary" size="sm" className="h-7 px-2 py-0 text-xs">
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
              <Button onClick={exportWorkflows} variant="outline" size="sm" className="h-7 px-2 py-0 text-xs">
                <Download className="h-3 w-3 mr-1" /> Export
              </Button>
              <Button onClick={() => document.getElementById('import-workflows')?.click()} variant="outline" size="sm" className="h-7 px-2 py-0 text-xs">
                <Upload className="h-3 w-3 mr-1" /> Import
              </Button>
              <input
                id="import-workflows"
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={importWorkflows}
              />
            </div>
          </div>
          {workflows.map((workflow) => (
            <TabsContent key={workflow.id} value={workflow.id} className="mt-4">
              <WorkflowBuilder workflowId={workflow.id} workflowName={workflow.name} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}