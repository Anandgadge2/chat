import prisma from './prisma';

/**
 * Generates a unique, sequential ticket ID for the current year.
 * Format: FSM-YYYY-NNNN (e.g. FSM-2026-0001)
 */
export async function generateNextTicketId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `FSM-${currentYear}-`;

  try {
    // Find the latest ticket created in this year
    const lastTicket = await prisma.supportTicket.findFirst({
      where: {
        ticketId: {
          startsWith: prefix,
        },
      },
      orderBy: {
        ticketId: 'desc',
      },
    });

    let nextNumber = 1;

    if (lastTicket) {
      // Extract the number part from FSM-YYYY-NNNN
      const parts = lastTicket.ticketId.split('-');
      if (parts.length === 3) {
        const lastNumberStr = parts[2];
        const lastNumber = parseInt(lastNumberStr, 10);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
    }

    // Pad the number to 4 digits (e.g. 0042)
    const paddedNumber = String(nextNumber).padStart(4, '0');
    return `${prefix}${paddedNumber}`;
  } catch (error) {
    console.error('Error generating ticket ID:', error);
    // Safe fallback using random and timestamp if database query fails
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}ERR-${randomSuffix}`;
  }
}
