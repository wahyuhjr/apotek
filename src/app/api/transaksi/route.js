import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Mengambil semua transaksi
export async function GET() {
  try {
    const query = `
      SELECT 
        t.id,
        p.nama_pelanggan,
        o.nama_obat,
        t.jumlah,
        t.tanggal,
        o.harga
      FROM Transaksi t
      JOIN Pelanggan p ON t.id_pelanggan = p.id
      JOIN Obat o ON t.id_obat = o.id
    `;
    
    const result = await pool.query(query);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error); // Tambahkan logging ini
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST - Membuat transaksi baru
export async function POST(request) {
  try {
    const body = await request.json();
    const { id_pelanggan, id_obat, jumlah } = body;
    
    // Validasi input
    if (!id_pelanggan || !id_obat || !jumlah) {
      return NextResponse.json(
        { error: 'id_pelanggan, id_obat, and jumlah are required' },
        { status: 400 }
      );
    }

    // Cek ketersediaan pelanggan
    const pelangganQuery = 'SELECT id FROM Pelanggan WHERE id = $1';
    const pelangganResult = await pool.query(pelangganQuery, [id_pelanggan]);
    
    if (pelangganResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Pelanggan not found' },
        { status: 404 }
      );
    }

    // Cek ketersediaan obat
    const obatQuery = 'SELECT id FROM Obat WHERE id = $1';
    const obatResult = await pool.query(obatQuery, [id_obat]);
    
    if (obatResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Obat not found' },
        { status: 404 }
      );
    }

    // Insert transaksi
    const insertQuery = `
      INSERT INTO Transaksi (id_pelanggan, id_obat, tanggal, jumlah)
      VALUES ($1, $2, CURRENT_DATE, $3)
      RETURNING *
    `;
    
    const values = [id_pelanggan, id_obat, jumlah];
    const result = await pool.query(insertQuery, values);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
    try {
      const { id } = params;
      const query = 'DELETE FROM transaksi WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
  
      if (result.rowCount === 0) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: 'Transaction deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return NextResponse.json(
        { error: 'Failed to delete transaction' },
        { status: 500 }
      );
    }
  }