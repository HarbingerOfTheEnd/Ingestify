import type { EmailConfig } from '@prisma/client';
import Imap from 'imap';
import { type ParsedMail, simpleParser } from 'mailparser';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import prisma from './prisma';

async function downloadPDF(emailConfigId: EmailConfig['id'], mail: ParsedMail) {
    const attachments = mail.attachments || [];

    for (const attachment of attachments) {
        if (attachment.contentType === 'application/pdf') {
            const filePath = join(
                process.cwd(),
                'pdfs',
                attachment.filename ?? 'unknown.pdf',
            );
            console.log(`Saving PDF: ${attachment.filename}`);
            writeFileSync(filePath, attachment.content);

            await prisma.emailMetadata.create({
                data: {
                    emailConfigId,
                    fromAddress: mail.from?.text ?? '',
                    dateReceived: mail.date ?? new Date(),
                    subject: mail.subject ?? '',
                    attachmentFileName: attachment.filename ?? 'unknown.pdf',
                    filePath,
                },
            });

            console.log(`Saved PDF: ${attachment.filename}`);
        }
    }
}

const date = new Date();

export const fetchEmailsIMAP = async (config: EmailConfig) => {
    return await new Promise((resolve, reject) => {
        const imap = new Imap({
            user: config.username ?? config.emailAddress,
            password: config.password ?? '',
            host: config.host ?? '',
            port: config.port ?? 993,
            tls: true,
        });

        imap.once('ready', () => {
            imap.openBox('INBOX', true, (err, _) => {
                if (err) reject(err);

                imap.search(['UNSEEN', ['SINCE', date]], (err, results) => {
                    if (err || !results || results.length === 0) {
                        imap.end();
                        resolve(false);
                    }
                    const fetch = imap.fetch(results, {
                        bodies: '',
                        struct: true,
                    });
                    fetch.on('message', (msg, _) => {
                        msg.on('body', (stream, _) => {
                            let buffer = '';

                            stream.on('data', (chunk) => {
                                buffer += chunk.toString('utf8');
                            });

                            stream.once('end', async () => {
                                const parsedMail = await simpleParser(buffer);
                                await downloadPDF(config.id, parsedMail);
                            });
                        });
                    });

                    fetch.once('end', () => {
                        imap.end();
                        resolve(true);
                    });
                });
            });
        });

        imap.connect();
    });
};
