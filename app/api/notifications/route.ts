import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: 'Notificación inválida.' }, { status: 400 });
    }
    const result = await db.query(
      'UPDATE notifications SET read = TRUE WHERE id = $1 RETURNING id, title, message, read, created_at',
      [id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Notificación no encontrada.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Notification update failed:', error);
    return NextResponse.json({ error: 'No se pudo actualizar la notificación.' }, { status: 500 });
  }
}
