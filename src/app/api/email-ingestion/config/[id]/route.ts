import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Response =
    | {
          success: true;
      }
    | {
          success: false;
          error: string;
      };

export async function DELETE(
    _: Request,
    { params }: { params: { id: string } },
) {
    try {
        await prisma.emailConfig.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: (error as Error).message,
        });
    }
}
