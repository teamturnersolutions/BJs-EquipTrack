# **App Name**: InvTrack Pro

## Core Features:

- Dashboard & Navigation: A clear home screen with navigation buttons for Check Out Equipment, Check In Equipment, View Inventory, and Perform Audit.
- Excel Data Integration: Backend integration to read and write data to the specified 'TeamMembers' and 'Inventory' Excel worksheets.
- Equipment Checkout Workflow: Guided interface allowing a team member to select their name and one or more inventory items, updating the Excel workbook (Status, CheckedOutBy, CheckedOutDate).
- Equipment Check-In Workflow: Guided interface allowing a team member to select their name and items they are returning, updating the Excel workbook (Status, CheckedOutBy, CheckedInDate).
- Inventory Viewer: Gallery view displaying all equipment details (ItemName, Status, Assigned To, Last Check-Out/Check-In Date) with filters for 'Available' and 'Checked Out' items.
- Audit Process: Interface for users to confirm stock presence for each inventory item during an audit.
- Audit Report & Email Trigger: Generate a summary report of audit mismatches (missing or incorrectly marked items) and trigger an external Power Automate workflow to send results via email.

## Style Guidelines:

- Primary color: A serene and professional blue (#2896BA), reflecting efficiency and organization.
- Background color: A very light, clean blue-gray (#F0F4F5), providing a neutral canvas that complements the primary color in a light scheme.
- Accent color: A contrasting yet analogous green-blue (#43D8B0), used for interactive elements and highlights to ensure good visual distinction.
- Body and headline font: 'Inter' (sans-serif) for its modern, clear, and objective aesthetic, ensuring excellent readability for data-rich displays.
- Utilize a consistent set of clean, line-style icons for navigation, status indicators, and actions like check-out, check-in, and audit.
- Implement a structured and intuitive layout with a clear navigation hierarchy, card-based display for inventory items, and organized forms for check-in/out processes.
- Subtle and functional animations for UI feedback, such as smooth transitions between views and confirmation prompts after data submission.