export default function AdminDashboard() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mission Control Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: #0a0a0a;
            color: #ffffff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow-x: hidden;
        }
        
        .dashboard {
            min-height: 100vh;
            display: grid;
            grid-template-areas: 
                "header header"
                "sidebar main";
            grid-template-rows: 60px 1fr;
            grid-template-columns: 280px 1fr;
        }
        
        .header {
            grid-area: header;
            background: #1a1a1a;
            border-bottom: 1px solid #333;
            display: flex;
            align-items: center;
            padding: 0 20px;
            justify-content: space-between;
        }
        
        .logo {
            font-size: 20px;
            font-weight: bold;
            color: #3b82f6;
        }
        
        .status {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
            animation: pulse 2s infinite;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin: 20px;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border: 1px solid #333;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            transition: transform 0.2s;
        }
        
        .metric-card:hover {
            transform: translateY(-2px);
            border-color: #3b82f6;
        }
        
        .metric-value {
            font-size: 32px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 8px;
        }
        
        .metric-label {
            color: #9ca3af;
            font-size: 14px;
        }
        
        .agent-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px;
        }
        
        .agent-card {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 20px;
        }
        
        .agent-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .agent-name {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
        }
        
        .agent-business {
            font-size: 12px;
            color: #9ca3af;
            text-transform: uppercase;
        }
        
        .agent-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
        }
        
        .status-online {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        .agent-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #3b82f6;
        }
        
        .stat-label {
            font-size: 11px;
            color: #9ca3af;
            text-transform: uppercase;
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.5;
                transform: scale(1.1);
            }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <header class="header">
            <div class="logo">⚡ Mission Control</div>
            <div class="status">
                <div class="status-dot"></div>
                <span>All Systems Online</span>
            </div>
        </header>
        
        <main style="padding: 20px;">
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">3</div>
                    <div class="metric-label">Active Agents</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">94.2%</div>
                    <div class="metric-label">Efficiency</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">847</div>
                    <div class="metric-label">Tasks Completed</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">$58.4K</div>
                    <div class="metric-label">Revenue Generated</div>
                </div>
            </div>
            
            <div class="agent-grid">
                <div class="agent-card">
                    <div class="agent-header">
                        <div>
                            <div class="agent-name">Scout</div>
                            <div class="agent-business">GFS</div>
                        </div>
                        <div class="agent-status">
                            <div class="status-online"></div>
                            <span>Online</span>
                        </div>
                    </div>
                    <div class="agent-stats">
                        <div class="stat">
                            <div class="stat-value">198</div>
                            <div class="stat-label">Tasks</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">96.1%</div>
                            <div class="stat-label">Efficiency</div>
                        </div>
                    </div>
                </div>
                
                <div class="agent-card">
                    <div class="agent-header">
                        <div>
                            <div class="agent-name">Writer</div>
                            <div class="agent-business">FEE</div>
                        </div>
                        <div class="agent-status">
                            <div class="status-online"></div>
                            <span>Online</span>
                        </div>
                    </div>
                    <div class="agent-stats">
                        <div class="stat">
                            <div class="stat-value">143</div>
                            <div class="stat-label">Tasks</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">89.7%</div>
                            <div class="stat-label">Efficiency</div>
                        </div>
                    </div>
                </div>
                
                <div class="agent-card">
                    <div class="agent-header">
                        <div>
                            <div class="agent-name">Optimizer</div>
                            <div class="agent-business">CLS</div>
                        </div>
                        <div class="agent-status">
                            <div class="status-online"></div>
                            <span>Online</span>
                        </div>
                    </div>
                    <div class="agent-stats">
                        <div class="stat">
                            <div class="stat-value">156</div>
                            <div class="stat-label">Tasks</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">94.2%</div>
                            <div class="stat-label">Efficiency</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`
    }} />
  );
}`