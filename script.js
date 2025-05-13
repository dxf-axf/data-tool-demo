document.addEventListener('DOMContentLoaded', function() {
    // Initialize current date
    const currentDate = new Date();
    document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-menu li');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Show the corresponding content section
            const targetId = this.getAttribute('data-target');
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show the corresponding tab content
            const targetId = this.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Chart.js initialization
    initializeDashboardCharts();
    initializeSalesCharts();
    initializeInventoryCharts();
    initializeChatbotCharts();

    // Chatbot suggestion buttons
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    const chatInput = document.querySelector('.chat-input input');
    
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.textContent;
            chatInput.value = question;
            // Simulating user sending the question
            addUserMessage(question);
            setTimeout(() => {
                processUserQuery(question);
            }, 500);
        });
    });

    // Chat send functionality
    const sendButton = document.querySelector('.chat-input button');
    
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatInput.value = '';
            // Process the message and generate a response
            setTimeout(() => {
                processUserQuery(message);
            }, 500);
        }
    }

    function addUserMessage(message) {
        const messagesContainer = document.querySelector('.chat-messages');
        const time = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        const messageHTML = `
            <div class="message user">
                <div class="message-content">
                    <p>${message}</p>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;

        messagesContainer.innerHTML += messageHTML;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addBotMessage(message) {
        const messagesContainer = document.querySelector('.chat-messages');
        const time = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        const messageHTML = `
            <div class="message bot">
                <div class="message-content">
                    ${message}
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;

        messagesContainer.innerHTML += messageHTML;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Process user query and generate a relevant response
    function processUserQuery(query) {
        query = query.toLowerCase();
        
        // Example responses based on common queries
        if (query.includes('best selling') || query.includes('top selling')) {
            const responseHTML = `
                <p>Based on the last 30 days of sales data, your top selling items are:</p>
                <ol>
                    <li>Double Cheeseburger - 1,254 units ($6,270.00)</li>
                    <li>Loaded Fries - 987 units ($3,948.00)</li>
                    <li>Chocolate Shake - 876 units ($3,504.00)</li>
                    <li>Pepperoni Pizza - 743 units ($3,715.00)</li>
                    <li>Chicken Burger - 698 units ($3,490.00)</li>
                </ol>
                <p>Would you like to see the sales breakdown by category?</p>
            `;
            addBotMessage(responseHTML);
            updateChatResultsChart('top-items');
        } 
        else if (query.includes('busiest day') || query.includes('peak time')) {
            const responseHTML = `
                <p>Based on the last 30 days of data:</p>
                <p><strong>Busiest day:</strong> Friday (avg. $1,450 in sales)</p>
                <p><strong>Peak hours:</strong> 12:00 PM - 1:00 PM (lunch rush) and 5:30 PM - 7:00 PM (dinner rush)</p>
                <p>Would you like to see the hourly sales breakdown?</p>
            `;
            addBotMessage(responseHTML);
            updateChatResultsChart('peak-hours');
        }
        else if (query.includes('inventory') || query.includes('stock')) {
            const responseHTML = `
                <p>Based on your current sales trends, here's the projected inventory needs for next week:</p>
                <ul>
                    <li>Burger patties: 350 units (current stock: 145)</li>
                    <li>Burger buns: 40 packs (current stock: 35) - <strong>Reorder recommended</strong></li>
                    <li>Cheese slices: 38 packs (current stock: 40)</li>
                    <li>French fries: 65 bags (current stock: 87)</li>
                    <li>Vegetarian patties: 25 units (current stock: 0) - <strong>Order immediately</strong></li>
                </ul>
                <p>Should I prepare a complete inventory forecast report?</p>
            `;
            addBotMessage(responseHTML);
            updateChatResultsChart('inventory-forecast');
        }
        else if (query.includes('certification') || query.includes('compliance')) {
            const responseHTML = `
                <p>The following staff certifications expire this month:</p>
                <ul>
                    <li>John Doe - Food Safety Certification (expires in 7 days)</li>
                    <li>Maria Garcia - Food Handler Card (expires in 14 days)</li>
                </ul>
                <p>Would you like me to send automatic reminders to these staff members?</p>
            `;
            addBotMessage(responseHTML);
            updateChatResultsChart('certifications');
        }
        else if (query.includes('revenue') || query.includes('sales')) {
            const responseHTML = `
                <p>Here's your revenue comparison:</p>
                <p><strong>Current Month:</strong> $36,295.12</p>
                <p><strong>Previous Month:</strong> $33,570.45</p>
                <p><strong>Change:</strong> +$2,724.67 (+8.1%)</p>
                <p>Your best performing category was Burgers with a 12% increase in sales from the previous month.</p>
                <p>Would you like to see the detailed revenue breakdown?</p>
            `;
            addBotMessage(responseHTML);
            updateChatResultsChart('revenue-comparison');
        }
        else {
            addBotMessage(`<p>I'm not sure I understand that query. Could you try rephrasing or selecting one of the suggested questions?</p>`);
        }
    }

    // Update the chat results chart based on the query type
    function updateChatResultsChart(chartType) {
        const chartContainer = document.getElementById('chat-results-chart');
        let chart;
        
        if (chartType === 'top-items') {
            document.querySelector('.data-visualization h3').textContent = 'Top Selling Items - Past 30 Days';
            
            // Create chart data for top selling items
            const data = {
                labels: ['Double Cheeseburger', 'Loaded Fries', 'Chocolate Shake', 'Pepperoni Pizza', 'Chicken Burger'],
                datasets: [{
                    label: 'Units Sold',
                    data: [1254, 987, 876, 743, 698],
                    backgroundColor: '#0054a6',
                    borderColor: '#0054a6',
                    borderWidth: 1
                }]
            };
            
            chart = new Chart(chartContainer, {
                type: 'bar',
                data: data,
                options: {
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        else if (chartType === 'peak-hours') {
            document.querySelector('.data-visualization h3').textContent = 'Sales by Hour - Average';
            
            // Create chart data for hourly sales
            const data = {
                labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'],
                datasets: [{
                    label: 'Average Sales ($)',
                    data: [85, 120, 150, 270, 450, 410, 280, 190, 210, 320, 380, 350, 240, 180],
                    backgroundColor: '#0054a6',
                    borderColor: '#0054a6',
                    tension: 0.4,
                    fill: false
                }]
            };
            
            chart = new Chart(chartContainer, {
                type: 'line',
                data: data,
                options: {
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        else if (chartType === 'inventory-forecast') {
            document.querySelector('.data-visualization h3').textContent = 'Inventory Forecast - Next 7 Days';
            
            // Create chart data for inventory forecast
            const data = {
                labels: ['Burger Patties', 'Burger Buns', 'Cheese Slices', 'French Fries', 'Vegetarian Patties'],
                datasets: [
                    {
                        label: 'Current Stock',
                        data: [145, 35, 40, 87, 0],
                        backgroundColor: '#6c757d'
                    },
                    {
                        label: 'Needed Stock',
                        data: [350, 40, 38, 65, 25],
                        backgroundColor: '#0054a6'
                    }
                ]
            };
            
            chart = new Chart(chartContainer, {
                type: 'bar',
                data: data,
                options: {
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        else if (chartType === 'certifications') {
            document.querySelector('.data-visualization h3').textContent = 'Staff Certifications Status';
            
            // Create chart data for certification status
            const data = {
                labels: ['Valid', 'Expiring Soon', 'Expired'],
                datasets: [{
                    data: [26, 2, 0],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545']
                }]
            };
            
            chart = new Chart(chartContainer, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            });
        }
        else if (chartType === 'revenue-comparison') {
            document.querySelector('.data-visualization h3').textContent = 'Monthly Revenue Comparison';
            
            // Create chart data for revenue comparison
            const data = {
                labels: ['Previous Month', 'Current Month'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [33570.45, 36295.12],
                    backgroundColor: ['#6c757d', '#0054a6']
                }]
            };
            
            chart = new Chart(chartContainer, {
                type: 'bar',
                data: data,
                options: {
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Initialize Dashboard Charts
    function initializeDashboardCharts() {
        // Sales Chart for Dashboard
        const salesChartCtx = document.getElementById('sales-chart');
        if (salesChartCtx) {
            new Chart(salesChartCtx, {
                type: 'line',
                data: {
                    labels: ['Apr 27', 'Apr 28', 'Apr 29', 'Apr 30', 'May 1', 'May 2', 'May 3'],
                    datasets: [{
                        label: 'Daily Sales',
                        data: [1220, 1380, 1170, 1450, 1560, 1320, 1245],
                        backgroundColor: 'rgba(0, 84, 166, 0.1)',
                        borderColor: '#0054a6',
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
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Initialize Sales Charts
    function initializeSalesCharts() {
        // Revenue Chart
        const revenueChartCtx = document.getElementById('revenue-chart');
        if (revenueChartCtx) {
            new Chart(revenueChartCtx, {
                type: 'line',
                data: {
                    labels: ['Apr 4', 'Apr 9', 'Apr 14', 'Apr 19', 'Apr 24', 'Apr 29', 'May 4'],
                    datasets: [{
                        label: 'Revenue',
                        data: [5280, 5760, 6120, 5890, 6340, 5970, 6295],
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
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Category Chart
        const categoryChartCtx = document.getElementById('category-chart');
        if (categoryChartCtx) {
            new Chart(categoryChartCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Burgers', 'Fries', 'Shakes', 'Pizza', 'Other'],
                    datasets: [{
                        data: [12458.25, 7259.02, 5444.27, 4718.36, 6415.22],
                        backgroundColor: [
                            '#0054a6',
                            '#ffa700',
                            '#17a2b8',
                            '#28a745',
                            '#6c757d'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    // Initialize Inventory Charts
    function initializeInventoryCharts() {
        // Forecast Chart
        const forecastChartCtx = document.getElementById('forecast-chart');
        if (forecastChartCtx) {
            new Chart(forecastChartCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: 'Burger Patties',
                            data: [145, 125, 105, 85, 65, 45, 25],
                            borderColor: '#0054a6',
                            tension: 0.4,
                            fill: false
                        },
                        {
                            label: 'Burger Buns',
                            data: [35, 30, 25, 20, 15, 10, 5],
                            borderColor: '#ffc107',
                            tension: 0.4,
                            fill: false
                        },
                        {
                            label: 'Cheese Slices',
                            data: [40, 35, 30, 25, 20, 15, 10],
                            borderColor: '#28a745',
                            tension: 0.4,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Initialize Chatbot Charts
    function initializeChatbotCharts() {
        // Initial chart for chat results
        const chatResultsChartCtx = document.getElementById('chat-results-chart');
        if (chatResultsChartCtx) {
            new Chart(chatResultsChartCtx, {
                type: 'bar',
                data: {
                    labels: ['Double Cheeseburger', 'Loaded Fries', 'Chocolate Shake'],
                    datasets: [{
                        label: 'Sales Last Week',
                        data: [128, 97, 89],
                        backgroundColor: '#0054a6'
                    }]
                },
                options: {
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    // Generate sample data for download - Call this function when export button is clicked
    document.querySelector('.btn-export').addEventListener('click', function() {
        generateExcelData();
    });

    function generateExcelData() {
        // This is a simplified example. In a real app, you would use a library like SheetJS to create Excel files
        alert('Excel data would be generated here. In a real implementation, this would create and download an Excel file with sales and inventory data for Soley\'s Fast Food.');
        
        // Simulated data structure - in a real app, this would be used to create the Excel file
        const salesData = {
            monthly: [
                { month: 'May 2024', revenue: 30450.75, orders: 3215, avgOrder: 9.47 },
                { month: 'Jun 2024', revenue: 31280.50, orders: 3302, avgOrder: 9.47 },
                { month: 'Jul 2024', revenue: 32145.25, orders: 3350, avgOrder: 9.60 },
                { month: 'Aug 2024', revenue: 33750.80, orders: 3425, avgOrder: 9.85 },
                { month: 'Sep 2024', revenue: 31890.45, orders: 3310, avgOrder: 9.64 },
                { month: 'Oct 2024', revenue: 32570.30, orders: 3380, avgOrder: 9.64 },
                { month: 'Nov 2024', revenue: 34280.15, orders: 3520, avgOrder: 9.74 },
                { month: 'Dec 2024', revenue: 38450.60, orders: 3890, avgOrder: 9.88 },
                { month: 'Jan 2025', revenue: 33120.25, orders: 3450, avgOrder: 9.60 },
                { month: 'Feb 2025', revenue: 32890.35, orders: 3390, avgOrder: 9.70 },
                { month: 'Mar 2025', revenue: 33570.45, orders: 3417, avgOrder: 9.82 },
                { month: 'Apr 2025', revenue: 36295.12, orders: 3642, avgOrder: 9.97 }
            ],
            
            topItems: [
                { name: 'Double Cheeseburger', category: 'Burgers', units: 1254, revenue: 6270.00 },
                { name: 'Loaded Fries', category: 'Fries', units: 987, revenue: 3948.00 },
                { name: 'Chocolate Shake', category: 'Shakes', units: 876, revenue: 3504.00 },
                { name: 'Pepperoni Pizza', category: 'Pizza', units: 743, revenue: 3715.00 },
                { name: 'Chicken Burger', category: 'Burgers', units: 698, revenue: 3490.00 },
                { name: 'Vanilla Shake', category: 'Shakes', units: 654, revenue: 2616.00 },
                { name: 'Regular Fries', category: 'Fries', units: 625, revenue: 1875.00 },
                { name: 'BBQ Bacon Burger', category: 'Burgers', units: 589, revenue: 3534.00 },
                { name: 'Cheese Pizza', category: 'Pizza', units: 542, revenue: 2710.00 },
                { name: 'Hot Dog Deluxe', category: 'Hot Dogs', units: 520, revenue: 2080.00 }
            ],
            
            inventory: [
                { item: 'Beef Patties', category: 'Ingredients', stock: 145, minimum: 50, status: 'Good' },
                { item: 'Burger Buns', category: 'Ingredients', stock: 35, minimum: 30, status: 'Low' },
                { item: 'Cheese Slices', category: 'Ingredients', stock: 40, minimum: 25, status: 'Low' },
                { item: 'French Fries', category: 'Ingredients', stock: 87, minimum: 40, status: 'Good' },
                { item: 'Vegetarian Patties', category: 'Ingredients', stock: 0, minimum: 20, status: 'Out' },
                { item: 'Soda Cups', category: 'Packaging', stock: 125, minimum: 100, status: 'Low' },
                { item: 'Pizza Dough', category: 'Ingredients', stock: 65, minimum: 30, status: 'Good' },
                { item: 'Hot Dog Buns', category: 'Ingredients', stock: 78, minimum: 35, status: 'Good' },
                { item: 'Cola Syrup', category: 'Beverages', stock: 48, minimum: 25, status: 'Good' },
                { item: 'Ice Cream Mix', category: 'Ingredients', stock: 52, minimum: 30, status: 'Good' }
            ]
        };
    }

});