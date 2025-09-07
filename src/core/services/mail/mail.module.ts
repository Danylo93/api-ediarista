import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const enabled = (config.get('MAIL_ENABLED') ?? 'true') === 'true';

        // Se desativado, não conecta em servidor nenhum:
        if (!enabled) {
          return {
            transport: { jsonTransport: true }, // Nodemailer “no-op”
            defaults: { from: 'Disabled <disabled@local.test>' },
            template: {
              dir: join(__dirname, 'templates'),
              adapter: new HandlebarsAdapter(),
              options: { strict: true },
            },
          };
        }

        // (quando reativar, volta a usar seu SMTP normal)
        return {
          transport: {
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT ?? 587),
            secure: (process.env.MAIL_PORT === '465'),
            auth: {
              user: process.env.MAIL_USER ?? 'apikey',
              pass: process.env.MAIL_PASS ?? process.env.SENDGRID_API_KEY,
            },
          },
          defaults: { from: process.env.MAIL_FROM },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
