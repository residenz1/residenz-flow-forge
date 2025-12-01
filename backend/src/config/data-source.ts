import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '@database/entities/user.entity';
import { Account } from '@database/entities/account.entity';
import { BankAccount } from '@database/entities/bank-account.entity';
import { Transaction } from '@database/entities/transaction.entity';
import { LedgerEntry } from '@database/entities/ledger-entry.entity';
import { Booking } from '@database/entities/booking.entity';
import { KycVerification } from '@database/entities/kyc-verification.entity';
import { ChatConversation } from '@database/entities/chat-conversation.entity';
import { ChatMessage } from '@database/entities/chat-message.entity';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'residenz_db',
  entities: [
    User,
    Account,
    BankAccount,
    Transaction,
    LedgerEntry,
    Booking,
    KycVerification,
    ChatConversation,
    ChatMessage,
  ],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
  logging: process.env.DATABASE_LOGGING === 'true',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
