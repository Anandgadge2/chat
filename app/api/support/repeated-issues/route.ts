import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSuggestedAction } from '@/lib/repeatedIssueDetector';

interface RepeatedIssueItem {
  groupName: string;
  category: string;
  count: number;
  lastReported: Date;
  priority: string;
  suggestedAction: string;
}

const PRIORITY_WEIGHTS: Record<string, number> = {
  'Low': 1,
  'Medium': 2,
  'High': 3,
  'Critical': 4,
};

export async function GET(request: NextRequest) {
  try {
    // Fetch all tickets with required fields
    const tickets = await prisma.supportTicket.findMany({
      select: {
        repeatedGroup: true,
        category: true,
        priority: true,
        createdAt: true,
      },
    });

    const groupsMap: Record<string, {
      count: number;
      category: string;
      lastReported: Date;
      maxPriority: string;
    }> = {};

    tickets.forEach((t) => {
      // If repeatedGroup isn't set, use the category as the fallback group
      const groupName = t.repeatedGroup || t.category || 'Other';
      const ticketPriority = t.priority || 'Medium';

      if (!groupsMap[groupName]) {
        groupsMap[groupName] = {
          count: 1,
          category: t.category || 'Other',
          lastReported: t.createdAt,
          maxPriority: ticketPriority,
        };
      } else {
        const current = groupsMap[groupName];
        current.count += 1;
        
        // Update last reported date if newer
        if (t.createdAt > current.lastReported) {
          current.lastReported = t.createdAt;
        }

        // Update priority if higher weight
        const currentWeight = PRIORITY_WEIGHTS[current.maxPriority] || 0;
        const newWeight = PRIORITY_WEIGHTS[ticketPriority] || 0;
        if (newWeight > currentWeight) {
          current.maxPriority = ticketPriority;
        }
      }
    });

    // Convert map to list and format
    const list: RepeatedIssueItem[] = Object.keys(groupsMap).map((name) => {
      const details = groupsMap[name];
      return {
        groupName: name,
        category: details.category,
        count: details.count,
        lastReported: details.lastReported,
        priority: details.maxPriority,
        suggestedAction: getSuggestedAction(name),
      };
    });

    // Sort by count descending
    list.sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      data: list,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching repeated issues:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch repeated issues.',
    }, { status: 500 });
  }
}
