import prisma from '@/lib/prisma';
import { fetchEmailsIMAP } from '@/lib/utils';
import { NextResponse } from 'next/server';

type Response =
    | { success: true; message: 'Emails checked' }
    | { success: false; error: string };

export async function GET(): Promise<NextResponse<Response>> {
    console.log('Checking emails');
    try {
        const configs = await prisma.emailConfig.findMany();

        for (const config of configs) {
            await fetchEmailsIMAP(config);
        }

        return NextResponse.json(
            { success: true, message: 'Emails checked' },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: (error as Error).message,
        });
    }
}
