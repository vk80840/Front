// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Close sidebar by default
  document.querySelector('.sidebar').classList.add('closed');
  
  // Set dashboard as the default active tab
  openTab('dashboard');
  
  // Initialize nav items
  initNavItems();
  
  // Initialize UI components
  initUIComponents();
  
  // Initialize charts for income section
  initCharts();
  
  // Initialize tree view
  initTreeView();
  
  // Initialize team view
  initTeamView();
  
  // Close sidebar when clicking outside
  document.addEventListener('click', function(event) {
    // Skip if clicking on sidebar or sidebar toggle button
    if (event.target.closest('.sidebar') || event.target.closest('#toggleSidebar')) {
      return;
    }
    
    // Close sidebar if it's open
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar.classList.contains('closed')) {
      sidebar.classList.add('closed');
    }
  });
});

// Initialize navigation menu
function initNavItems() {
  // Add active class to first nav item
  document.querySelector('.nav-menu li').classList.add('active');
  
  // Add click event for all nav items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all
      navItems.forEach(i => i.classList.remove('active'));
      // Add active to clicked one
      item.classList.add('active');

      // Trigger click animation
      item.classList.remove('clicked');
      void item.offsetWidth; // Force reflow to restart animation
      item.classList.add('clicked');
      
      // Close sidebar when item is clicked
      document.querySelector('.sidebar').classList.add('closed');
    });
  });
}

// Initialize UI components
function initUIComponents() {
  // Toggle sidebar open/close
  document.getElementById('toggleSidebar').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('closed');
  });

  // Close sidebar with the close button
  document.getElementById('closeSidebar').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.add('closed');
  });

  // Profile dropdown toggle
  const profileButton = document.getElementById('profileButton');
  const dropdownMenu = document.getElementById('dropdownMenu');
  
  profileButton.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent document click from closing it immediately
    document.querySelector('.profile-container').classList.toggle('active');
  });
  
  // Close dropdown when clicking elsewhere
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.profile-container') && 
        document.querySelector('.profile-container').classList.contains('active')) {
      document.querySelector('.profile-container').classList.remove('active');
    }
  });
  
  // Transaction details modal
  const viewTransDetailsBtn = document.getElementById('viewTransDetails');
  const transactionModal = document.getElementById('transactionModal');
  const closeModal = document.querySelector('.close-modal');
  
  if (viewTransDetailsBtn && transactionModal) {
    viewTransDetailsBtn.addEventListener('click', function() {
      transactionModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', function() {
      transactionModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
      if (event.target === transactionModal) {
        transactionModal.style.display = 'none';
      }
    });
  }
  
  // File upload input handling
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', function() {
      const fileName = this.files.length > 0 ? this.files[0].name : 'No file chosen';
      const fileNameElement = this.closest('.file-upload-container').querySelector('.file-name, #fileName');
      
      if (fileNameElement) {
        fileNameElement.textContent = fileName;
      }
    });
  });
  
  // Support section ticket form toggle
  const openTicketForm = document.getElementById('openTicketForm');
  const ticketForm = document.getElementById('ticketForm');
  const cancelTicket = document.getElementById('cancelTicket');
  
  if (openTicketForm && ticketForm) {
    openTicketForm.addEventListener('click', function() {
      ticketForm.style.display = 'block';
    });
    
    if (cancelTicket) {
      cancelTicket.addEventListener('click', function() {
        ticketForm.style.display = 'none';
      });
    }
  }
  
  // Logout button functionality
  document.getElementById('logoutBtn').addEventListener('click', () => {
    alert('Logging out...');
    // In a real app, redirect to logout endpoint
  });
  
  // Copy referral link functionality
  const copyReferralBtn = document.querySelector('.referral-box button');
  if (copyReferralBtn) {
    copyReferralBtn.addEventListener('click', copyReferral);
  }
  
  // Copy crypto address functionality
  const copyCryptoBtn = document.querySelector('.copyable-address button');
  if (copyCryptoBtn) {
    copyCryptoBtn.addEventListener('click', copyCryptoAddress);
  }
}

// Tab management
function openTab(tabId) {
  // Hide all tabs
  const tabs = document.querySelectorAll('.tab-section');
  tabs.forEach(tab => tab.style.display = 'none');

  // Show selected tab
  const tabToShow = document.getElementById(tabId);
  if (tabToShow) {
    tabToShow.style.display = 'block';
    
    // If it's the income tab, update charts
    if (tabId === 'income') {
      updateCharts();
    }
    
    // Close sidebar when opening a tab
    document.querySelector('.sidebar').classList.add('closed');
  }
}

// Copy referral link functionality
function copyReferral() {
  const refLink = document.getElementById('refLink');
  refLink.select();
  document.execCommand('copy');
  showToast('Referral link copied!');
}

// Copy crypto address functionality
function copyCryptoAddress() {
  const addressInput = document.querySelector('.copyable-address input');
  addressInput.select();
  document.execCommand('copy');
  showToast('Wallet address copied!');
}

