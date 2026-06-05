import { SupportTicket } from '@prisma/client';

/**
 * Formats an array of support tickets as a CSV string.
 */
export function exportTicketsToCSV(tickets: SupportTicket[]): string {
  const headers = [
    'Ticket ID',
    'User Name',
    'Mobile Number',
    'Email',
    'Category',
    'Title',
    'Description',
    'Priority',
    'Status',
    'Language',
    'Assigned To',
    'Repeated Group',
    'Created At',
    'Updated At',
    'Resolved At',
    'Resolution Comment'
  ];

  // Helper to escape values for CSV
  const escapeCSV = (val: any): string => {
    if (val === null || val === undefined) return '';
    let stringVal = '';
    if (val instanceof Date) {
      stringVal = val.toISOString();
    } else if (typeof val === 'object') {
      stringVal = JSON.stringify(val);
    } else {
      stringVal = String(val);
    }
    // Escape double quotes and wrap in quotes if it contains quotes, commas or newlines
    if (stringVal.includes('"') || stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('\r')) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
  };

  const rows = tickets.map((t) => [
    t.ticketId,
    t.userName,
    t.userMobile,
    t.userEmail || '',
    t.category,
    t.title,
    t.description,
    t.priority,
    t.status,
    t.language || '',
    t.assignedTo || '',
    t.repeatedGroup || '',
    t.createdAt,
    t.updatedAt,
    t.resolvedAt || '',
    t.resolutionComment || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map(escapeCSV).join(','))
  ].join('\r\n');

  return csvContent;
}
