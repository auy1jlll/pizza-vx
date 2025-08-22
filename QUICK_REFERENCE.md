# 🍕 Pizza System - Quick Reference Guide

## Daily Admin Tasks Checklist

### ⏰ Every Hour
- [ ] Check pending orders (Orders → Status: Pending)
- [ ] Update order statuses as items are prepared
- [ ] Monitor kitchen workflow

### 📋 Start of Shift
- [ ] Log into admin panel: `http://localhost:3005/admin/login`
- [ ] Review overnight orders
- [ ] Check system settings are correct
- [ ] Verify menu items are available

### 🔄 During Operations
- [ ] Update order status: Pending → Confirmed → Preparing → Ready → Completed
- [ ] Handle customer inquiries through order details
- [ ] Process any cancellations or refunds

### 📊 End of Shift
- [ ] Review daily sales (Reports → Sales Dashboard)
- [ ] Close completed orders
- [ ] Check for any system issues

---

## Quick Navigation

| Task | Navigation Path |
|------|----------------|
| **View Orders** | Orders |
| **Add Pizza Size** | Pizza Builder → Sizes → + Add Size |
| **Add Topping** | Pizza Builder → Toppings → + Add Topping |
| **Add Menu Item** | Menu Items → + Add Menu Item |
| **View Customers** | Users → Customers |
| **Add Employee** | Users → Employees → + Add Employee |
| **System Settings** | Settings |
| **Sales Reports** | Reports → Sales Dashboard |

---

## Common Menu Updates

### Adding a New Pizza Size
1. Pizza Builder → Sizes
2. Click "+ Add Size"
3. Enter: Name, Base Price, Sort Order
4. Save

### Adding a New Topping
1. Pizza Builder → Toppings
2. Click "+ Add Topping"
3. Enter: Name, Category, Price, Sort Order
4. Save

### Adding a Sandwich
1. Menu Items → + Add Menu Item
2. Fill: Name, Description, Category, Base Price
3. Add customization groups if needed
4. Save

---

## Order Status Workflow

```
🟡 PENDING → 🔵 CONFIRMED → 🟠 PREPARING → 🟢 READY → ⚫ COMPLETED
                    ↓
                🔴 CANCELLED (if needed)
```

### Status Meanings
- **PENDING**: New order, needs confirmation
- **CONFIRMED**: Order accepted, will start soon
- **PREPARING**: Currently being made
- **READY**: Done, ready for pickup/delivery
- **COMPLETED**: Customer received order
- **CANCELLED**: Order was cancelled

---

## Emergency Procedures

### System Down
1. Note orders manually
2. Contact IT support
3. Continue service with paper orders
4. Enter orders into system when restored

### Wrong Order
1. Find order in Orders section
2. Click to expand details
3. Update status to CANCELLED
4. Create new order with correct details
5. Notify customer of delay

### Customer Complaint
1. Locate customer in Users → Customers
2. View their order history
3. Check order details for issues
4. Process refund/replacement as needed
5. Add notes to customer profile

---

## Pricing Quick Guide

### Pizza Pricing Formula
```
Final Price = Size Base Price + Crust Modifier + Sauce Modifier + (Topping Price × Quantity)
```

### Example
- Large Pizza (Base: $15.99)
- Stuffed Crust (+$2.00)
- Regular Sauce ($0.00)
- Pepperoni ($1.50)
- Extra Cheese ($1.00)
- **Total: $20.49**

### Menu Item Pricing
```
Final Price = Base Price + Sum(Selected Option Modifiers)
```

---

## Customer Profile Issues

### Customer Shows $0.00 Spending
**Problem**: Missing customer profile
**Solution**:
1. Note customer email
2. Contact technical support
3. Profile will be created to show correct spending

### Customer Can't Sign In
**Problem**: Account issues
**Solution**:
1. Users → Customers
2. Find customer by email
3. Check if account is "Active"
4. Reset password if needed

---

## Technical Support Quick Fixes

### Page Won't Load
1. Refresh browser (Ctrl+F5)
2. Clear browser cache
3. Try different browser
4. Check internet connection

### Data Not Saving
1. Check network connection
2. Try saving again
3. Refresh page and retry
4. Contact IT if persistent

### Orders Missing
1. Check date filters
2. Check status filters
3. Try "Show All" option
4. Refresh page

---

## Contact Quick Reference

| Issue Type | Contact |
|------------|---------|
| **System Down** | IT Support (Immediate) |
| **Order Issues** | Use admin panel |
| **Customer Complaints** | Customer Service Manager |
| **Payment Problems** | Accounting Department |
| **Training Questions** | Operations Manager |

---

**Emergency Admin Access**: Keep this information secure
- **URL**: `http://localhost:3005/admin/login`
- **Support**: Contact your IT administrator

**Print this guide and keep it near the admin computer for quick reference.**
