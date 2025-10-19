# Heroicons Integration Guide

## Overview
Heroicons are beautiful, hand-crafted SVG icons by the makers of Tailwind CSS. They're the same icons used in Blade UI Kit for Laravel. We've installed `@heroicons/react` for use in your React app.

## Installation
```bash
npm install @heroicons/react
```
✅ Already installed!

## Icon Styles

Heroicons come in **3 styles**:

### 1. **Outline** (24x24, 1.5px stroke)
- Default style
- Perfect for navigation, buttons, and general UI
- Import from: `@heroicons/react/24/outline`

### 2. **Solid** (24x24, filled)
- Bold, filled icons
- Great for active states, badges, and emphasis
- Import from: `@heroicons/react/24/solid`

### 3. **Mini** (20x20, filled)
- Smaller, space-efficient
- Perfect for inline text, tight spaces
- Import from: `@heroicons/react/20/solid`

## Basic Usage

### Example 1: Simple Icon
```tsx
import { HomeIcon } from '@heroicons/react/24/outline';

function MyComponent() {
  return (
    <HomeIcon className="w-6 h-6 text-gray-500" />
  );
}
```

### Example 2: Solid Icon
```tsx
import { HeartIcon } from '@heroicons/react/24/solid';

function LikeButton() {
  return (
    <button className="flex items-center gap-2">
      <HeartIcon className="w-5 h-5 text-red-500" />
      <span>Like</span>
    </button>
  );
}
```

### Example 3: Mini Icon (inline with text)
```tsx
import { CheckCircleIcon } from '@heroicons/react/20/solid';

function SuccessMessage() {
  return (
    <div className="flex items-center gap-2">
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
      <span>Success!</span>
    </div>
  );
}
```

## Updating Your Sidebar

Here's how to replace Lucide React icons with Heroicons:

### Before (Lucide React):
```tsx
import {
  LayoutDashboard,
  Users,
  Receipt,
  Settings,
  ChevronLeft,
  Building2,
} from 'lucide-react';
```

### After (Heroicons):
```tsx
import {
  Squares2X2Icon as DashboardIcon,  // Grid icon
  UsersIcon,
  DocumentTextIcon as InvoiceIcon,
  CogIcon as SettingsIcon,
  ChevronLeftIcon,
  BuildingOfficeIcon as ClientsIcon,
  UserGroupIcon as StaffIcon,
} from '@heroicons/react/24/outline';
```

## Popular Icons for Your App

### Navigation Icons (Outline)
```tsx
import {
  HomeIcon,              // Home/Dashboard
  Squares2X2Icon,        // Dashboard (grid)
  UsersIcon,             // Prospects/Users
  DocumentTextIcon,      // Invoices/Documents
  BuildingOfficeIcon,    // Clients
  UserGroupIcon,         // Staff/Team
  Cog6ToothIcon,         // Settings
  BellIcon,              // Notifications
  ChartBarIcon,          // Reports/Analytics
  InboxIcon,             // Inbox
  FolderIcon,            // Projects
} from '@heroicons/react/24/outline';
```

### Action Icons (Outline)
```tsx
import {
  PlusIcon,              // Add/Create
  PencilIcon,            // Edit
  TrashIcon,             // Delete
  ArrowDownTrayIcon,     // Download
  ArrowUpTrayIcon,       // Upload
  MagnifyingGlassIcon,   // Search
  FunnelIcon,            // Filter
  XMarkIcon,             // Close/Cancel
  CheckIcon,             // Confirm/Success
  EllipsisVerticalIcon,  // More options (3 dots)
} from '@heroicons/react/24/outline';
```

### Status Icons (Solid)
```tsx
import {
  CheckCircleIcon,       // Success (green)
  XCircleIcon,           // Error (red)
  ExclamationCircleIcon, // Warning (yellow)
  InformationCircleIcon, // Info (blue)
  ClockIcon,             // Pending/Time
} from '@heroicons/react/24/solid';
```

### Navigation Icons (Outline)
```tsx
import {
  ArrowLeftIcon,         // Back
  ArrowRightIcon,        // Forward
  ChevronLeftIcon,       // Collapse
  ChevronRightIcon,      // Expand
  ChevronUpIcon,         // Up
  ChevronDownIcon,       // Down
  Bars3Icon,             // Menu (hamburger)
} from '@heroicons/react/24/outline';
```

## Complete Sidebar Update Example

```tsx
import { Link, useLocation } from 'react-router-dom';
import {
  Squares2X2Icon,
  UsersIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { icon: Squares2X2Icon, label: 'Dashboard', path: '/dashboard' },
  { icon: UsersIcon, label: 'Prospects', path: '/prospects' },
  { icon: DocumentTextIcon, label: 'Invoices', path: '/invoices' },
  { icon: BuildingOfficeIcon, label: 'Clients', path: '/clients' },
  { icon: UserGroupIcon, label: 'Staff', path: '/staff' },
  { icon: Cog6ToothIcon, label: 'Settings', path: '/settings' },
];

// Use in component
function Sidebar() {
  return (
    <nav>
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.path} to={item.path}>
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

## Icon Sizing

Tailwind classes for common sizes:

```tsx
<Icon className="w-3 h-3" />   // 12px - Mini inline
<Icon className="w-4 h-4" />   // 16px - Small buttons
<Icon className="w-5 h-5" />   // 20px - Standard buttons/nav
<Icon className="w-6 h-6" />   // 24px - Default Heroicons size
<Icon className="w-8 h-8" />   // 32px - Large buttons
<Icon className="w-10 h-10" /> // 40px - Feature icons
<Icon className="w-12 h-12" /> // 48px - Hero sections
```

## Color Classes

```tsx
// Gray scales
<Icon className="text-gray-400" />
<Icon className="text-gray-500" />
<Icon className="text-gray-600" />
<Icon className="text-gray-700" />

// Brand colors
<Icon className="text-primary-500" />
<Icon className="text-primary-600" />

// Status colors
<Icon className="text-green-500" />  // Success
<Icon className="text-red-500" />    // Error
<Icon className="text-yellow-500" /> // Warning
<Icon className="text-blue-500" />   // Info
```

## Active State Example

```tsx
const isActive = location.pathname === item.path;

<Icon className={`w-5 h-5 ${
  isActive ? 'text-primary-600' : 'text-gray-500'
}`} />
```

## Hover Effects

```tsx
<button className="group">
  <Icon className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition-colors" />
</button>
```

## All Available Icons

Browse all 292 icons at:
🔗 **https://heroicons.com/**

You can search by name and copy the React import directly!

## Benefits Over Lucide React

✅ **Designed by Tailwind CSS team** - Perfect integration
✅ **3 style variants** - Outline, Solid, Mini
✅ **Consistent sizing** - 24x24 and 20x20
✅ **Optimized SVGs** - Smaller file sizes
✅ **Same as Blade UI Kit** - What you wanted!
✅ **Modern & clean** - Professional appearance

## Migration Checklist

- [ ] Replace Lucide imports with Heroicons imports
- [ ] Update all icon references in Sidebar
- [ ] Update icons in Dashboard KPI cards
- [ ] Update icons in action buttons (Add, Edit, Delete)
- [ ] Update status badges icons
- [ ] Test on mobile and desktop
- [ ] Verify all icons display correctly

## Need Help?

Visit https://heroicons.com/ to browse and search all available icons!
