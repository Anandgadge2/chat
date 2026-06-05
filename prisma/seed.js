const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data
  await prisma.ticketNote.deleteMany({});
  await prisma.ticketStatusHistory.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.supportStaff.deleteMany({});
  await prisma.hostingStorageRecord.deleteMany({});

  console.log('Cleared existing data.');

  // 2. Seed support staff
  const staff = [
    { name: 'Alice Smith', email: 'alice@pugarch.com', role: 'Admin', active: true },
    { name: 'Bob Jones', email: 'bob@pugarch.com', role: 'Support', active: true },
    { name: 'Charlie Brown', email: 'charlie@pugarch.com', role: 'Support', active: true },
    { name: 'Diana Prince', email: 'diana@pugarch.com', role: 'Support', active: false },
  ];

  for (const s of staff) {
    await prisma.supportStaff.create({ data: s });
  }
  console.log('Seeded support staff.');

  // 3. Seed hosting storage records (history of last 5 days)
  const storageRecords = [
    {
      totalStorageGb: 100,
      usedStorageGb: 65.4,
      availableStorageGb: 34.6,
      publicHtmlSizeGb: 32.1,
      databaseSizeGb: 12.4,
      emailStorageGb: 15.2,
      backupSizeGb: 4.2,
      logsSizeGb: 1.1,
      temporaryFilesSizeGb: 0.4,
      lastCheckedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      totalStorageGb: 100,
      usedStorageGb: 68.2,
      availableStorageGb: 31.8,
      publicHtmlSizeGb: 33.2,
      databaseSizeGb: 13.1,
      emailStorageGb: 16.0,
      backupSizeGb: 4.3,
      logsSizeGb: 1.2,
      temporaryFilesSizeGb: 0.4,
      lastCheckedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      totalStorageGb: 100,
      usedStorageGb: 72.8,
      availableStorageGb: 27.2,
      publicHtmlSizeGb: 35.5,
      databaseSizeGb: 14.2,
      emailStorageGb: 17.1,
      backupSizeGb: 4.3,
      logsSizeGb: 1.3,
      temporaryFilesSizeGb: 0.4,
      lastCheckedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      totalStorageGb: 100,
      usedStorageGb: 78.5,
      availableStorageGb: 21.5,
      publicHtmlSizeGb: 38.0,
      databaseSizeGb: 15.0,
      emailStorageGb: 18.2,
      backupSizeGb: 4.5,
      logsSizeGb: 2.2,
      temporaryFilesSizeGb: 0.6,
      lastCheckedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      totalStorageGb: 100,
      usedStorageGb: 82.1,
      availableStorageGb: 17.9,
      publicHtmlSizeGb: 40.2,
      databaseSizeGb: 15.6,
      emailStorageGb: 19.1,
      backupSizeGb: 4.6,
      logsSizeGb: 2.0,
      temporaryFilesSizeGb: 0.6,
      lastCheckedAt: new Date(),
    },
  ];

  for (const record of storageRecords) {
    await prisma.hostingStorageRecord.create({ data: record });
  }
  console.log('Seeded hosting storage records.');

  // 4. Seed mock support tickets
  const now = new Date();
  const daysAgo = (num) => new Date(now.getTime() - num * 24 * 60 * 60 * 1000);

  const mockTickets = [
    {
      ticketId: 'TKT-2026-0001',
      userName: 'John Doe',
      userMobile: '+15550199',
      userEmail: 'john.doe@example.com',
      category: 'Billing',
      title: 'Double charged for monthly subscription',
      description: 'I noticed my credit card was billed twice for the June subscription cycle. Please refund one of the charges.',
      priority: 'High',
      status: 'Resolved',
      language: 'en',
      assignedTo: 'Alice Smith',
      repeatedGroup: 'billing-double-charge',
      resolutionComment: 'Refund processed via Stripe dashboard. User informed via email.',
      createdAt: daysAgo(5),
      resolvedAt: daysAgo(4),
    },
    {
      ticketId: 'TKT-2026-0002',
      userName: 'Sarah Jenkins',
      userMobile: '+15550233',
      userEmail: 'sarah.j@example.com',
      category: 'App Bug',
      title: 'App crashes on schedule sync screen',
      description: 'Every time I open the dispatch schedule tab and try to sync, the app immediately closes. Using iPhone 14 Pro, iOS 17.4.',
      priority: 'High',
      status: 'In Progress',
      language: 'en',
      assignedTo: 'Bob Jones',
      repeatedGroup: 'sync-crash',
      createdAt: daysAgo(4),
    },
    {
      ticketId: 'TKT-2026-0003',
      userName: 'Michael Chang',
      userMobile: '+15550422',
      userEmail: 'mchang@example.com',
      category: 'Dispatch',
      title: 'Job assignment notifications not received',
      description: 'My technicians are not getting push notifications when a job is assigned to them. They have to manually refresh.',
      priority: 'Medium',
      status: 'Open',
      language: 'en',
      assignedTo: 'Charlie Brown',
      repeatedGroup: 'notification-delay',
      createdAt: daysAgo(3),
    },
    {
      ticketId: 'TKT-2026-0004',
      userName: 'Lisa Gellar',
      userMobile: '+15550911',
      userEmail: 'lisa.g@example.com',
      category: 'Account Access',
      title: 'Forgot password reset link not arriving',
      description: 'I requested a password reset email three times but nothing is showing up in my inbox or spam folder. Need access urgently.',
      priority: 'Critical',
      status: 'Open',
      language: 'en',
      assignedTo: 'Alice Smith',
      repeatedGroup: 'password-reset-email',
      createdAt: daysAgo(2),
    },
    {
      ticketId: 'TKT-2026-0005',
      userName: 'Roberto Gomez',
      userMobile: '+34600111222',
      userEmail: 'roberto.gomez@gmail.com',
      category: 'App Bug',
      title: 'App closes down during schedule sync',
      description: 'El app se cierra cuando intento sincronizar el horario de trabajo. Por favor ayuda rápido.',
      priority: 'High',
      status: 'Open',
      language: 'es',
      assignedTo: 'Bob Jones',
      repeatedGroup: 'sync-crash', // Matches sync-crash repeated group!
      createdAt: daysAgo(1),
    },
    {
      ticketId: 'TKT-2026-0006',
      userName: 'Frank Miller',
      userMobile: '+15550344',
      userEmail: 'fmiller@example.com',
      category: 'General Inquiry',
      title: 'How to export monthly invoice history?',
      description: 'Is there a way to export all invoices from last year into a single PDF or CSV file? Let me know the steps.',
      priority: 'Low',
      status: 'Closed',
      language: 'en',
      assignedTo: 'Charlie Brown',
      resolutionComment: 'Guided user to Settings > Billing > Export Invoices. Closed ticket.',
      createdAt: daysAgo(5),
      resolvedAt: daysAgo(4),
    },
    {
      ticketId: 'TKT-2026-0007',
      userName: 'Emily Watson',
      userMobile: '+15558833',
      userEmail: 'emily.w@example.com',
      category: 'Dispatch',
      title: 'Schedule synchronization causes crash',
      description: 'Doing schedule sync causes the app to crash completely. This is happening on multiple devices today.',
      priority: 'Critical',
      status: 'Open',
      language: 'en',
      repeatedGroup: 'sync-crash', // Matches sync-crash repeated group!
      createdAt: daysAgo(0.5),
    },
    {
      ticketId: 'TKT-2026-0008',
      userName: 'George Clooney',
      userMobile: '+15557766',
      userEmail: 'george@clooney.com',
      category: 'cPanel / Hosting',
      title: 'Database connection time outs',
      description: 'We are getting database connection timeout errors in our system. Is the server disk full or having load issues?',
      priority: 'Critical',
      status: 'Open',
      language: 'en',
      createdAt: daysAgo(0.1),
    }
  ];

  for (const t of mockTickets) {
    const createdTicket = await prisma.supportTicket.create({
      data: {
        ticketId: t.ticketId,
        userName: t.userName,
        userMobile: t.userMobile,
        userEmail: t.userEmail,
        category: t.category,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        language: t.language,
        assignedTo: t.assignedTo,
        repeatedGroup: t.repeatedGroup,
        resolutionComment: t.resolutionComment,
        createdAt: t.createdAt,
        resolvedAt: t.resolvedAt,
      }
    });

    // Add status history
    await prisma.ticketStatusHistory.create({
      data: {
        ticketId: createdTicket.id,
        oldStatus: null,
        newStatus: t.status,
        changedBy: 'System Seed',
        createdAt: t.createdAt,
      }
    });

    // If resolved/closed, add historical transitions
    if (t.status === 'Resolved' || t.status === 'Closed') {
      await prisma.ticketStatusHistory.create({
        data: {
          ticketId: createdTicket.id,
          oldStatus: t.status === 'Closed' ? 'Resolved' : 'Open',
          newStatus: t.status,
          changedBy: t.assignedTo,
          createdAt: t.resolvedAt || daysAgo(4),
        }
      });
    }

    // Add some notes
    if (t.status === 'In Progress' && t.ticketId === 'TKT-2026-0002') {
      await prisma.ticketNote.create({
        data: {
          ticketId: createdTicket.id,
          note: 'Investigating crash logs. It seems related to a null pointer exception in the dispatch sync helper.',
          addedBy: 'Bob Jones',
          createdAt: daysAgo(3),
        }
      });
    }

    if (t.ticketId === 'TKT-2026-0005') {
      await prisma.ticketNote.create({
        data: {
          ticketId: createdTicket.id,
          note: 'User translation is: App closes down when I try to sync the work schedule. Please help quickly.',
          addedBy: 'Gemini Auto-Translator',
          createdAt: daysAgo(1),
        }
      });
    }
  }

  console.log('Seeded mock tickets, status history, and notes successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
