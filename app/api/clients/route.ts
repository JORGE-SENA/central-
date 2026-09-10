import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!name || !email || !email.includes('@')) {
      return NextResponse.json({ error: 'Nombre y correo válido son obligatorios.' }, { status: 400 });
    }
    const result = await db.query(
      'INSERT INTO clients (name, email) VALUES ($1, $2) RETURNING id, name, email, active',
      [name, email]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Client creation failed:', error);
    return NextResponse.json({ error: 'No se pudo crear el cliente.' }, { status: 500 });
  }
}
