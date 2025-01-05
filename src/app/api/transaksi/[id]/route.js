import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// DELETE - Menghapus transaksi
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
  

// PUT - Mengupdate transaksi
export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Mengambil ID dari URL

    const body = await request.json();
    const { id_pelanggan, id_obat, jumlah } = body;

    // Validasi input
    if (!id_pelanggan || !id_obat || !jumlah) {
      return NextResponse.json(
        { error: 'id_pelanggan, id_obat, and jumlah are required' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE Transaksi
      SET id_pelanggan = $1, id_obat = $2, jumlah = $3
      WHERE id = $4
      RETURNING *
    `;
    
    const values = [id_pelanggan, id_obat, jumlah, id];
    const result = await pool.query(updateQuery, values);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}
