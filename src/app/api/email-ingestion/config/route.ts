import prisma from '@/lib/prisma';
import type { EmailConfig } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<EmailConfig[]>> {
    const configs = await prisma.emailConfig.findMany();
    return NextResponse.json(configs);
}

export async function POST(req: Request): Promise<NextResponse<EmailConfig>> {
    const data: EmailConfig = await req.json();
    const newConfig = await prisma.emailConfig.create({ data });
    return NextResponse.json(newConfig);
}

export async function PUT(req: Request): Promise<NextResponse<EmailConfig>> {
    const data: EmailConfig = await req.json();
    const updatedConfig = await prisma.emailConfig.update({
        where: { id: data.id },
        data,
    });
    return NextResponse.json(updatedConfig);
}
