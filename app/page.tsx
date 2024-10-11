"use client"

import dynamic from 'next/dynamic';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const WorkflowDashboard = dynamic(() => import('../components/WorkflowDashboard'), { ssr: false });

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col min-h-screen">
        <header className="header py-2">
          <div className="container mx-auto px-4">
            <h1 className="text-xl font-bold">Advanced Multi-Workflow Builder</h1>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-4">
          <WorkflowDashboard />
        </main>
        <footer className="footer py-2 mt-4">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>&copy; 2023 Workflow Builder. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </DndProvider>
  );
}