// Show toast notification
function showToast(message) {
  // Create toast element if it doesn't exist
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  // Set message and show
  toast.textContent = message;
  toast.classList.add('show');
  
  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Password reset form toggle
function togglePasswordReset() {
  const form = document.getElementById('resetPasswordForm');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }
}

// Bank details edit toggle
function toggleBankEdit() {
  const inputs = document.querySelectorAll('#bankForm .bank-input');
  inputs.forEach(input => {
    input.readOnly = !input.readOnly;
    
    if (!input.readOnly) {
      input.focus();
    }
  });
  
  // Change button text based on state
  const button = document.querySelector('#bankForm .bank-btn');
  if (button) {
    if (inputs[0].readOnly) {
      button.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Change';
    } else {
      button.innerHTML = '<i class="fa-solid fa-save"></i> Save';
    }
  }
}

// Initialize team view functionality
function initTeamView() {
  // View team buttons
  const teamButtons = document.querySelectorAll('.team-btn');
  const teamDataContainer = document.getElementById('teamDataContainer');
  const teamDataTitle = document.getElementById('teamDataTitle');
  const closeTeamData = document.getElementById('closeTeamData');
  
  if (teamButtons.length && teamDataContainer && teamDataTitle) {
    teamButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.id.replace('view', '');
        teamDataTitle.innerHTML = `<i class="fa-solid fa-users"></i> ${category} Members`;
        teamDataContainer.style.display = 'block';
        
        // Scroll to view
        teamDataContainer.scrollIntoView({ behavior: 'smooth' });
      });
    });
    
    if (closeTeamData) {
      closeTeamData.addEventListener('click', function() {
        teamDataContainer.style.display = 'none';
      });
    }
  }
}

// Initialize tree view functionality
function initTreeView() {
  // Expand/collapse node controls
  const expandButtons = document.querySelectorAll('.node-expand-btn');
  expandButtons.forEach(button => {
    button.addEventListener('click', function() {
      const node = this.closest('.tree-node');
      const children = node.querySelector('.tree-children');
      
      if (children) {
        children.style.display = children.style.display === 'none' ? 'flex' : 'none';
        this.classList.toggle('collapsed');
      }
    });
  });
  
  // Expand all button
  const expandAllBtn = document.getElementById('expandAll');
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', function() {
      const allChildren = document.querySelectorAll('.tree-children');
      allChildren.forEach(child => {
        child.style.display = 'flex';
      });
      
      expandButtons.forEach(button => {
        button.classList.remove('collapsed');
      });
    });
  }
  
  // Collapse all button
  const collapseAllBtn = document.getElementById('collapseAll');
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', function() {
      // Get only the second level and deeper children
      const deepChildren = document.querySelectorAll('.tree-node .tree-node .tree-children');
      deepChildren.forEach(child => {
        child.style.display = 'none';
      });
      
      // Collapse all buttons in those levels
      const deepButtons = document.querySelectorAll('.tree-node .tree-node .node-expand-btn');
      deepButtons.forEach(button => {
        button.classList.add('collapsed');
      });
    });
  }
}

// Initialize charts for income section
function initCharts() {
  if (typeof Chart === 'undefined') return;
  
  // Income overview chart
  const incomeCtx = document.getElementById('incomeChart');
  if (incomeCtx) {
    const incomeChart = new Chart(incomeCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Referral Income',
          data: [120, 190, 300, 250, 220, 350],
          backgroundColor: 'rgba(22, 168, 192, 0.5)',
          borderColor: 'rgba(22, 168, 192, 1)',
          borderWidth: 1
        }, {
          label: 'Investment Income',
          data: [200, 300, 350, 400, 450, 500],
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        }
      }
    });
  }
  
  // Referral performance chart
  const referralCtx = document.getElementById('referralChart');
  if (referralCtx) {
    const referralChart = new Chart(referralCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Direct Referrals',
          data: [2, 5, 8, 9, 12, 14],
          borderColor: 'rgba(22, 168, 192, 1)',
          backgroundColor: 'rgba(22, 168, 192, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        }
      }
    });
  }
  
  // Investment performance chart
  const investmentCtx = document.getElementById('investmentChart');
  if (investmentCtx) {
    const investmentChart = new Chart(investmentCtx, {
      type: 'doughnut',
      data: {
        labels: ['Principal', 'Interest', 'Bonuses'],
        datasets: [{
          data: [2000, 1200, 250],
          backgroundColor: [
            'rgba(22, 168, 192, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(251, 191, 36, 0.7)'
          ],
          borderColor: [
            'rgba(22, 168, 192, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(251, 191, 36, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        }
      }
    });
  }
}

// Update charts - called when income tab is shown
function updateCharts() {
  // This would typically fetch new data from an API
  // For now, we'll just ensure the charts are rendered properly
  if (typeof Chart !== 'undefined') {
    Chart.instances.forEach(chart => {
      chart.resize();
    });
  }
}
