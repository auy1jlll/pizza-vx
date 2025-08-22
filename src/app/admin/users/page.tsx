'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  customerProfile?: {
    firstName?: string;
    lastName?: string;
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
  };
  employeeProfile?: {
    employeeId: string;
    firstName: string;
    lastName: string;
    position?: string;
    department?: string;
    isActive: boolean;
  };
}

interface Employee {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  employeeProfile?: {
    employeeId: string;
    firstName: string;
    lastName: string;
    position?: string;
    department?: string;
    hireDate?: string;
    hourlyWage?: number;
    permissions: string[];
  };
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Employee creation form
  const [showCreateEmployee, setShowCreateEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    position: '',
    department: '',
    employeeId: '',
    hourlyWage: '',
    role: 'EMPLOYEE' as 'EMPLOYEE' | 'ADMIN',
    permissions: [] as string[],
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch customers
      const customersResponse = await fetch('/api/admin/customers');
      if (customersResponse.ok) {
        const customersData = await customersResponse.json();
        setCustomers(customersData.customers || []);
      }

      // Fetch employees
      const employeesResponse = await fetch('/api/admin/employees');
      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData.employees || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    try {
      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEmployee,
          hourlyWage: newEmployee.hourlyWage ? parseFloat(newEmployee.hourlyWage) : null,
        }),
      });

      if (response.ok) {
        setSuccess('Employee created successfully!');
        setShowCreateEmployee(false);
        setNewEmployee({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          position: '',
          department: '',
          employeeId: '',
          hourlyWage: '',
          role: 'EMPLOYEE',
          permissions: [],
          emergencyContactName: '',
          emergencyContactPhone: '',
        });
        fetchUsers();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      setError('Failed to create employee');
    }
  };

  const togglePermission = (permission: string) => {
    setNewEmployee(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerProfile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerProfile?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchTerm || 
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeProfile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeProfile?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeProfile?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'ALL' || employee.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-200">Manage customers and employees</p>
          </div>
          <Link 
            href="/admin" 
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Admin
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-600/20">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Customers</p>
                <p className="text-3xl font-semibold text-white">{customers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-600/20">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Employees</p>
                <p className="text-3xl font-semibold text-white">{employees.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-600/20">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Admins</p>
                <p className="text-3xl font-semibold text-white">
                  {employees.filter(e => e.role === 'ADMIN').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-black/30 rounded-lg p-1">
          {[
            { id: 'customers', label: 'Customers', icon: '👥', count: customers.length },
            { id: 'employees', label: 'Employees', icon: '👨‍💼', count: employees.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
              />
              {activeTab === 'employees' && (
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="ALL">All Roles</option>
                  <option value="EMPLOYEE">Employees</option>
                  <option value="ADMIN">Admins</option>
                </select>
              )}
            </div>
            
            {activeTab === 'employees' && (
              <button
                onClick={() => setShowCreateEmployee(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Add Employee
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden">
          {activeTab === 'customers' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {customer.customerProfile?.firstName && customer.customerProfile?.lastName
                              ? `${customer.customerProfile.firstName} ${customer.customerProfile.lastName}`
                              : customer.name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-400">{customer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {customer.phone || 'No phone'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {customer.customerProfile?.totalOrders || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ${(customer.customerProfile?.totalSpent || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.isActive 
                            ? 'bg-green-600/20 text-green-300' 
                            : 'bg-red-600/20 text-red-300'
                        }`}>
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400">No customers found</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {employee.employeeProfile 
                              ? `${employee.employeeProfile.firstName} ${employee.employeeProfile.lastName}`
                              : employee.name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-400">{employee.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {employee.employeeProfile?.employeeId || 'No ID'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {employee.employeeProfile?.position || 'No position'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {employee.employeeProfile?.department || 'No department'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.role === 'ADMIN'
                            ? 'bg-purple-600/20 text-purple-300'
                            : 'bg-blue-600/20 text-blue-300'
                        }`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.isActive 
                            ? 'bg-green-600/20 text-green-300' 
                            : 'bg-red-600/20 text-red-300'
                        }`}>
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredEmployees.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400">No employees found</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Employee Modal */}
        {showCreateEmployee && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Employee</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Password *</label>
                  <input
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Employee ID *</label>
                  <input
                    type="text"
                    value={newEmployee.employeeId}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Position</label>
                  <input
                    type="text"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    placeholder="Manager, Chef, Cashier, etc."
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Department</label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  >
                    <option value="">Select Department</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Front">Front of House</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as 'EMPLOYEE' | 'ADMIN' })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Hourly Wage</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newEmployee.hourlyWage}
                    onChange={(e) => setNewEmployee({ ...newEmployee, hourlyWage: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              
              {/* Permissions */}
              <div className="mt-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">Permissions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    'order_management',
                    'menu_edit',
                    'user_management',
                    'kitchen_access',
                    'reports_access',
                    'settings_edit'
                  ].map((permission) => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newEmployee.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="mr-2"
                      />
                      <span className="text-gray-300 text-sm">
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowCreateEmployee(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEmployee}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Employee
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}