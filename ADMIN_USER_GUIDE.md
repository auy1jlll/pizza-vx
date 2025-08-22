# 🍕 Pizza Ordering System - Administrator User Guide

**Version 1.0** | **Date: August 22, 2025**

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Admin Dashboard Overview](#admin-dashboard-overview)
3. [User Management](#user-management)
4. [Order Management](#order-management)
5. [Pizza Configuration](#pizza-configuration)
6. [Menu Item Management](#menu-item-management)
7. [System Settings](#system-settings)
8. [Reports & Analytics](#reports--analytics)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Getting Started

### System Access
- **Admin URL**: `http://localhost:3005/admin/login`
- **Default Admin Account**: Contact system administrator for credentials
- **Browser Requirements**: Chrome, Firefox, Safari (latest versions)

### Initial Login
1. Navigate to the admin login page
2. Enter your admin email and password
3. Click "Sign In"
4. You'll be redirected to the admin dashboard

---

## Admin Dashboard Overview

The admin dashboard provides access to all system management functions:

### Navigation Menu
- **📊 Dashboard** - Overview and analytics
- **👥 Users** - Customer and employee management
- **📋 Orders** - Order tracking and management
- **🍕 Pizza Builder** - Pizza configuration
- **🥪 Menu Items** - Non-pizza menu management
- **⚙️ Settings** - System configuration
- **📊 Reports** - Analytics and reporting

---

## User Management

### Customer Management

#### Viewing Customers
1. Go to **Users** → **Customers** tab
2. View customer list with:
   - Name and contact information
   - Total orders and spending
   - Loyalty points
   - Account status

#### Customer Actions
- **View Details**: Click on customer name
- **Edit Information**: Update contact details
- **View Order History**: See all customer orders
- **Manage Status**: Activate/deactivate accounts

#### Key Customer Metrics
- **Total Orders**: Number of completed orders
- **Total Spent**: Lifetime spending (calculated from order totals)
- **Loyalty Points**: Earned rewards points
- **Last Order Date**: Most recent purchase

### Employee Management

#### Adding New Employees
1. Go to **Users** → **Employees** tab
2. Click **"+ Add Employee"**
3. Fill in required information:
   - **Email** (will be login username)
   - **Password** (temporary, employee should change)
   - **First Name & Last Name**
   - **Phone Number**
   - **Position** (e.g., "Kitchen Staff", "Manager")
   - **Department** (e.g., "Kitchen", "Front Counter")
   - **Employee ID** (unique identifier)
   - **Hourly Wage** (for payroll)
   - **Role** (EMPLOYEE or ADMIN)
   - **Emergency Contact** information

#### Employee Roles
- **EMPLOYEE**: Can view/manage orders, limited admin access
- **ADMIN**: Full system access including settings and user management

---

## Order Management

### Order Dashboard
Access via **Orders** in the main navigation.

#### Order Status Types
- **🟡 PENDING**: New order, needs confirmation
- **🔵 CONFIRMED**: Order accepted, preparing to start
- **🟠 PREPARING**: Currently being made in kitchen
- **🟢 READY**: Order completed, ready for pickup/delivery
- **⚫ COMPLETED**: Order fulfilled and closed
- **🔴 CANCELLED**: Order was cancelled

#### Managing Orders

##### Updating Order Status
1. Find the order in the list
2. Click the status dropdown
3. Select new status
4. Order will update automatically

##### Viewing Order Details
1. Click on any order to expand details
2. View:
   - Customer information
   - Order items with customizations
   - Pricing breakdown
   - Special instructions
   - Delivery information (if applicable)

##### Order Actions
- **Print Receipt**: Generate printable receipt
- **Download Receipt**: Save receipt as file
- **Update Status**: Change order progression
- **Add Notes**: Internal order notes

#### Order Filtering
- **Filter by Status**: Show only specific order types
- **Filter by Type**: Pickup vs Delivery orders
- **Search**: Find orders by customer name or order number

---

## Pizza Configuration

### Pizza Sizes

#### Managing Pizza Sizes
1. Navigate to **Pizza Builder** → **Sizes**
2. View current sizes with base prices

##### Adding New Sizes
1. Click **"+ Add Size"**
2. Enter:
   - **Name** (e.g., "Small", "Medium", "Large")
   - **Base Price** (starting price for this size)
   - **Sort Order** (display order in menus)
3. Click **"Save"**

##### Editing Sizes
1. Click the edit icon next to size
2. Modify name or base price
3. Save changes

### Pizza Crusts

#### Managing Crusts
1. Go to **Pizza Builder** → **Crusts**
2. View available crust types

##### Adding New Crusts
1. Click **"+ Add Crust"**
2. Enter:
   - **Name** (e.g., "Thin Crust", "Deep Dish")
   - **Price Modifier** (additional cost, can be negative)
   - **Sort Order**
3. Save the new crust

### Pizza Sauces

#### Managing Sauces
1. Navigate to **Pizza Builder** → **Sauces**
2. View current sauce options

##### Adding New Sauces
1. Click **"+ Add Sauce"**
2. Enter:
   - **Name** (e.g., "Marinara", "White Sauce", "BBQ")
   - **Price Modifier** (additional cost)
   - **Sort Order**
3. Save the sauce

### Pizza Toppings

#### Managing Toppings
1. Go to **Pizza Builder** → **Toppings**
2. View toppings organized by category

##### Adding New Toppings
1. Click **"+ Add Topping"**
2. Enter:
   - **Name** (e.g., "Pepperoni", "Mushrooms")
   - **Category** (e.g., "Meats", "Vegetables", "Cheeses")
   - **Price** (cost per topping)
   - **Sort Order**
3. Save the topping

##### Topping Categories
- **Meats**: Pepperoni, Sausage, Ham, etc.
- **Vegetables**: Mushrooms, Peppers, Onions, etc.
- **Cheeses**: Mozzarella, Cheddar, Feta, etc.
- **Specialty**: Unique or premium toppings

#### Topping Placement Options
Customers can place toppings on:
- **Whole Pizza**: Entire pizza
- **Left Half**: Left side only
- **Right Half**: Right side only

#### Topping Intensity Levels
- **Light**: Less than normal amount
- **Regular**: Standard amount
- **Extra**: More than normal amount

---

## Menu Item Management

### Non-Pizza Menu Items
Manage sandwiches, salads, beverages, and other items.

#### Adding Menu Items
1. Navigate to **Menu Items**
2. Click **"+ Add Menu Item"**
3. Fill in details:
   - **Name** (e.g., "Italian Sub", "Caesar Salad")
   - **Description** (appetizing description)
   - **Category** (e.g., "Sandwiches", "Salads", "Beverages")
   - **Base Price** (starting price)
   - **Image URL** (optional product image)
4. Save the item

#### Menu Categories
Common categories include:
- **Sandwiches/Subs**
- **Salads**
- **Appetizers**
- **Beverages**
- **Desserts**
- **Sides**

### Customization Groups

#### Creating Customization Options
For menu items that have options (like sandwich toppings):

1. Select a menu item
2. Click **"Add Customization Group"**
3. Configure:
   - **Group Name** (e.g., "Bread Type", "Add-ons")
   - **Selection Type**:
     - **Single**: Customer picks one option
     - **Multiple**: Customer can pick several
   - **Required**: Whether customer must choose
   - **Min/Max Selections**: Limits on choices

#### Adding Customization Options
1. Within a customization group
2. Click **"+ Add Option"**
3. Enter:
   - **Option Name** (e.g., "White Bread", "Extra Mayo")
   - **Price Modifier** (additional cost, can be $0)
   - **Sort Order**

### Examples of Menu Item Customizations

#### Sandwich Customizations
- **Bread Type**: White, Wheat, Italian (Single choice, Required)
- **Cheese**: American, Provolone, Swiss (Single choice, Optional)
- **Add-ons**: Extra Mayo, Lettuce, Tomato (Multiple choice, Optional)

#### Salad Customizations
- **Dressing**: Ranch, Italian, Caesar (Single choice, Required)
- **Extras**: Croutons, Cheese, Bacon Bits (Multiple choice, Optional)

---

## System Settings

### Application Configuration
Access via **Settings** in main navigation.

#### General Settings
- **Restaurant Name**: Display name for the business
- **Contact Information**: Phone, address, email
- **Operating Hours**: Business hours for each day
- **Timezone**: Local timezone for order timestamps

#### Order Settings
- **Enable Guest Checkout**: Allow orders without account creation
- **Enable User Accounts**: Show sign-in/sign-up options
- **Order Confirmation**: Automatic vs manual order acceptance
- **Order Numbering**: Prefix and format for order numbers

#### Delivery Settings
- **Enable Delivery**: Turn delivery service on/off
- **Delivery Fee**: Standard delivery charge
- **Delivery Radius**: Service area limitations
- **Minimum Order**: Minimum amount for delivery

#### Payment Settings
- **Accepted Payment Methods**: Cash, Card, etc.
- **Tip Settings**: Enable tips and suggested percentages
- **Tax Rate**: Local tax percentage

#### Promotion Settings
- **Enable Promotions**: Turn promotion system on/off
- **Promotion Rules**: Configure automatic discounts
- **Loyalty Program**: Points and rewards configuration

---

## Reports & Analytics

### Order Reports

#### Sales Dashboard
- **Daily Sales**: Revenue by day
- **Order Volume**: Number of orders over time
- **Average Order Value**: Mean order amount
- **Popular Items**: Best-selling products

#### Customer Analytics
- **New Customers**: Registration trends
- **Customer Retention**: Repeat order rates
- **Loyalty Points**: Points earned and redeemed
- **Customer Lifetime Value**: Total spending per customer

#### Operational Reports
- **Order Status Distribution**: Orders by current status
- **Delivery vs Pickup**: Order type breakdown
- **Peak Hours**: Busiest times of day
- **Employee Performance**: Order handling metrics

### Generating Reports
1. Navigate to **Reports**
2. Select report type
3. Choose date range
4. Apply filters if needed
5. Click **"Generate Report"**
6. Export as PDF or Excel if needed

---

## Troubleshooting

### Common Issues

#### Orders Not Appearing
1. Check order status filters
2. Verify date range settings
3. Refresh the page
4. Check internet connection

#### Customer Profile Issues
- **Zero Spending**: Create customer profile if missing
- **Missing Orders**: Verify email matching
- **Profile Errors**: Check required fields

#### Menu Item Problems
- **Items Not Displaying**: Check if item is active
- **Wrong Prices**: Verify base price and modifiers
- **Missing Customizations**: Ensure options are saved

#### System Performance
- **Slow Loading**: Clear browser cache
- **Page Errors**: Refresh page or restart browser
- **Data Not Saving**: Check network connection

### When to Contact Support
- Database connection errors
- Payment processing issues
- System crashes or persistent errors
- User access problems

---

## Best Practices

### Daily Operations

#### Order Management
1. **Monitor Pending Orders**: Check every 5-10 minutes
2. **Update Status Promptly**: Keep customers informed
3. **Confirm Large Orders**: Verify complex or expensive orders
4. **Handle Cancellations**: Process promptly and courteously

#### Menu Management
1. **Keep Prices Current**: Update regularly for cost changes
2. **Seasonal Items**: Add/remove based on availability
3. **Monitor Popularity**: Track which items sell best
4. **Test New Items**: Start with limited offerings

### Weekly Tasks

#### System Maintenance
1. **Review Order Reports**: Analyze trends and performance
2. **Update Menu**: Add seasonal items, adjust prices
3. **Check Customer Feedback**: Address any recurring issues
4. **Employee Training**: Ensure staff understands updates

#### Data Management
1. **Backup Database**: Regular data backups (automated)
2. **Clean Old Data**: Archive old orders if needed
3. **Update Customer Info**: Maintain accurate contact details
4. **Review Settings**: Ensure configurations are current

### Monthly Tasks

#### Performance Review
1. **Sales Analysis**: Monthly revenue and growth trends
2. **Menu Performance**: Which items are profitable
3. **Customer Retention**: Track repeat customer rates
4. **System Updates**: Apply any software updates

#### Strategic Planning
1. **Menu Optimization**: Add popular items, remove slow sellers
2. **Pricing Strategy**: Adjust based on costs and competition
3. **Promotion Planning**: Design seasonal or special offers
4. **Staff Training**: Update procedures and train new features

---

## Security Guidelines

### Password Management
- **Strong Passwords**: Use complex passwords for admin accounts
- **Regular Changes**: Update passwords quarterly
- **Unique Accounts**: Each admin should have their own account
- **Secure Storage**: Never share or write down passwords

### Data Protection
- **Customer Privacy**: Protect customer information
- **Payment Security**: Never store payment card details
- **Access Control**: Limit admin access to necessary personnel
- **Regular Audits**: Review user access regularly

---

## Contact Information

### Technical Support
- **System Issues**: Contact your IT administrator
- **Training Questions**: Refer to this guide or request training
- **Feature Requests**: Document requests for system improvements

### Business Support
- **Order Questions**: Use the order management system
- **Customer Service**: Handle through normal customer service channels
- **Billing Issues**: Contact accounting department

---

**Document Version**: 1.0  
**Last Updated**: August 22, 2025  
**Next Review**: September 22, 2025

---

*This document covers the complete administration of the Pizza Ordering System. Keep this guide accessible for all administrative staff and update it as the system evolves.*
