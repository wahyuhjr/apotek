import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM Obat ORDER BY id LIMIT 10');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request){
  try {
    const body = await request.json()
    const {nama_obat,kadaluarsa,harga} = body;

    const query = `
      INSERT INTO obat(nama_obat,kadaluarsa,harga)
      VALUES ($1,$2,$3)
      RETURNING *
    `;

    const values = [nama_obat,kadaluarsa,harga];
    const result = await pool.query(query,values)

    return NextResponse.json(result.rows[0], { status: 201 })

  } catch (error) {
      console.log("error add product", error)

      return NextResponse.json({
        error: "error to add product"
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request){
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if(!id){
      return NextResponse.json({error: "id is required"}, {status: 400})
    }
    
    //query untuk menghapus data by ID
    const query = "DELETE FROM OBAT where ID = $1 RETURNING *";
    const value = [id]
    const result = await pool.query(query,value)

    if(result.rowCount === 0){
      return NextResponse.json({ error: "product not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "delete product successfully", deleted: result.rows[0]
    },
    { status: 200 }
  ) 


  } catch (error) {
    console.log("error delete product", error)
    return NextResponse.json({
      error: "failed to deleted data"
    }, { status: 500 })
  }
}

export async function PUT(request){
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if(!id){
      return NextResponse.json({error: "id is required"}, {status: 400})
    }

    const body = await request.json();
    const {nama_obat, kadaluarsa,harga} = body;

    const query = `
    UPDATE obat SET 
    nama_obat = $1, kadaluarsa = $2, harga = $3
    WHERE id = $4
    RETURNING *
    `;

    const values = [nama_obat,kadaluarsa,harga,id];
    const result = await pool.query(query,values);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Obat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });


}
  catch (error){
    console.log('Error updating product:', error);

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

