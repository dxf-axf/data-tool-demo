const chartConfig = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Daily Sales',
      data: [1220, 1380, 1178, 1450, 1506, 1320, 1245],
      borderColor: 'rgb(0, 84, 166)',
      backgroundColor: 'rgba(0, 84, 166, 0.1)',
      tension: 0.4,
      fill: true
    }
  ],
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        cornerRadius: 4,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `Sales: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `¥${value}`;
          }
        }
      }
    }
  }
};

/*
 * Safetrack Premium – Main JavaScript
 * Version: 1.0.0
 * Description: Controls all interactive elements of the Safetrack Premium dashboard
 */

document.addEventListener('DOMContentLoaded', function () {
  // App State
  const APP_STATE = {
    isDarkMode: localStorage.getItem('safetrack_darkMode') === 'true' || false,
    isSidebarCollapsed: localStorage.getItem('safetrack_sidebarCollapsed') === 'true' || false,
    isSidebarOpen: true,
    currentSection: 'dashboard',
    charts: {}
  };
});


    // Initialize Application
    initApp();

    function initApp() {
        // Initialize theme
        setThemeMode(APP_STATE.isDarkMode);
        
        // Initialize sidebar state
        setSidebarState(APP_STATE.isSidebarCollapsed);
        
        // Set current date
        updateCurrentDate();
        
        // Initialize navigation
        initNavigation();
        
        // Initialize interactive elements
        initInteractiveElements();
        
        // Initialize charts
        initCharts();
        
        // Show tutorial for first time visitors (after a small delay)
        if (!localStorage.getItem('safetrack_tutorialSeen')) {
            setTimeout(() => {
                const tutorialOverlay = document.getElementById('tutorial-overlay');
                if (tutorialOverlay) {
                    tutorialOverlay.style.display = 'flex';
                }
            }, 1000);
        }
        
        // Remove loading overlay with animation
        setTimeout(() => {
            const loadingOverlay = document.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }
        }, 500);
    }

    function updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    function setThemeMode(isDark) {
        const themeSwitch = document.getElementById('theme-switch');
        if (isDark) {
            document.body.classList.add('dark-mode');
            if (themeSwitch) {
                themeSwitch.checked = true;
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (themeSwitch) {
                themeSwitch.checked = false;
            }
        }
        localStorage.setItem('safetrack_darkMode', isDark);
        APP_STATE.isDarkMode = isDark;
    }

    function setSidebarState(isCollapsed) {
        if (isCollapsed) {
            document.body.classList.add('sidebar-collapsed');
        } else {
            document.body.classList.remove('sidebar-collapsed');
        }
        localStorage.setItem('safetrack_sidebarCollapsed', isCollapsed);
        APP_STATE.isSidebarCollapsed = isCollapsed;
    }

    function toggleSidebar() {
        if (window.innerWidth < 992) {
            // Mobile mode: show/hide sidebar
            document.body.classList.toggle('sidebar-open');
            APP_STATE.isSidebarOpen = document.body.classList.contains('sidebar-open');
        } else {
            // Desktop mode: expand/collapse sidebar
            setSidebarState(!APP_STATE.isSidebarCollapsed);
        }
    }

    function navigateTo(sectionId) {
        // Update active state in navigation
        document.querySelectorAll('.nav-menu li').forEach(item => {
            if (item.getAttribute('data-target') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show/hide content sections
        document.querySelectorAll('.content-section').forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                
                // Update breadcrumb
                const breadcrumb = document.querySelector('.breadcrumb ol');
                if (breadcrumb) {
                    breadcrumb.innerHTML = `
                        <li><a href="#">Home</a></li>
                        <li><a href="#" aria-current="page">${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}</a></li>
                    `;
                }
                
                // Refresh charts in this section if needed
                refreshSectionCharts(sectionId);
            } else {
                section.classList.remove('active');
            }
        });
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 992 && APP_STATE.isSidebarOpen) {
            document.body.classList.remove('sidebar-open');
            APP_STATE.isSidebarOpen = false;
        }
        
        // Update app state
        APP_STATE.currentSection = sectionId;
    }
    
    function refreshSectionCharts(sectionId) {
        // Get all charts in this section and refresh them
        const chartContainers = document.querySelectorAll(`#${sectionId} .chart-container canvas`);
        chartContainers.forEach(canvas => {
            const chartId = canvas.id;
            if (chartId && APP_STATE.charts[chartId]) {
                APP_STATE.charts[chartId].update();
            }
        });
    }

    function initNavigation() {
        // Navigation menu click event
        document.querySelectorAll('.nav-menu li').forEach(item => {
            item.addEventListener('click', function() {
                const targetSection = this.getAttribute('data-target');
                if (targetSection) {
                    navigateTo(targetSection);
                }
            });
        });
        
        // Menu toggle button
        const menuToggleBtn = document.querySelector('.menu-toggle');
        if (menuToggleBtn) {
            menuToggleBtn.addEventListener('click', toggleSidebar);
        }
        
        // Set initial active section
        navigateTo(APP_STATE.currentSection);
        
        // Keyboard shortcuts for navigation
        document.addEventListener('keydown', function(e) {
            // Alt + number for navigation
            if (e.altKey && !isNaN(e.key) && e.key >= 1 && e.key <= 9) {
                const navItems = document.querySelectorAll('.nav-menu li[data-shortcut]');
                navItems.forEach(item => {
                    const shortcut = item.getAttribute('data-shortcut');
                    if (shortcut === `Alt+${e.key}`) {
                        item.click();
                    }
                });
            }
            
            // Cmd/Ctrl + K for search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-bar input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Cmd/Ctrl + / for keyboard shortcuts modal
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault();
                toggleShortcutsModal();
            }
        });
        
        // Add recently visited items clicks
        document.querySelectorAll('.recent-links li').forEach(item => {
            item.addEventListener('click', function() {
                // This would normally navigate to a specific page or section
                // For demo, just show a message
                showToast('Navigating to recently visited item');
            });
        });
    }

    function initInteractiveElements() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-switch');
        if (themeToggle) {
            themeToggle.addEventListener('change', function() {
                setThemeMode(this.checked);
            });
        }
        
        // Tabs functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const targetId = this.getAttribute('data-tab');
                const tabContainer = this.closest('.tabs-container');
                
                if (targetId && tabContainer) {
                    // Update active tab
                    tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show target content
                    tabContainer.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                        if (content.id === targetId) {
                            content.classList.add('active');
                        }
                    });
                }
            });
        });
        
        // Tutorial overlay
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        if (tutorialOverlay) {
            // Close button
            const closeButton = tutorialOverlay.querySelector('.close-tutorial');
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    tutorialOverlay.style.display = 'none';
                    localStorage.setItem('safetrack_tutorialSeen', 'true');
                });
            }
            
            // Skip button
            const skipButton = tutorialOverlay.querySelector('.btn-secondary');
            if (skipButton) {
                skipButton.addEventListener('click', function() {
                    tutorialOverlay.style.display = 'none';
                    localStorage.setItem('safetrack_tutorialSeen', 'true');
                });
            }
            
            // Start tour button
            const startTourButton = tutorialOverlay.querySelector('.btn-primary');
            if (startTourButton) {
                startTourButton.addEventListener('click', function() {
                    tutorialOverlay.style.display = 'none';
                    localStorage.setItem('safetrack_tutorialSeen', 'true');
                    startGuidedTour();
                });
            }
        }
        
        // Shortcuts modal
        const shortcutsModal = document.getElementById('keyboard-shortcuts-modal');
        if (shortcutsModal) {
            shortcutsModal.querySelectorAll('.close-modal').forEach(btn => {
                btn.addEventListener('click', function() {
                    shortcutsModal.style.display = 'none';
                });
            });
        }
        
        // Dashboard date range selector
        const dateRangeButtons = document.querySelectorAll('.date-range-selector button');
        dateRangeButtons.forEach(button => {
            button.addEventListener('click', function() {
                dateRangeButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                updateDashboardData(this.textContent.trim().toLowerCase());
            });
        });
        
        // AI Assistant chat
        initAIAssistant();
        
        // Make dashboard cards draggable
        initDraggableCards();
    }
    
    function toggleShortcutsModal() {
        const modal = document.getElementById('keyboard-shortcuts-modal');
        if (modal) {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
            } else {
                modal.style.display = 'flex';
            }
        }
    }
    
    function startGuidedTour() {
        // This would normally start a step-by-step guided tour
        // For demo, just show a message
        showToast('Guided tour started');
    }
    
    function updateDashboardData(timeRange) {
        // Simulate data update
        let salesData;
        
        switch(timeRange) {
            case 'today':
                salesData = {
                    today: '$1,245.80',
                    week: '$8,762.45',
                    month: '$36,295.12',
                    todayChange: '+5.2%',
                    weekChange: '+3.7%',
                    monthChange: '+8.1%'
                };
                break;
                
            case 'week':
                salesData = {
                    today: '$8,762.45',
                    week: '$35,419.78',
                    month: '$142,386.51',
                    todayChange: '+3.7%',
                    weekChange: '+4.2%',
                    monthChange: '+6.8%'
                };
                break;
                
            case 'month':
                salesData = {
                    today: '$36,295.12',
                    week: '$142,386.51',
                    month: '$425,782.65',
                    todayChange: '+8.1%',
                    weekChange: '+6.8%',
                    monthChange: '+5.4%'
                };
                break;
                
            case 'custom':
                // Show date picker
                showToast('Date picker would appear here');
                return;
        }
        
        // Update metrics on dashboard
        if (salesData) {
            document.querySelectorAll('.metrics-row .metric-item').forEach((item) => {
                const metricLabel = item.querySelector('.metric-label');
                if (metricLabel) {
                    const label = metricLabel.textContent.toLowerCase();
                    const metricValue = item.querySelector('.metric-value');
                    const metricChange = item.querySelector('.metric-change');
                    
                    if (label.includes('today') && metricValue && metricChange) {
                        metricValue.textContent = salesData.today;
                        metricChange.textContent = salesData.todayChange;
                    } else if (label.includes('week') && metricValue && metricChange) {
                        metricValue.textContent = salesData.week;
                        metricChange.textContent = salesData.weekChange;
                    } else if (label.includes('month') && metricValue && metricChange) {
                        metricValue.textContent = salesData.month;
                        metricChange.textContent = salesData.monthChange;
                    }
                }
            });
        }
        
        // Update charts
        updateChartData(timeRange);
        
        // Show data loading indicator
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                
                // Update last updated time
                const lastUpdated = document.querySelector('.last-updated');
                if (lastUpdated) {
                    const now = new Date();
                    lastUpdated.textContent = `Last updated: Today at ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
                }
                
                // Show success message
                showToast(`Dashboard updated to show ${timeRange} data`);
            }, 800);
        }
    }
    
    function updateChartData(timeRange) {
        // Update sales trend chart
        if (APP_STATE.charts.salesTrendChart) {
            let labels, data;
            
            switch(timeRange) {
                case 'today':
                    labels = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'];
                    data = [120, 245, 380, 210, 180, 240, 150];
                    break;
                    
                case 'week':
                    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    data = [1220, 1380, 1170, 1450, 1560, 1320, 1245];
                    break;
                    
                case 'month':
                    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                    data = [8450, 9370, 8920, 9560];
                    break;
                    
                default:
                    return;
            }
            
            APP_STATE.charts.salesTrendChart.data.labels = labels;
            APP_STATE.charts.salesTrendChart.data.datasets[0].data = data;
            APP_STATE.charts.salesTrendChart.update();
        }
        
        // Update other charts as needed
    }
    
    function initAIAssistant() {
        const chatInput = document.querySelector('.chat-input');
        const sendButton = document.querySelector('.chat-send');
        const chatMessages = document.querySelector('.chat-messages');
        const suggestionChips = document.querySelectorAll('.suggestion-chips .chip');
        
        // Send message when clicking send button
        if (sendButton && chatInput) {
            sendButton.addEventListener('click', function() {
                sendMessage();
            });
        }
        
        // Send message when pressing Enter in input
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
        
        // Handle suggestion chips
        if (suggestionChips) {
            suggestionChips.forEach(chip => {
                chip.addEventListener('click', function() {
                    if (chatInput) {
                        chatInput.value = this.textContent;
                        sendMessage();
                    }
                });
            });
        }
        
        // Handle insight actions
        document.querySelectorAll('.insight-actions button').forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent.trim();
                const insightCard = this.closest('.insight-card');
                
                if (action === 'Dismiss' && insightCard) {
                    // Remove the insight card with animation
                    insightCard.style.opacity = '0';
                    setTimeout(() => {
                        insightCard.style.display = 'none';
                    }, 300);
                } else {
                    // Handle other actions
                    showToast(`Executing action: ${action}`);
                }
            });
        });
        
        function sendMessage() {
            if (!chatInput || !chatInput.value.trim() || !chatMessages) return;
            
            // Add user message
            addMessage('user', chatInput.value);
            
            // Save the message and clear input
            const userMessage = chatInput.value;
            chatInput.value = '';
            
            // Show thinking indicator
            addMessage('assistant', '<div class="typing-indicator"><span></span><span></span><span></span></div>', false);
            
            // Simulate AI response after a delay
            setTimeout(() => {
                // Remove thinking indicator
                const typingIndicator = document.querySelector('.typing-indicator');
                if (typingIndicator && typingIndicator.parentElement && typingIndicator.parentElement.parentElement) {
                    typingIndicator.parentElement.parentElement.remove();
                }
                
                // Process the message and generate a response
                processAIQuery(userMessage);
            }, 1500);
        }
        
        function addMessage(type, content, scrollToBottom = true) {
            if (!chatMessages) return;
            
            const messageHTML = createMessageHTML(type, content);
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
            
            if (scrollToBottom) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
        
        function createMessageHTML(type, content) {
            if (type === 'user') {
                return `
                    <div class="message user">
                        <div class="message-avatar">YO</div>
                        <div class="message-bubble">
                            <p>${content}</p>
                        </div>
                    </div>
                `;
            } else if (type === 'assistant') {
                return `
                    <div class="message assistant">
                        <div class="message-avatar">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,14.09 4.8,16 6.11,17.41L9.88,9.88L17.41,6.11C16,4.8 14.09,4 12,4M12,20A8,8 0 0,0 20,12C20,9.91 19.2,8 17.89,6.59L14.12,14.12L6.59,17.89C8,19.2 9.91,20 12,20M12,12L11.23,11.23L9.7,14.3L12.77,12.77L12,12M12,12L12.77,12.77L15.3,10.7L12.23,9.23L12,12Z" /></svg>
                        </div>
                        <div class="message-bubble">
                            ${content}
                        </div>
                    </div>
                `;
            } else if (type === 'system') {
                return `
                    <div class="message system">
                        <div class="message-content">
                            <p>${content}</p>
                        </div>
                    </div>
                `;
            }
            
            return ''; // Default empty string if no matching type
        }
        
        function processAIQuery(query) {
            if (!query) return;
            
            query = query.toLowerCase();
            let response = '';
            
            // Simple pattern matching for demo
            if (query.includes('sales') || query.includes('revenue')) {
                response = `
                    <p>Here's a summary of your sales performance:</p>
                    <ul>
                        <li>Today: $1,245.80 (↑5.2% from yesterday)</li>
                        <li>This Week: $8,762.45 (↑3.7% from last week)</li>
                        <li>This Month: $36,295.12 (↑8.1% from last month)</li>
                    </ul>
                    <p>Your top selling category this month is Burgers (34.3% of total revenue), followed by Fries (20.0%) and Shakes (15.0%).</p>
                    <p>Would you like to see a detailed breakdown or forecasts for next month?</p>
                `;
                
                // Add chart visualization after a small delay
                setTimeout(() => {
                    addMessage('assistant', `
                        <div class="visualization-container">
                            <h4>Monthly Sales Trend (Past 6 Months)</h4>
                            <div class="chart-placeholder">
                                <canvas id="ai-sales-chart"></canvas>
                            </div>
                        </div>
                    `);
                    
                    // Initialize chart
                    const ctx = document.getElementById('ai-sales-chart');
                    if (ctx) {
                        new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
                                datasets: [{
                                    label: 'Revenue ($)',
                                    data: [32450, 30980, 33570, 34120, 33570, 36295],
                                    borderColor: '#0054a6',
                                    backgroundColor: 'rgba(0, 84, 166, 0.1)',
                                    tension: 0.4,
                                    fill: true
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: false
                                    }
                                }
                            }
                        });
                    }
                }, 500);
            }
            else if (query.includes('inventory') || query.includes('stock')) {
                response = `
                    <p>Here's your current inventory status:</p>
                    <ul>
                        <li><strong class="text-danger">Critical (1 item):</strong> Vegetarian Patties - Out of stock</li>
                        <li><strong class="text-warning">Low Stock (3 items):</strong> Burger Buns (15%), Cheese Slices (20%), Soda Cups (25%)</li>
                        <li><strong class="text-success">Healthy Stock (120 items)</strong></li>
                    </ul>
                    <p>Based on your current sales trends, I recommend placing orders for the following items:</p>
                    <ol>
                        <li>Vegetarian Patties - 40 units (urgent)</li>
                        <li>Burger Buns - 45 packs</li>
                        <li>Cheese Slices - 35 packs</li>
                    </ol>
                    <p>Would you like me to prepare an order request for your approval?</p>
                `;
            }
            else if (query.includes('staff') || query.includes('employee')) {
                response = `
                    <p>Your staff overview:</p>
                    <ul>
                        <li>Total Staff: 14 employees</li>
                        <li>Currently On Duty: 7 employees</li>
                        <li>Next Shift Change: 2:00 PM (in 3 hours)</li>
                    </ul>
                    <p><strong>Certification Status:</strong></p>
                    <ul>
                        <li><span class="text-warning">⚠️ Expiring Soon (2):</span> John Doe (7 days), Maria Garcia (14 days)</li>
                        <li><span class="text-success">✓ Valid (26 certifications)</span></li>
                    </ul>
                    <p>Would you like me to send reminder emails to staff with expiring certifications?</p>
                `;
            }
            else if (query.includes('compliance') || query.includes('certification')) {
                response = `
                    <p>Compliance status overview:</p>
                    <ul>
                        <li><strong>Overall Compliance Score:</strong> 96% <span class="positive">(↑4% from last month)</span></li>
                        <li><strong>Staff Certifications:</strong> 93% compliant (2 expiring soon)</li>
                        <li><strong>Inspections:</strong> Health inspection due in 6 days</li>
                        <li><strong>Action Required:</strong> Fire safety inspection is overdue by 5 days</li>
                    </ul>
                    <p><strong>Recommended Actions:</strong></p>
                    <ol>
                        <li>Schedule fire safety inspection immediately</li>
                        <li>Send certification renewal reminders to John Doe and Maria Garcia</li>
                        <li>Prepare for health inspection (cleaning checklist is available)</li>
                    </ol>
                    <p>Would you like me to help schedule the fire safety inspection?</p>
                `;
            }
            else {
                response = `
                    <p>I'm here to help you with managing Soley's Fast Food restaurant. You can ask me about:</p>
                    <ul>
                        <li>Sales performance and trends</li>
                        <li>Inventory status and ordering recommendations</li>
                        <li>Staff management and scheduling</li>
                        <li>Compliance and certification tracking</li>
                        <li>Data analysis and custom reports</li>
                    </ul>
                    <p>What information would you like to know about your restaurant today?</p>
                `;
            }
            
            // Add response to chat
            addMessage('assistant', response);
        }
    }
    
    function initDraggableCards() {
        // This would normally use a library like SortableJS
        // For demo, just add a class to show it's draggable
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        dashboardCards.forEach(card => {
            card.classList.add('draggable');
            
            // Add drag handle to card headers
            const cardHeader = card.querySelector('.card-header');
            if (cardHeader) {
                cardHeader.style.cursor = 'move';
                
                // Show movement on mousedown for demo
                cardHeader.addEventListener('mousedown', function(e) {
                    if (e.target === cardHeader || e.target.parentNode === cardHeader) {
                        card.style.boxShadow = 'var(--shadow-xl)';
                        card.style.transform = 'scale(1.02)';
                        
                        // Reset after mouseup
                        document.addEventListener('mouseup', function resetCard() {
                            card.style.boxShadow = '';
                            card.style.transform = '';
                            document.removeEventListener('mouseup', resetCard);
                        });
                    }
                });
            }
        });
        
        // Save/Reset layout buttons
        const saveLayoutBtn = document.querySelector('.dashboard-actions button:first-child');
        const resetLayoutBtn = document.querySelector('.dashboard-actions button:last-child');
        
        if (saveLayoutBtn) {
            saveLayoutBtn.addEventListener('click', function() {
                showToast('Dashboard layout saved');
            });
        }
        
        if (resetLayoutBtn) {
            resetLayoutBtn.addEventListener('click', function() {
                showToast('Dashboard layout reset to default');
            });
        }
    }
    
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
            
            // Add styles
            toast.style.position = 'fixed';
            toast.style.bottom = '24px';
            toast.style.right = '24px';
            toast.style.background = 'var(--bg-card)';
            toast.style.color = 'var(--text-primary)';
            toast.style.padding = '12px 16px';
            toast.style.borderRadius = '8px';
            toast.style.boxShadow = 'var(--shadow-lg)';
            toast.style.zIndex = '9999';
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            toast.style.border = '1px solid var(--border-color)';
            toast.style.fontSize = '0.875rem';
        }
        
        // Set message and show toast
        toast.textContent = message;
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
        
        // Hide toast after 3 seconds
        clearTimeout(toast.timeout);
        toast.timeout = setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
        }, 3000);
    }

    function initCharts() {
      // Sales Trend Chart
      const salesTrendCtx = document.getElementById('sales-trend-chart');
      if (salesTrendCtx) {
          APP_STATE.charts.salesTrendChart = new Chart(salesTrendCtx, {
              type: 'line',
              data: {
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [{
                      label: 'Daily Sales',
                      data: [1220, 1380, 1170, 1450, 1560, 1320, 1245],
                      borderColor: 'rgb(0, 84, 166)',
                      backgroundColor: 'rgba(0, 84, 166, 0.1)',
                      tension: 0.4,
                      fill: true
                  }]
              },
              options: {
                  scales: {
                      y: {
                          grid: {
                              color: 'rgba(0, 0, 0, 0.05)'
                          }
                      },
                      x: {
                          grid: {
                              display: false
                          }
                      }
                  },
                  interaction: {
                      intersect: false,
                      mode: 'index'
                  }
              }
          });
      }
  }
        
        // Category Performance Chart
const categoryChartCtx = document.getElementById('category-performance-chart');
if (categoryChartCtx) {
    APP_STATE.charts.categoryChart = new Chart(categoryChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Burgers', 'Fries', 'Shakes', 'Pizza', 'Other'],
            datasets: [{
                data: [12458, 7259, 5444, 4718, 6415],
                backgroundColor: [
                    'rgb(0, 84, 166)',      // Primary
                    'rgb(255, 167, 0)',     // Secondary
                    'rgb(23, 162, 184)',    // Info
                    'rgb(40, 167, 69)',     // Success
                    'rgb(108, 117, 125)'    // Gray
                ],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 10,
                    cornerRadius: 4,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `$${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '70%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}
        
        // AI Comparison Chart
        const aiComparisonChartCtx = document.getElementById('ai-comparison-chart');
        if (aiComparisonChartCtx) {
            try {
                new Chart(aiComparisonChartCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Double Cheeseburger', 'Loaded Fries', 'Chocolate Shake', 'Pepperoni Pizza', 'Chicken Burger'],
                        datasets: [
                            {
                                label: 'This Week',
                                data: [432, 367, 298, 278, 265],
                                backgroundColor: 'rgba(0, 84, 166, 0.8)',
                                barPercentage: 0.6,
                                categoryPercentage: 0.7
                            },
                            {
                                label: 'Last Week',
                                data: [410, 340, 290, 284, 236],
                                backgroundColor: 'rgba(0, 84, 166, 0.3)',
                                barPercentage: 0.6,
                                categoryPercentage: 0.7
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.05)'
                                }
                            },
                            y: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error("Error initializing AI comparison chart:", error);
            }
        }
        
        // Compliance Chart (SVG)
const complianceChart = document.querySelector('.compliance-circle');
if (complianceChart) {
    // Animate the compliance score fill
    setTimeout(() => {
        complianceChart.style.strokeDasharray = '96, 100';
    }, 500);
}
/**
 * Safetrack Premium - Main JavaScript
 * Version: 1.0.0
 * Description: Controls all interactive elements of the Safetrack Premium dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
  // App State
  const APP_STATE = {
      isDarkMode: localStorage.getItem('safetrack_darkMode') === 'true' || false,
      isSidebarCollapsed: localStorage.getItem('safetrack_sidebarCollapsed') === 'true' || false,
      isSidebarOpen: true,
      currentSection: 'dashboard',
      charts: {}
  };
  
  // Initialize the app (would call functions here)
});

    // Initialize Application
    initApp();

    function initApp() {
        // Initialize theme
        setThemeMode(APP_STATE.isDarkMode);
        
        // Initialize sidebar state
        setSidebarState(APP_STATE.isSidebarCollapsed);
        
        // Set current date
        updateCurrentDate();
        
        // Initialize navigation
        initNavigation();
        
        // Initialize interactive elements
        initInteractiveElements();
        
        // Initialize charts
        initCharts();
        
        // Show tutorial for first time visitors (after a small delay)
        if (!localStorage.getItem('safetrack_tutorialSeen')) {
            setTimeout(() => {
                const tutorialOverlay = document.getElementById('tutorial-overlay');
                if (tutorialOverlay) {
                    tutorialOverlay.style.display = 'flex';
                }
            }, 1000);
        }
        
        // Remove loading overlay with animation
        setTimeout(() => {
            const loadingOverlay = document.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }
        }, 500);
    }

    function updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    function setThemeMode(isDark) {
        const themeSwitch = document.getElementById('theme-switch');
        if (isDark) {
            document.body.classList.add('dark-mode');
            if (themeSwitch) {
                themeSwitch.checked = true;
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (themeSwitch) {
                themeSwitch.checked = false;
            }
        }
        localStorage.setItem('safetrack_darkMode', isDark);
        APP_STATE.isDarkMode = isDark;
    }

    function setSidebarState(isCollapsed) {
        if (isCollapsed) {
            document.body.classList.add('sidebar-collapsed');
        } else {
            document.body.classList.remove('sidebar-collapsed');
        }
        localStorage.setItem('safetrack_sidebarCollapsed', isCollapsed);
        APP_STATE.isSidebarCollapsed = isCollapsed;
    }

    function toggleSidebar() {
        if (window.innerWidth < 992) {
            // Mobile mode: show/hide sidebar
            document.body.classList.toggle('sidebar-open');
            APP_STATE.isSidebarOpen = document.body.classList.contains('sidebar-open');
        } else {
            // Desktop mode: expand/collapse sidebar
            setSidebarState(!APP_STATE.isSidebarCollapsed);
        }
    }

    function navigateTo(sectionId) {
        // Update active state in navigation
        document.querySelectorAll('.nav-menu li').forEach(item => {
            if (item.getAttribute('data-target') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show/hide content sections
        document.querySelectorAll('.content-section').forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                
                // Update breadcrumb
                const breadcrumb = document.querySelector('.breadcrumb ol');
                if (breadcrumb) {
                    breadcrumb.innerHTML = `
                        <li><a href="#">Home</a></li>
                        <li><a href="#" aria-current="page">${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}</a></li>
                    `;
                }
                
                // Refresh charts in this section if needed
                refreshSectionCharts(sectionId);
            } else {
                section.classList.remove('active');
            }
        });
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 992 && APP_STATE.isSidebarOpen) {
            document.body.classList.remove('sidebar-open');
            APP_STATE.isSidebarOpen = false;
        }
        
        // Update app state
        APP_STATE.currentSection = sectionId;
    }
    
    function refreshSectionCharts(sectionId) {
        // Get all charts in this section and refresh them
        const chartContainers = document.querySelectorAll(`#${sectionId} .chart-container canvas`);
        chartContainers.forEach(canvas => {
            const chartId = canvas.id;
            if (chartId && APP_STATE.charts[chartId]) {
                APP_STATE.charts[chartId].update();
            }
        });
    }

    function initNavigation() {
        // Navigation menu click event
        document.querySelectorAll('.nav-menu li').forEach(item => {
            item.addEventListener('click', function() {
                const targetSection = this.getAttribute('data-target');
                if (targetSection) {
                    navigateTo(targetSection);
                }
            });
        });
        
        // Menu toggle button
        const menuToggleBtn = document.querySelector('.menu-toggle');
        if (menuToggleBtn) {
            menuToggleBtn.addEventListener('click', toggleSidebar);
        }
        
        // Set initial active section
        navigateTo(APP_STATE.currentSection);
        
        // Keyboard shortcuts for navigation
        document.addEventListener('keydown', function(e) {
            // Alt + number for navigation
            if (e.altKey && !isNaN(e.key) && e.key >= 1 && e.key <= 9) {
                const navItems = document.querySelectorAll('.nav-menu li[data-shortcut]');
                navItems.forEach(item => {
                    const shortcut = item.getAttribute('data-shortcut');
                    if (shortcut === `Alt+${e.key}`) {
                        item.click();
                    }
                });
            }
            
            // Cmd/Ctrl + K for search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-bar input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Cmd/Ctrl + / for keyboard shortcuts modal
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault();
                toggleShortcutsModal();
            }
        });
        
        // Add recently visited items clicks
        document.querySelectorAll('.recent-links li').forEach(item => {
            item.addEventListener('click', function() {
                // This would normally navigate to a specific page or section
                // For demo, just show a message
                showToast('Navigating to recently visited item');
            });
        });
    }

    function initInteractiveElements() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-switch');
        if (themeToggle) {
            themeToggle.addEventListener('change', function() {
                setThemeMode(this.checked);
            });
        }
        
        // Tabs functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const targetId = this.getAttribute('data-tab');
                const tabContainer = this.closest('.tabs-container');
                
                if (targetId && tabContainer) {
                    // Update active tab
                    tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show target content
                    tabContainer.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                        if (content.id === targetId) {
                            content.classList.add('active');
                        }
                    });
                }
            });
        });
        
        // Tutorial overlay
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        if (tutorialOverlay) {
            // Close button
            const closeButton = tutorialOverlay.querySelector('.close-tutorial');
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    tutorialOverlay.style.display = 'none';
                    localStorage.setItem('safetrack_tutorialSeen', 'true');
                });
            }
            
            // Skip button
            const skipButton = tutorialOverlay.querySelector('.btn-secondary');
            if (skipButton) {
                skipButton.addEventListener('click', function() {
                    tutorialOverlay.style.display = 'none';
                    localStorage.setItem('safetrack_tutorialSeen', 'true');
                });
            }
            
            // Start tour button
            const startTourButton = tutorialOverlay.querySelector('.btn-primary');
            if (startTourButton) {
                startTourButton.addEventListener('click', function() {
                    tutorialOverlay.style.display = 'none';
                    localStorage.setItem('safetrack_tutorialSeen', 'true');
                    startGuidedTour();
                });
            }
        }
        
        // Shortcuts modal
        const shortcutsModal = document.getElementById('keyboard-shortcuts-modal');
        if (shortcutsModal) {
            shortcutsModal.querySelectorAll('.close-modal').forEach(btn => {
                btn.addEventListener('click', function() {
                    shortcutsModal.style.display = 'none';
                });
            });
        }
        
        // Dashboard date range selector
        const dateRangeButtons = document.querySelectorAll('.date-range-selector button');
        dateRangeButtons.forEach(button => {
            button.addEventListener('click', function() {
                dateRangeButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                updateDashboardData(this.textContent.trim().toLowerCase());
            });
        });
        
        // AI Assistant chat
        initAIAssistant();
        
        // Make dashboard cards draggable
        initDraggableCards();
    }
    
    function toggleShortcutsModal() {
        const modal = document.getElementById('keyboard-shortcuts-modal');
        if (modal) {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
            } else {
                modal.style.display = 'flex';
            }
        }
    }
    
    function startGuidedTour() {
        // This would normally start a step-by-step guided tour
        // For demo, just show a message
        showToast('Guided tour started');
    }
    
    function updateDashboardData(timeRange) {
        // Simulate data update
        let salesData;
        
        switch(timeRange) {
            case 'today':
                salesData = {
                    today: '$1,245.80',
                    week: '$8,762.45',
                    month: '$36,295.12',
                    todayChange: '+5.2%',
                    weekChange: '+3.7%',
                    monthChange: '+8.1%'
                };
                break;
                
            case 'week':
                salesData = {
                    today: '$8,762.45',
                    week: '$35,419.78',
                    month: '$142,386.51',
                    todayChange: '+3.7%',
                    weekChange: '+4.2%',
                    monthChange: '+6.8%'
                };
                break;
                
            case 'month':
                salesData = {
                    today: '$36,295.12',
                    week: '$142,386.51',
                    month: '$425,782.65',
                    todayChange: '+8.1%',
                    weekChange: '+6.8%',
                    monthChange: '+5.4%'
                };
                break;
                
            case 'custom':
                // Show date picker
                showToast('Date picker would appear here');
                return;
        }
        
        // Update metrics on dashboard
        if (salesData) {
            document.querySelectorAll('.metrics-row .metric-item').forEach((item) => {
                const metricLabel = item.querySelector('.metric-label');
                if (metricLabel) {
                    const label = metricLabel.textContent.toLowerCase();
                    const metricValue = item.querySelector('.metric-value');
                    const metricChange = item.querySelector('.metric-change');
                    
                    if (label.includes('today') && metricValue && metricChange) {
                        metricValue.textContent = salesData.today;
                        metricChange.textContent = salesData.todayChange;
                    } else if (label.includes('week') && metricValue && metricChange) {
                        metricValue.textContent = salesData.week;
                        metricChange.textContent = salesData.weekChange;
                    } else if (label.includes('month') && metricValue && metricChange) {
                        metricValue.textContent = salesData.month;
                        metricChange.textContent = salesData.monthChange;
                    }
                }
            });
        }
        
        // Update charts
        updateChartData(timeRange);
        
        // Show data loading indicator
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                
                // Update last updated time
                const lastUpdated = document.querySelector('.last-updated');
                if (lastUpdated) {
                    const now = new Date();
                    lastUpdated.textContent = `Last updated: Today at ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
                }
                
                // Show success message
                showToast(`Dashboard updated to show ${timeRange} data`);
            }, 800);
        }
    }
    
    function updateChartData(timeRange) {
        // Update sales trend chart
        if (APP_STATE.charts.salesTrendChart) {
            let labels, data;
            
            switch(timeRange) {
                case 'today':
                    labels = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'];
                    data = [120, 245, 380, 210, 180, 240, 150];
                    break;
                    
                case 'week':
                    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    data = [1220, 1380, 1170, 1450, 1560, 1320, 1245];
                    break;
                    
                case 'month':
                    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                    data = [8450, 9370, 8920, 9560];
                    break;
                    
                default:
                    return;
            }
            
            APP_STATE.charts.salesTrendChart.data.labels = labels;
            APP_STATE.charts.salesTrendChart.data.datasets[0].data = data;
            APP_STATE.charts.salesTrendChart.update();
        }
        
        // Update other charts as needed
    }
    
    function initAIAssistant() {
        const chatInput = document.querySelector('.chat-input');
        const sendButton = document.querySelector('.chat-send');
        const chatMessages = document.querySelector('.chat-messages');
        const suggestionChips = document.querySelectorAll('.suggestion-chips .chip');
        
        // Send message when clicking send button
        if (sendButton && chatInput) {
            sendButton.addEventListener('click', function() {
                sendMessage();
            });
        }
        
        // Send message when pressing Enter in input
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
        
        // Handle suggestion chips
        if (suggestionChips) {
            suggestionChips.forEach(chip => {
                chip.addEventListener('click', function() {
                    if (chatInput) {
                        chatInput.value = this.textContent;
                        sendMessage();
                    }
                });
            });
        }
        
        // Handle insight actions
        document.querySelectorAll('.insight-actions button').forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent.trim();
                const insightCard = this.closest('.insight-card');
                
                if (action === 'Dismiss' && insightCard) {
                    // Remove the insight card with animation
                    insightCard.style.opacity = '0';
                    setTimeout(() => {
                        insightCard.style.display = 'none';
                    }, 300);
                } else {
                    // Handle other actions
                    showToast(`Executing action: ${action}`);
                }
            });
        });
        
        function sendMessage() {
            if (!chatInput || !chatInput.value.trim() || !chatMessages) return;
            
            // Add user message
            addMessage('user', chatInput.value);
            
            // Save the message and clear input
            const userMessage = chatInput.value;
            chatInput.value = '';
            
            // Show thinking indicator
            addMessage('assistant', '<div class="typing-indicator"><span></span><span></span><span></span></div>', false);
            
            // Simulate AI response after a delay
            setTimeout(() => {
                // Remove thinking indicator
                const typingIndicator = document.querySelector('.typing-indicator');
                if (typingIndicator && typingIndicator.parentElement && typingIndicator.parentElement.parentElement) {
                    typingIndicator.parentElement.parentElement.remove();
                }
                
                // Process the message and generate a response
                processAIQuery(userMessage);
            }, 1500);
        }
        
        function addMessage(type, content, scrollToBottom = true) {
            if (!chatMessages) return;
            
            const messageHTML = createMessageHTML(type, content);
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
            
            if (scrollToBottom) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
        
        function createMessageHTML(type, content) {
            if (type === 'user') {
                return `
                    <div class="message user">
                        <div class="message-avatar">YO</div>
                        <div class="message-bubble">
                            <p>${content}</p>
                        </div>
                    </div>
                `;
            } else if (type === 'assistant') {
                return `
                    <div class="message assistant">
                        <div class="message-avatar">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,14.09 4.8,16 6.11,17.41L9.88,9.88L17.41,6.11C16,4.8 14.09,4 12,4M12,20A8,8 0 0,0 20,12C20,9.91 19.2,8 17.89,6.59L14.12,14.12L6.59,17.89C8,19.2 9.91,20 12,20M12,12L11.23,11.23L9.7,14.3L12.77,12.77L12,12M12,12L12.77,12.77L15.3,10.7L12.23,9.23L12,12Z" /></svg>
                        </div>
                        <div class="message-bubble">
                            ${content}
                        </div>
                    </div>
                `;
            } else if (type === 'system') {
                return `
                    <div class="message system">
                        <div class="message-content">
                            <p>${content}</p>
                        </div>
                    </div>
                `;
            }
            
            return ''; // Default empty string if no matching type
        }
        
        function processAIQuery(query) {
            if (!query) return;
            
            query = query.toLowerCase();
            let response = '';
            
            // Simple pattern matching for demo
            if (query.includes('sales') || query.includes('revenue')) {
                response = `
                    <p>Here's a summary of your sales performance:</p>
                    <ul>
                        <li>Today: $1,245.80 (↑5.2% from yesterday)</li>
                        <li>This Week: $8,762.45 (↑3.7% from last week)</li>
                        <li>This Month: $36,295.12 (↑8.1% from last month)</li>
                    </ul>
                    <p>Your top selling category this month is Burgers (34.3% of total revenue), followed by Fries (20.0%) and Shakes (15.0%).</p>
                    <p>Would you like to see a detailed breakdown or forecasts for next month?</p>
                `;
                
                // Add chart visualization after a small delay
                setTimeout(() => {
                    addMessage('assistant', `
                        <div class="visualization-container">
                            <h4>Monthly Sales Trend (Past 6 Months)</h4>
                            <div class="chart-placeholder">
                                <canvas id="ai-sales-chart"></canvas>
                            </div>
                        </div>
                    `);
                    
                    // Initialize chart
                    const ctx = document.getElementById('ai-sales-chart');
                    if (ctx) {
                        new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
                                datasets: [{
                                    label: 'Revenue ($)',
                                    data: [32450, 30980, 33570, 34120, 33570, 36295],
                                    borderColor: '#0054a6',
                                    backgroundColor: 'rgba(0, 84, 166, 0.1)',
                                    tension: 0.4,
                                    fill: true
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: false
                                    }
                                }
                            }
                        });
                    }
                }, 500);
            }
            else if (query.includes('inventory') || query.includes('stock')) {
                response = `
                    <p>Here's your current inventory status:</p>
                    <ul>
                        <li><strong class="text-danger">Critical (1 item):</strong> Vegetarian Patties - Out of stock</li>
                        <li><strong class="text-warning">Low Stock (3 items):</strong> Burger Buns (15%), Cheese Slices (20%), Soda Cups (25%)</li>
                        <li><strong class="text-success">Healthy Stock (120 items)</strong></li>
                    </ul>
                    <p>Based on your current sales trends, I recommend placing orders for the following items:</p>
                    <ol>
                        <li>Vegetarian Patties - 40 units (urgent)</li>
                        <li>Burger Buns - 45 packs</li>
                        <li>Cheese Slices - 35 packs</li>
                    </ol>
                    <p>Would you like me to prepare an order request for your approval?</p>
                `;
            }
            else if (query.includes('staff') || query.includes('employee')) {
                response = `
                    <p>Your staff overview:</p>
                    <ul>
                        <li>Total Staff: 14 employees</li>
                        <li>Currently On Duty: 7 employees</li>
                        <li>Next Shift Change: 2:00 PM (in 3 hours)</li>
                    </ul>
                    <p><strong>Certification Status:</strong></p>
                    <ul>
                        <li><span class="text-warning">⚠️ Expiring Soon (2):</span> John Doe (7 days), Maria Garcia (14 days)</li>
                        <li><span class="text-success">✓ Valid (26 certifications)</span></li>
                    </ul>
                    <p>Would you like me to send reminder emails to staff with expiring certifications?</p>
                `;
            }
            else if (query.includes('compliance') || query.includes('certification')) {
                response = `
                    <p>Compliance status overview:</p>
                    <ul>
                        <li><strong>Overall Compliance Score:</strong> 96% <span class="positive">(↑4% from last month)</span></li>
                        <li><strong>Staff Certifications:</strong> 93% compliant (2 expiring soon)</li>
                        <li><strong>Inspections:</strong> Health inspection due in 6 days</li>
                        <li><strong>Action Required:</strong> Fire safety inspection is overdue by 5 days</li>
                    </ul>
                    <p><strong>Recommended Actions:</strong></p>
                    <ol>
                        <li>Schedule fire safety inspection immediately</li>
                        <li>Send certification renewal reminders to John Doe and Maria Garcia</li>
                        <li>Prepare for health inspection (cleaning checklist is available)</li>
                    </ol>
                    <p>Would you like me to help schedule the fire safety inspection?</p>
                `;
            }
            else {
                response = `
                    <p>I'm here to help you with managing Soley's Fast Food restaurant. You can ask me about:</p>
                    <ul>
                        <li>Sales performance and trends</li>
                        <li>Inventory status and ordering recommendations</li>
                        <li>Staff management and scheduling</li>
                        <li>Compliance and certification tracking</li>
                        <li>Data analysis and custom reports</li>
                    </ul>
                    <p>What information would you like to know about your restaurant today?</p>
                `;
            }
            
            // Add response to chat
            addMessage('assistant', response);
        }
    }
    
    function initDraggableCards() {
        // This would normally use a library like SortableJS
        // For demo, just add a class to show it's draggable
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        dashboardCards.forEach(card => {
            card.classList.add('draggable');
            
            // Add drag handle to card headers
            const cardHeader = card.querySelector('.card-header');
            if (cardHeader) {
                cardHeader.style.cursor = 'move';
                
                // Show movement on mousedown for demo
                cardHeader.addEventListener('mousedown', function(e) {
                    if (e.target === cardHeader || e.target.parentNode === cardHeader) {
                        card.style.boxShadow = 'var(--shadow-xl)';
                        card.style.transform = 'scale(1.02)';
                        
                        // Reset after mouseup
                        document.addEventListener('mouseup', function resetCard() {
                            card.style.boxShadow = '';
                            card.style.transform = '';
                            document.removeEventListener('mouseup', resetCard);
                        });
                    }
                });
            }
        });
        
        // Save/Reset layout buttons
        const saveLayoutBtn = document.querySelector('.dashboard-actions button:first-child');
        const resetLayoutBtn = document.querySelector('.dashboard-actions button:last-child');
        
        if (saveLayoutBtn) {
            saveLayoutBtn.addEventListener('click', function() {
                showToast('Dashboard layout saved');
            });
        }
        
        if (resetLayoutBtn) {
            resetLayoutBtn.addEventListener('click', function() {
                showToast('Dashboard layout reset to default');
            });
        }
    }
    
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
            
            // Add styles
            toast.style.position = 'fixed';
            toast.style.bottom = '24px';
            toast.style.right = '24px';
            toast.style.background = 'var(--bg-card)';
            toast.style.color = 'var(--text-primary)';
            toast.style.padding = '12px 16px';
            toast.style.borderRadius = '8px';
            toast.style.boxShadow = 'var(--shadow-lg)';
            toast.style.zIndex = '9999';
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            toast.style.border = '1px solid var(--border-color)';
            toast.style.fontSize = '0.875rem';
        }
        
        // Set message and show toast
        toast.textContent = message;
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
        
        // Hide toast after 3 seconds
        clearTimeout(toast.timeout);
        toast.timeout = setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
        }, 3000);
    }

    function initCharts() {
      // Sales Trend Chart
      const salesTrendCtx = document.getElementById('sales-trend-chart');
      if (salesTrendCtx) {
          APP_STATE.charts.salesTrendChart = new Chart(salesTrendCtx, {
              type: 'line',
              data: {
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  // Remove the trailing comma above ↑
                  // The rest of your chart configuration...
              }
          });
      }
    }