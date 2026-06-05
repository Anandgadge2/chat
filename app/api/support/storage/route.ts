import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST: Save manual hosting storage reading
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      totalStorageGb,
      usedStorageGb,
      publicHtmlSizeGb,
      databaseSizeGb,
      emailStorageGb,
      backupSizeGb,
      logsSizeGb,
      temporaryFilesSizeGb,
      lastCheckedAt
    } = body;

    // Validate inputs (ensure they are numbers)
    const total = parseFloat(totalStorageGb);
    const used = parseFloat(usedStorageGb);
    const pubHtml = parseFloat(publicHtmlSizeGb || 0);
    const dbSize = parseFloat(databaseSizeGb || 0);
    const emailSize = parseFloat(emailStorageGb || 0);
    const backupSize = parseFloat(backupSizeGb || 0);
    const logsSize = parseFloat(logsSizeGb || 0);
    const tempSize = parseFloat(temporaryFilesSizeGb || 0);

    if (isNaN(total) || isNaN(used) || total <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid storage sizes. Total storage must be greater than zero.'
      }, { status: 400 });
    }

    const available = Math.max(0, total - used);
    const checkedDate = lastCheckedAt ? new Date(lastCheckedAt) : new Date();

    const record = await prisma.hostingStorageRecord.create({
      data: {
        totalStorageGb: total,
        usedStorageGb: used,
        availableStorageGb: available,
        publicHtmlSizeGb: pubHtml,
        databaseSizeGb: dbSize,
        emailStorageGb: emailSize,
        backupSizeGb: backupSize,
        logsSizeGb: logsSize,
        temporaryFilesSizeGb: tempSize,
        lastCheckedAt: checkedDate,
      },
    });

    return NextResponse.json({
      success: true,
      data: record,
      message: 'Hosting storage record saved successfully.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving storage record:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save hosting storage details.'
    }, { status: 500 });
  }
}

// GET: Retrieve latest storage log and historical list
export async function GET(request: NextRequest) {
  try {
    // Get latest record
    const latest = await prisma.hostingStorageRecord.findFirst({
      orderBy: {
        lastCheckedAt: 'desc',
      },
    });

    // Get historical trend (last 10 records)
    const history = await prisma.hostingStorageRecord.findMany({
      orderBy: {
        lastCheckedAt: 'asc',
      },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      latest: latest || null,
      history,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching hosting storage details:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve hosting storage details.'
    }, { status: 500 });
  }
}
