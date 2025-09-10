// Global state
let currentModule = 'accounts';
let isNavigatorVisible = true;
let currentUser = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('currentUser');
    
    if (isLoggedIn === 'true' && userData) {
        currentUser = JSON.parse(userData);
        
        // If user has a token, verify it's still valid
        if (token && !currentUser.offlineMode) {
            verifyToken().then(isValid => {
                if (isValid) {
                    showMainApp();
                } else {
                    // Try to refresh token
                    refreshToken().then(refreshed => {
                        if (refreshed) {
                            showMainApp();
                        } else {
                            showLoginScreen();
                        }
                    }).catch(() => {
                        showLoginScreen();
                    });
                }
            }).catch(() => {
                showLoginScreen();
            });
        } else {
            // Offline mode or no token - just show main app
            showMainApp();
        }
    } else {
        showLoginScreen();
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize form interactions
    initializeFormInteractions();
});

// Token verification
async function verifyToken() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const response = await fetch('/api/auth/verify/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token: token })
        });
        
        return response.ok;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}

// Refresh token
async function refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;
    
    try {
        const response = await fetch('/api/auth/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Token refresh error:', error);
        return false;
    }
}

// Make authenticated API request
async function authenticatedRequest(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const requestOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, requestOptions);
        
        // If token expired, try to refresh
        if (response.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
                // Retry request with new token
                requestOptions.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
                return await fetch(url, requestOptions);
            } else {
                // Refresh failed, redirect to login
                showLoginScreen();
                throw new Error('Authentication failed');
            }
        }
        
        return response;
    } catch (error) {
        console.error('Authenticated request error:', error);
        throw error;
    }
}

