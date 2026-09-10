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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const price = Number(body.price);

    if (!name || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: 'Nombre y precio válido son obligatorios.' }, { status: 400 });
    }

    const result = await db.query(
      'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id, name, price, active',
      [name, price]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Product creation failed:', error);
    return NextResponse.json({ error: 'No se pudo crear el producto.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);
    const active = Boolean(body.active);

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: 'Producto inválido.' }, { status: 400 });
    }

    const result = await db.query(
      'UPDATE products SET active = $1 WHERE id = $2 RETURNING id, name, price, active',
      [active, id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Product update failed:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el producto.' }, { status: 500 });
  }
}
