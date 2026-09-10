import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const [members, products, clients, notifications] = await Promise.all([
      db.query('SELECT id, name, role FROM team_members ORDER BY id'),
      db.query('SELECT id, name, price, active FROM products ORDER BY id'),
      db.query('SELECT id, name, email, active FROM clients ORDER BY id'),
      db.query('SELECT id, title, message, read, created_at FROM notifications ORDER BY created_at DESC LIMIT 10'),
    ]);

    return NextResponse.json({
      members: members.rows,
      products: products.rows,
      clients: clients.rows,
      notifications: notifications.rows,
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'No se pudo conectar con PostgreSQL local. Ejecuta Docker y aplica database/init.sql.' },
      { status: 503 }
    );
  }
}