// Simple test login function for debugging
function testLogin() {
    console.log('Testing simple login...');
    localStorage.setItem('isLoggedIn', 'true');
    currentUser = {
        username: 'admin',
        email: 'admin@dbis.com',
        role: 'Administrator',
        company: 'breeze',
        loginTime: new Date(),
        offlineMode: true
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMainApp();
}

// Login functionality with hybrid backend/offline support
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const company = document.getElementById('company').value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }

    // Try backend authentication first
    try {
        const response = await fetch('/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                company: company
            }),
        });

        if (response.ok) {
            const data = await response.json();
            // Store token and user data
            localStorage.setItem('token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('isLoggedIn', 'true');
            
            currentUser = {
                username: data.user.username,
                email: data.user.email,
                company: company,
                loginTime: new Date()
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMainApp();
            return;
        } else {
            // Backend responded but with error - try to parse error message
            try {
                const errorData = await response.json();
                alert(errorData.detail || 'Login failed');
            } catch {
                alert('Login failed - server error');
            }
            return;
        }
    } catch (error) {
        console.log('Backend not available, trying offline mode...', error);
        
        // Fallback to offline test credentials
        const testCredentials = [
            { username: 'admin', password: 'admin', role: 'Administrator' },
            { username: 'test', password: 'test', role: 'User' },
            { username: 'demo', password: 'demo', role: 'Demo User' },
            { username: 'user', password: 'user', role: 'Standard User' },
            { username: 'manager', password: 'manager', role: 'Manager' },
            { username: 'sanya', password: 'password', role: 'User' },
            { username: 'david', password: 'david123', role: 'Administrator' }
        ];

        console.log('Checking credentials:', { username, password });
        
        // Check if entered credentials match any test credentials
        const validUser = testCredentials.find(cred => 
            cred.username.toLowerCase() === username.toLowerCase() && 
            cred.password === password
        );

        console.log('Valid user found:', validUser);

        if (validUser) {
            console.log('Logging in with offline credentials...');
            // Store user data for the session (offline mode)
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.removeItem('token'); // Clear any existing tokens
            localStorage.removeItem('refresh_token');
            
            currentUser = {
                username: validUser.username,
                email: `${validUser.username}@dbis.com`,
                role: validUser.role,
                company: company,
                loginTime: new Date(),
                offlineMode: true
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            console.log('Calling showMainApp...');
            showMainApp();
        } else {
            console.log('Invalid credentials provided');
            alert('Invalid username or password.\n\nBackend unavailable - using offline mode.\n\nTry these test credentials:\n• admin / admin\n• test / test\n• demo / demo\n• user / user\n• manager / manager\n• sanya / password\n• david / david123');
        }
    }
}

function closeApp() {
    if (confirm('Are you sure you want to close the application?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.close();
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Update user info in footer
    updateUserInfo();
}

function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const footerInfo = document.querySelector('.footer-info');
    if (footerInfo) {
        const modeIndicator = user.offlineMode ? ' (OFFLINE)' : '';
        footerInfo.innerHTML = `
            <span>USER: ${user.username || 'DAUDI'}${modeIndicator}</span>
            <span>SERVER: ${user.offlineMode ? 'OFFLINE' : 'LOCALHOST'}</span>
            <span>DATABASE: ${user.company || 'BREEZE'}</span>
            <span>ACCOUNTING DATE: 28 August 2025</span>
            <span>VERSION: 1.0</span>
            <span>DbisV1.0</span>
        `;
    }
}

// Navigation functionality
function toggleNavigator() {
    const sidebar = document.getElementById('sidebar');
    const navMenu = document.getElementById('navMenu');
    
    isNavigatorVisible = !isNavigatorVisible;
    
    if (isNavigatorVisible) {
        sidebar.classList.remove('collapsed');
        navMenu.style.display = 'block';
    } else {
        sidebar.classList.add('collapsed');
        navMenu.style.display = 'none';
    }
}

function switchModule(module) {
    currentModule = module;
    
    // Update module buttons
    document.querySelectorAll('.module-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(module + 'Btn').classList.add('active');
    
    // Update sidebar header
    document.getElementById('currentModule').textContent = module.charAt(0).toUpperCase() + module.slice(1);
    
    // Update navigation menu based on module
    updateNavigationMenu(module);
    
    // Show default content for module
    showModuleDefault(module);
}

function updateNavigationMenu(module) {
    const navMenu = document.getElementById('navMenu');
    
    switch(module) {
        case 'accounts':
            navMenu.innerHTML = `
                <div class="module-section" id="accountsModule">
                    <div class="module-header" onclick="toggleModuleSection('settings')">
                        <i class="fas fa-chevron-right"></i>
                        <span>Settings</span>
                    </div>
                    <div class="module-items" id="settings">
                        <div class="nav-item" onclick="showClientsTerms()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Clients Terms</span>
                        </div>
                        <div class="nav-item" onclick="showCustomers()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Customers</span>
                        </div>
                        <div class="nav-item" onclick="showInvoiceReversal()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Invoice Reversal</span>
                        </div>
                        <div class="nav-item" onclick="showSuppliers()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Suppliers</span>
                        </div>
                    </div>
                    
                    <div class="module-header" onclick="toggleModuleSection('transactions')">
                        <i class="fas fa-chevron-right"></i>
                        <span>Transactions</span>
                    </div>
                    <div class="module-items" id="transactions">
                        <div class="nav-item" onclick="showCustomerOpeningBalance()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Customer Opening</span>
                        </div>
                        <div class="nav-item" onclick="showCustomerReceipts()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Customer Receipts</span>
                        </div>
                        <div class="nav-item active" onclick="showCustomerInvoices()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Customers Invoices</span>
                        </div>
                        <div class="nav-item" onclick="showPettyCash()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Petty Cash</span>
                        </div>
                    </div>
                    
                    <div class="module-header" onclick="toggleModuleSection('reports')">
                        <i class="fas fa-chevron-right"></i>
                        <span>Reports</span>
                    </div>
                    <div class="module-items" id="reports">
                        <div class="nav-item" onclick="showClientsAgedAnalysis()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Clients Aged Analy</span>
                        </div>
                        <div class="nav-item" onclick="showCustomersAllocation()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Customers Allocati</span>
                        </div>
                        <div class="nav-item" onclick="showCustomersPrepayment()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Customers Prepayr</span>
                        </div>
                        <div class="nav-item" onclick="showCustomersStatement()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Customers Stateme</span>
                        </div>
                        <div class="nav-item" onclick="showProfitLoss()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Profit & Loss</span>
                        </div>
                        <div class="nav-item" onclick="showPurchases()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Purchases</span>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'stocks':
            navMenu.innerHTML = `
                <div class="module-section" id="stocksModule">
                    <div class="module-header" onclick="toggleModuleSection('stocksSettings')">
                        <i class="fas fa-chevron-right"></i>
                        <span>Settings</span>
                    </div>
                    <div class="module-items" id="stocksSettings">
                        <div class="nav-item" onclick="showCategories()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Categories</span>
                        </div>
                        <div class="nav-item" onclick="showStocksNames()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Stocks Names</span>
                        </div>
                        <div class="nav-item" onclick="showStores()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Stores</span>
                        </div>
                    </div>
                    
                    <div class="module-header" onclick="toggleModuleSection('stocksTransactions')">
                        <i class="fas fa-chevron-right"></i>
                        <span>Transactions</span>
                    </div>
                    <div class="module-items" id="stocksTransactions">
                        <div class="nav-item" onclick="showAddingStocks()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Adding Stocks Quantity</span>
                        </div>
                        <div class="nav-item" onclick="showInterStoreTransfer()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Inter-Store Transfer</span>
                        </div>
                        <div class="nav-item" onclick="showReducingStocks()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Reducing Stocks Quant</span>
                        </div>
                    </div>
                    
                    <div class="module-header" onclick="toggleModuleSection('stocksReports')">
                        <i class="fas fa-chevron-right"></i>
                        <span>Reports</span>
                    </div>
                    <div class="module-items" id="stocksReports">
                        <div class="nav-item" onclick="showAddedStocks()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Added Stocks</span>
                        </div>
                        <div class="nav-item" onclick="showBestSeller()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Best Seller</span>
                        </div>
                        <div class="nav-item" onclick="showPriceList()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Price List</span>
                        </div>
                        <div class="nav-item" onclick="showProfitabilityByItem()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Profitability by item</span>
                        </div>
                        <div class="nav-item" onclick="showStockCardNew()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Stock Card New</span>
                        </div>
                        <div class="nav-item" onclick="showStockLevelAsAt()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Stock Level As at</span>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'admin':
            navMenu.innerHTML = `
                <div class="module-section" id="adminModule">
                    <div class="nav-item" onclick="showUserManagement()">
                        <i class="fas fa-chevron-right"></i>
                        <span>User Management</span>
                    </div>
                    <div class="nav-item" onclick="showSystemSettings()">
                        <i class="fas fa-chevron-right"></i>
                        <span>System Settings</span>
                    </div>
                    <div class="nav-item" onclick="showBackupRestore()">
                        <i class="fas fa-chevron-right"></i>
                        <span>Backup & Restore</span>
                    </div>
                </div>
            `;
            break;
            
        case 'fuel':
            navMenu.innerHTML = `
                <div class="module-section" id="fuelModule">
                    <div class="module-header" onclick="toggleModuleSection('fuelSettings')">
                        <i class="fas fa-chevron-right"></i>
                        <span>Settings</span>
                    </div>
                    <div class="module-items" id="fuelSettings">
                        <div class="nav-item" onclick="showFuelStations()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Fuel Stations</span>
                        </div>
                        <div class="nav-item" onclick="showFuelTypes()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Fuel Types</span>
                        </div>
                    </div>
                    
                    <div class="module-header" onclick="toggleModuleSection('fuelTransactions')">
                        <i class="fas fa-chevron-right"></i>
                        <span>Transactions</span>
                    </div>
                    <div class="module-items" id="fuelTransactions">
                        <div class="nav-item" onclick="showFuelPurchases()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Fuel Purchases</span>
                        </div>
                        <div class="nav-item" onclick="showFuelSales()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Fuel Sales</span>
                        </div>
                    </div>
                    
                    <div class="module-header" onclick="toggleModuleSection('fuelReports')">
                        <i class="fas fa-chevron-right"></i>
                        <span>Reports</span>
                    </div>
                    <div class="module-items" id="fuelReports">
                        <div class="nav-item" onclick="showFuelConsumption()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Fuel Consumption</span>
                        </div>
                        <div class="nav-item" onclick="showFuelInventory()">
                            <i class="fas fa-chevron-right"></i>
                            <span>Fuel Inventory</span>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
}

function toggleModuleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.previousElementSibling;
    const icon = header.querySelector('i');
    
    if (section.classList.contains('expanded')) {
        section.classList.remove('expanded');
        icon.style.transform = 'rotate(0deg)';
    } else {
        section.classList.add('expanded');
        icon.style.transform = 'rotate(90deg)';
    }
}

function showModuleDefault(module) {
    const contentArea = document.getElementById('contentArea');
    
    // Hide all content windows
    document.querySelectorAll('.content-window').forEach(window => {
        window.classList.add('hidden');
    });
    
    // Show dashboard
    document.getElementById('dashboard').classList.remove('hidden');
}

// Content display functions
function showContent(contentId) {
    // Hide all content windows
    document.querySelectorAll('.content-window').forEach(window => {
        window.classList.add('hidden');
    });
    
    // Show selected content
    const content = document.getElementById(contentId);
    if (content) {
        content.classList.remove('hidden');
    }
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
}

// Tab management
function closeTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        tab.remove();
    }
    
    // If this was the active tab, show dashboard
    if (tab.classList.contains('active')) {
        showContent('dashboard');
    }
}

// Navigation functions for Accounts module
function showClientsTerms() {
    showContent('clientsTerms');
}

function showCustomers() {
    showContent('customers');
}

function showInvoiceReversal() {
    showContent('invoiceReversal');
}

function showSuppliers() {
    showContent('suppliers');
}

function showCustomerOpeningBalance() {
    showContent('customerOpeningBalance');
}

function showCustomerReceipts() {
    showContent('customerReceipts');
}

function showCustomerInvoices() {
    showContent('debtorsInvoiceList');
}

function showPettyCash() {
    showContent('pettyCash');
}

function showClientsAgedAnalysis() {
    showContent('clientsAgedAnalysis');
}

function showCustomersAllocation() {
    showContent('customersAllocation');
}

function showCustomersPrepayment() {
    showContent('customersPrepayment');
}

function showCustomersStatement() {
    showContent('customersStatement');
}

function showProfitLoss() {
    showContent('profitLoss');
}

function showPurchases() {
    showContent('purchases');
}

// Navigation functions for Stocks module
function showCategories() {
    showContent('categories');
}

function showStocksNames() {
    showContent('stocksNames');
}

function showStores() {
    showContent('stores');
}

function showAddingStocks() {
    showContent('addingStocks');
}

function showInterStoreTransfer() {
    showContent('interStoreTransfer');
}

function showReducingStocks() {
    showContent('reducingStocks');
}

function showAddedStocks() {
    showContent('addedStocks');
}

function showBestSeller() {
    showContent('bestSeller');
}

function showPriceList() {
    showContent('priceList');
}

function showProfitabilityByItem() {
    showContent('profitabilityByItem');
}

function showStockCardNew() {
    showContent('stockCardNew');
}

function showStockLevelAsAt() {
    showContent('stockLevelAsAt');
}

// Navigation functions for Admin module
function showUserManagement() {
    showContent('userManagement');
}

function showSystemSettings() {
    showContent('systemSettings');
}

function showBackupRestore() {
    showContent('backupRestore');
}

// Navigation functions for Fuel module
function showFuelStations() {
    showContent('fuelStations');
}

function showFuelTypes() {
    showContent('fuelTypes');
}

function showFuelPurchases() {
    showContent('fuelPurchases');
}

function showFuelSales() {
    showContent('fuelSales');
}

function showFuelConsumption() {
    showContent('fuelConsumption');
}

function showFuelInventory() {
    showContent('fuelInventory');
}

// Utility functions
function changePassword() {
    alert('Change Password functionality would be implemented here');
}

function refresh() {
    location.reload();
}

function initializeNavigation() {
    // Set up module section toggles
    document.addEventListener('click', function(e) {
        if (e.target.closest('.module-header')) {
            const header = e.target.closest('.module-header');
            const sectionId = header.getAttribute('onclick').match(/'([^']+)'/)[1];
            toggleModuleSection(sectionId);
        }
    });
}

function initializeFormInteractions() {
    // Add form validation and interactions
    document.addEventListener('input', function(e) {
        if (e.target.type === 'number') {
            // Auto-format numbers
            e.target.value = e.target.value.replace(/[^0-9.]/g, '');
        }
    });
    
    // Add form submission handlers
    document.addEventListener('submit', function(e) {
        e.preventDefault();
        // Handle form submissions
    });
}

// Sample data for demonstration
const sampleData = {
    customers: [
        { id: 1, name: 'SANYA', contact: '0715593483', email: 'sanya@example.com' },
        { id: 2, name: 'DEXE GROUP', contact: '0707328777', email: 'dexe@example.com' }
    ],
    suppliers: [
        { id: 1, code: 'BKSU31', name: 'DEXE GROUP', category: 'Stocks' },
        { id: 2, code: 'BKSU32', name: 'BULAND', category: 'Stocks' }
    ],
    items: [
        { code: '0001', name: 'DEXE SHAMPOO GLOBAL', category: 'DEXE', qty: 6720, price: 98.10 },
        { code: '00010', name: 'MORE SHAMPOO 500 ML', category: 'GELS', qty: 72, price: 155.17 },
        { code: '0010', name: 'MORFOSE WAX 50...', category: 'WAX', qty: 0, price: 646.55 }
    ]
};

// Additional form functions
function showClientForm() {
    showContent('clientForm');
}

function showSupplierForm() {
    showContent('supplierForm');
}

// Placeholder functions for other modules
function showClientsTerms() {
    showContent('clientsTerms');
}

function showInvoiceReversal() {
    showContent('invoiceReversal');
}

function showCustomerOpeningBalance() {
    showContent('customerOpeningBalance');
}

function showCustomerReceipts() {
    showContent('customerReceipts');
}

function showPettyCash() {
    showContent('pettyCash');
}

function showClientsAgedAnalysis() {
    showContent('clientsAgedAnalysis');
}

function showCustomersAllocation() {
    showContent('customersAllocation');
}

function showCustomersPrepayment() {
    showContent('customersPrepayment');
}

function showCustomersStatement() {
    showContent('customersStatement');
}

function showProfitLoss() {
    showContent('profitLoss');
}

function showPurchases() {
    showContent('purchases');
}

// Stocks module functions
function showCategories() {
    showContent('categories');
}

function showStocksNames() {
    showContent('stocksNames');
}

function showStores() {
    showContent('stores');
}

function showAddingStocks() {
    showContent('addingStocks');
}

function showInterStoreTransfer() {
    showContent('interStoreTransfer');
}

function showReducingStocks() {
    showContent('reducingStocks');
}

function showAddedStocks() {
    showContent('addedStocks');
}

function showBestSeller() {
    showContent('bestSeller');
}

function showPriceList() {
    showContent('priceList');
}

function showProfitabilityByItem() {
    showContent('profitabilityByItem');
}

function showStockCardNew() {
    showContent('stockCardNew');
}

function showStockLevelAsAt() {
    showContent('stockLevelAsAt');
}

// Admin module functions
function showUserManagement() {
    showContent('userManagement');
}

function showSystemSettings() {
    showContent('systemSettings');
}

function showBackupRestore() {
    showContent('backupRestore');
}

// Fuel module functions
function showFuelStations() {
    showContent('fuelStations');
}

function showFuelTypes() {
    showContent('fuelTypes');
}

function showFuelPurchases() {
    showContent('fuelPurchases');
}

function showFuelSales() {
    showContent('fuelSales');
}

function showFuelConsumption() {
    showContent('fuelConsumption');
}

function showFuelInventory() {
    showContent('fuelInventory');
}

// Additional form functions for new content windows
function showCategoryForm() {
    showContent('categoryForm');
}

function showStoreForm() {
    showContent('storeForm');
}

// Toggle expandable sections
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.previousElementSibling;
    const icon = header.querySelector('i');
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        icon.className = 'fas fa-minus';
    } else {
        section.style.display = 'none';
        icon.className = 'fas fa-plus';
    }
}

// Export functions for global access
window.login = login;
window.closeApp = closeApp;
window.testLogin = testLogin;
window.toggleNavigator = toggleNavigator;
window.switchModule = switchModule;
window.showContent = showContent;
window.closeTab = closeTab;
window.changePassword = changePassword;
window.refresh = refresh;
window.showClientForm = showClientForm;
window.showSupplierForm = showSupplierForm;
window.showClientsTerms = showClientsTerms;
window.showInvoiceReversal = showInvoiceReversal;
window.showCustomerOpeningBalance = showCustomerOpeningBalance;
window.showCustomerReceipts = showCustomerReceipts;
window.showPettyCash = showPettyCash;
window.showClientsAgedAnalysis = showClientsAgedAnalysis;
window.showCustomersAllocation = showCustomersAllocation;
window.showCustomersPrepayment = showCustomersPrepayment;
window.showCustomersStatement = showCustomersStatement;
window.showProfitLoss = showProfitLoss;
window.showPurchases = showPurchases;
window.showCategories = showCategories;
window.showStocksNames = showStocksNames;
window.showStores = showStores;
window.showAddingStocks = showAddingStocks;
window.showInterStoreTransfer = showInterStoreTransfer;
window.showReducingStocks = showReducingStocks;
window.showAddedStocks = showAddedStocks;
window.showBestSeller = showBestSeller;
window.showPriceList = showPriceList;
window.showProfitabilityByItem = showProfitabilityByItem;
window.showStockCardNew = showStockCardNew;
window.showStockLevelAsAt = showStockLevelAsAt;
window.showUserManagement = showUserManagement;
window.showSystemSettings = showSystemSettings;
window.showBackupRestore = showBackupRestore;
window.showFuelStations = showFuelStations;
window.showFuelTypes = showFuelTypes;
window.showFuelPurchases = showFuelPurchases;
window.showFuelSales = showFuelSales;
window.showFuelConsumption = showFuelConsumption;
window.showFuelInventory = showFuelInventory;
window.showCategoryForm = showCategoryForm;
window.showStoreForm = showStoreForm;
window.toggleSection = toggleSection;
