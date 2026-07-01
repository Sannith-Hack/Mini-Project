const API_URL = 'http://localhost:3001';
        let isLoginMode = true;
        let currentUser = null;\n            authToken = null;\n            localStorage.removeItem('token');\n            localStorage.removeItem('username');
        let authToken = null;
        let userChartInstance, adminChartInstance;

        // UI Helpers
        const showToast = (msg, isError = false) => {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.style.borderLeft = isError ? '4px solid #ef4444' : '4px solid #22c55e';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        };

        // Auth Toggle
        document.getElementById('toggleAuthMode').addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            document.getElementById('auth-title').textContent = isLoginMode ? 'Welcome Back' : 'Create Account';
            document.getElementById('auth-subtitle').textContent = isLoginMode ? 'Log in to track your mental wellness journey' : 'Join MindFlow to manage your student stress';
            document.getElementById('authBtn').textContent = isLoginMode ? 'Login' : 'Register';
            document.getElementById('toggleAuthMode').textContent = isLoginMode ? "Don't have an account? Register here." : "Already have an account? Login here.";
        });

        // Auth Submit
        document.getElementById('authForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('authBtn');
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if(!username || !password) return showToast('Please fill all fields', true);

            btn.disabled = true;
            btn.textContent = 'Processing...';

            const endpoint = isLoginMode ? '/login' : '/register';
            try {
                const res = await fetch(`${API_URL}/api/auth${endpoint}`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    showToast(data.message || 'Login successful!');
                    if(isLoginMode) {
                        currentUser = data.username;
                        authToken = data.token;\n                        localStorage.setItem('token', authToken);\n                        localStorage.setItem('username', currentUser);
                        document.getElementById('username').value = '';
                        document.getElementById('password').value = '';
                        initDashboard();
                    } else {
                        // Switch to login
                        document.getElementById('toggleAuthMode').click();
                    }
                } else {
                    showToast(data.error || 'Authentication failed', true);
                }
            } catch (err) {
                showToast('Server connection failed', true);
            } finally {
                btn.disabled = false;
                btn.textContent = isLoginMode ? 'Login' : 'Register';
            }
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            currentUser = null;\n            authToken = null;\n            localStorage.removeItem('token');\n            localStorage.removeItem('username');
            document.getElementById('dashboard-view').style.display = 'none';
            document.getElementById('auth-view').style.display = 'block';
            
            // Reset dashboard
            document.getElementById('result-box').style.display = 'none';
            document.getElementById('empty-state').style.display = 'block';
            if(userChartInstance) userChartInstance.destroy();
            document.getElementById('userChart').style.display = 'none';
        });

        // Init Dashboard
        function initDashboard() {
            document.getElementById('auth-view').style.display = 'none';
            document.getElementById('dashboard-view').style.display = 'flex';
            document.getElementById('welcomeMsg').textContent = `Welcome, ${currentUser}`;
            
            Chart.defaults.color = '#94a3b8';
            Chart.defaults.font.family = "'Outfit', sans-serif";
            
            loadHistory();
            loadGlobalStats();
        }

        // Assessment Submit
        document.getElementById('stressForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = "AI is Analyzing...";

            const payload = {
                name: currentUser, // Use logged-in user
                sleep: document.getElementById('sleep').value,
                study: document.getElementById('study').value,
                assignments: document.getElementById('assignments').value,
                mood: document.getElementById('mood').value
            };

            try {
                const res = await fetch(`${API_URL}/api/stress/submit`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(payload)
                });
                
                if (!res.ok) throw new Error('Server error');
                const result = await res.json();

                // Update UI
                document.getElementById('empty-state').style.display = 'none';
                const resultBox = document.getElementById('result-box');
                resultBox.style.display = 'block';
                
                const levelBadge = document.getElementById('stressLevel');
                levelBadge.textContent = `${result.level} STRESS`;
                levelBadge.className = `status-badge status-${result.level.toLowerCase()}`;
                
                document.getElementById('suggestionText').textContent = result.suggestion;
                
                // Keep raw level for PDF
                resultBox.dataset.rawLevel = result.level;

                renderUserChart(payload);
                loadHistory();
                loadGlobalStats();
                showToast('Analysis complete!');
                
                // Clear form except name
                document.getElementById('stressForm').reset();
                
            } catch (err) {
                showToast("Failed to get analysis. Server might be down.", true);
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });

        function renderUserChart(data) {
            const canvas = document.getElementById('userChart');
            canvas.style.display = 'block';
            const ctx = canvas.getContext('2d');
            
            if (userChartInstance) userChartInstance.destroy();
            
            userChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sleep (hrs)', 'Study (hrs)', 'Assignments'],
                    datasets: [{
                        label: 'Your Metrics',
                        data: [data.sleep, data.study, data.assignments],
                        backgroundColor: [
                            'rgba(167, 139, 250, 0.8)',
                            'rgba(96, 165, 250, 0.8)',
                            'rgba(251, 146, 60, 0.8)'
                        ],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        async function loadHistory() {
            try {
                const res = await fetch(`${API_URL}/api/stress/history`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                const data = await res.json();
                const list = document.getElementById('historyList');
                
                if (Array.isArray(data) && data.length > 0) {
                    list.innerHTML = data.map(h => {
                        const date = new Date(h.created_at).toLocaleDateString(undefined, { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
                        const lvlClass = `h-${h.stress_level.toLowerCase()}`;
                        const colorClass = h.stress_level === 'LOW' ? '#4ade80' : h.stress_level === 'MEDIUM' ? '#fbbf24' : '#f87171';
                        
                        return `
                        <div class="history-item ${lvlClass}">
                            <div>
                                <div class="history-date">${date}</div>
                                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
                                    Sleep: ${h.sleep}h | Study: ${h.study}h | Tasks: ${h.assignments}
                                </div>
                            </div>
                            <div class="history-level" style="color: ${colorClass};">${h.stress_level}</div>
                        </div>`;
                    }).join('');
                } else {
                    list.innerHTML = "<p style='color: var(--text-muted);'>No past assessments found.</p>";
                }
            } catch (err) {
                console.error("History loading failed:", err);
            }
        }

        async function loadGlobalStats() {
            try {
                const res = await fetch(`${API_URL}/api/stress/admin-stats`);
                const data = await res.json();
                
                const ctx = document.getElementById('adminChart').getContext('2d');
                if (adminChartInstance) adminChartInstance.destroy();
                
                // Handle empty state
                if(data.length === 0) return;

                const labels = data.map(d => d.stress_level);
                const counts = data.map(d => d.count);
                
                const colors = labels.map(l => {
                    if(l === 'LOW') return 'rgba(74, 222, 128, 0.8)';
                    if(l === 'MEDIUM') return 'rgba(251, 191, 36, 0.8)';
                    return 'rgba(248, 113, 113, 0.8)';
                });

                adminChartInstance = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: counts,
                            backgroundColor: colors,
                            borderWidth: 0,
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'right', labels: { boxWidth: 12, padding: 15 } }
                        },
                        cutout: '70%'
                    }
                });
            } catch (err) {
                console.error("Global stats failed:", err);
            }
        }

        // PDF Generation
        document.getElementById('downloadPdf').addEventListener('click', () => {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                const level = document.getElementById('result-box').dataset.rawLevel;
                const suggestion = document.getElementById('suggestionText').innerText;

                // Header
                doc.setFillColor(30, 27, 75); // Dark blue
                doc.rect(0, 0, 210, 45, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(24);
                doc.text("MindFlow AI Analysis Report", 20, 28);
                
                // User Info
                doc.setTextColor(40, 40, 40);
                doc.setFontSize(14);
                doc.setFont("helvetica", "normal");
                doc.text(`Generated for: ${currentUser}`, 20, 60);
                doc.text(`Date: ${new Date().toLocaleString()}`, 20, 70);
                
                doc.setDrawColor(200, 200, 200);
                doc.line(20, 80, 190, 80);

                // Result
                doc.setFontSize(16);
                doc.text("Assessment Status:", 20, 100);
                doc.setFont("helvetica", "bold");
                
                if(level === 'HIGH') doc.setTextColor(220, 38, 38);
                else if(level === 'MEDIUM') doc.setTextColor(217, 119, 6);
                else doc.setTextColor(22, 163, 74);
                
                doc.text(`${level} STRESS`, 80, 100);
                
                // Suggestion
                doc.setTextColor(40, 40, 40);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(14);
                doc.text("AI Counselor Advice:", 20, 120);
                
                doc.setFontSize(12);
                doc.setTextColor(80, 80, 80);
                const lines = doc.splitTextToSize(suggestion, 170);
                doc.text(lines, 20, 130);
                
                // Footer
                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text("This report is AI-generated and not a substitute for professional medical advice.", 20, 280);

                doc.save(`MindFlow_Report_${currentUser}.pdf`);
                showToast('PDF Downloaded successfully!');
            } catch(e) {
                console.error(e);
                showToast('Failed to generate PDF', true);
            }
        });
    
// Check local storage for session
window.addEventListener('DOMContentLoaded', () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('username');
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = savedUser;
        initDashboard();
    }
});