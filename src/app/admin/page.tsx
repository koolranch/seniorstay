'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  agent: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'inprogress' | 'review' | 'completed';
  business: 'GFS' | 'CLS' | 'FEE';
}

interface Agent {
  name: string;
  business: string;
  status: 'online' | 'offline';
  tasks: number;
  efficiency: number;
}

export default function MissionControlDashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Research Cleveland facilities', agent: 'Scout', priority: 'high', status: 'inprogress', business: 'GFS' },
    { id: '2', title: 'Write senior care guide content', agent: 'Writer', priority: 'medium', status: 'todo', business: 'GFS' },
    { id: '3', title: 'Optimize GFS facility pages for SEO', agent: 'Optimizer', priority: 'high', status: 'review', business: 'GFS' },
    { id: '4', title: 'Update Cleveland facility database', agent: 'Scout', priority: 'low', status: 'completed', business: 'GFS' },
  ]);
  
  const [agents, setAgents] = useState<Agent[]>([
    { name: 'Scout', business: 'GFS', status: 'online', tasks: 198, efficiency: 96.1 },
    { name: 'Writer', business: 'GFS', status: 'online', tasks: 143, efficiency: 89.7 },
    { name: 'Optimizer', business: 'GFS', status: 'online', tasks: 156, efficiency: 94.2 },
  ]);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Scout');
  const [selectedBusiness, setSelectedBusiness] = useState<'GFS' | 'CLS' | 'FEE'>('GFS');
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [activeView, setActiveView] = useState('overview');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        tasks: agent.tasks + Math.floor(Math.random() * 3),
        efficiency: Math.max(85, Math.min(100, agent.efficiency + (Math.random() - 0.5) * 2))
      })));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const createTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      agent: selectedAgent,
      priority: selectedPriority,
      status: 'todo',
      business: selectedBusiness
    };
    
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getBusinessColor = (business: string) => {
    switch (business) {
      case 'GFS': return '#10b981';
      default: return '#10b981'; // All current operations are GFS
    }
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      background: '#0a0a0a', 
      color: '#ffffff', 
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <header style={{
        background: '#1a1a1a',
        borderBottom: '1px solid #333',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
          ⚡ Mission Control
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            animation: 'pulse 2s infinite'
          }} />
          <span>All Systems Online</span>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: '#1a1a1a',
        borderBottom: '1px solid #333',
        padding: '0 24px',
        display: 'flex',
        gap: '32px'
      }}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'tasks', label: '📋 Task Board' },
          { id: 'agents', label: '🤖 Agents' },
          { id: 'create', label: '➕ Create Task' }
        ].map(nav => (
          <button
            key={nav.id}
            onClick={() => setActiveView(nav.id)}
            style={{
              background: 'none',
              border: 'none',
              color: activeView === nav.id ? '#3b82f6' : '#9ca3af',
              padding: '16px 0',
              cursor: 'pointer',
              borderBottom: activeView === nav.id ? '2px solid #3b82f6' : '2px solid transparent',
              fontSize: '14px'
            }}
          >
            {nav.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        {activeView === 'overview' && (
          <div>
            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                  {agents.filter(a => a.status === 'online').length}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>Active Agents</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                  {Math.round(agents.reduce((sum, a) => sum + a.efficiency, 0) / agents.length * 10) / 10}%
                </div>
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>Avg Efficiency</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                  {tasks.filter(t => t.status === 'completed').length + agents.reduce((sum, a) => sum + a.tasks, 0)}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>Tasks Completed</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                  ${Math.round((agents.reduce((sum, a) => sum + a.tasks, 0) * 58.4) / 847 * 10) / 10}K
                </div>
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>Revenue Generated</div>
              </div>
            </div>

            {/* Quick Task Stats */}
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h3 style={{ marginBottom: '16px', color: '#ffffff' }}>Task Status Distribution</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {[
                  { status: 'todo', label: 'To Do', count: getTasksByStatus('todo').length, color: '#6b7280' },
                  { status: 'inprogress', label: 'In Progress', count: getTasksByStatus('inprogress').length, color: '#3b82f6' },
                  { status: 'review', label: 'Review', count: getTasksByStatus('review').length, color: '#f59e0b' },
                  { status: 'completed', label: 'Completed', count: getTasksByStatus('completed').length, color: '#10b981' }
                ].map(stat => (
                  <div key={stat.status} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color, marginBottom: '4px' }}>
                      {stat.count}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'tasks' && (
          <div>
            <h2 style={{ marginBottom: '24px', color: '#ffffff' }}>Task Management Board</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px'
            }}>
              {[
                { status: 'todo', label: 'To Do', color: '#6b7280' },
                { status: 'inprogress', label: 'In Progress', color: '#3b82f6' },
                { status: 'review', label: 'Review', color: '#f59e0b' },
                { status: 'completed', label: 'Completed', color: '#10b981' }
              ].map(column => (
                <div key={column.status} style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '16px',
                  minHeight: '400px'
                }}>
                  <h3 style={{
                    color: column.color,
                    marginBottom: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {column.label}
                    <span style={{
                      background: column.color,
                      color: '#000',
                      borderRadius: '12px',
                      padding: '2px 6px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {getTasksByStatus(column.status as Task['status']).length}
                    </span>
                  </h3>
                  {getTasksByStatus(column.status as Task['status']).map(task => (
                    <div key={task.id} style={{
                      background: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = '#444';
                    }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{task.title}</div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0',
                            fontSize: '12px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{
                          background: getBusinessColor(task.business),
                          color: '#000',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          {task.business}
                        </span>
                        <span style={{
                          background: getPriorityColor(task.priority),
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          {task.priority}
                        </span>
                        <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                          {task.agent}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(['todo', 'inprogress', 'review', 'completed'] as const).map(status => (
                          status !== task.status && (
                            <button
                              key={status}
                              onClick={() => moveTask(task.id, status)}
                              style={{
                                background: '#374151',
                                border: 'none',
                                color: '#9ca3af',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                cursor: 'pointer'
                              }}
                            >
                              → {status}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'agents' && (
          <div>
            <h2 style={{ marginBottom: '24px', color: '#ffffff' }}>Agent Status</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {agents.map(agent => (
                <div key={agent.name} style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>
                        {agent.business}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        background: agent.status === 'online' ? '#10b981' : '#ef4444',
                        borderRadius: '50%',
                        animation: agent.status === 'online' ? 'pulse 2s infinite' : 'none'
                      }} />
                      <span style={{ textTransform: 'capitalize' }}>{agent.status}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                        {agent.tasks}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>
                        Tasks
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                        {agent.efficiency.toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>
                        Efficiency
                      </div>
                    </div>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#333',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginTop: '12px'
                  }}>
                    <div style={{
                      height: '100%',
                      background: `linear-gradient(90deg, #10b981, #3b82f6)`,
                      borderRadius: '3px',
                      width: `${agent.efficiency}%`,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'create' && (
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '24px', color: '#ffffff' }}>Create New Task</h2>
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task description..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                    Agent
                  </label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Scout">Scout (GFS)</option>
                    <option value="Writer">Writer (GFS)</option>
                    <option value="Optimizer">Optimizer (GFS)</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                    Business
                  </label>
                  <select
                    value={selectedBusiness}
                    onChange={(e) => setSelectedBusiness(e.target.value as 'GFS' | 'CLS' | 'FEE')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '14px'
                    }}
                  >
                    <option value="GFS">GFS (Guide for Seniors)</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                    Priority
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as 'high' | 'medium' | 'low')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '14px'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={createTask}
                disabled={!newTaskTitle.trim()}
                style={{
                  background: newTaskTitle.trim() ? '#3b82f6' : '#374151',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: newTaskTitle.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                Create Task
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}