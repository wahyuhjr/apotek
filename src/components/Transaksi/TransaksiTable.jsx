"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TransaksiTable() {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama_pelanggan: "",
    nama_obat: "",
    tanggal: "",
    jumlah: "",
    harga: "",
  });

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async () => {
    try {
      const response = await fetch("/api/transaksi");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setTransaksi(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({
      id_pelanggan: "",
      id_obat: "",
      jumlah: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData); // Debugging

    try {
      const response = await fetch("/api/transaksi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add data");
      }
      const addedTransaksi = await response.json();
      setTransaksi([...transaksi, addedTransaksi]);
      setFormData({
        id_pelanggan: "",
        id_obat: "",
        jumlah: "",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm(
        "Apakah Anda yakin ingin menghapus data ini?"
      );

      if (!confirmed) return;

      const response = await fetch(`/api/transaksi/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      setTransaksi(transaksi.filter((item) => item.id !== id));

      alert("Data berhasil dihapus");
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setShowAddForm(true);
    setFormData({
      id_pelanggan: item.id_pelanggan,
      id_obat: item.id_obat,
      jumlah: item.jumlah,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Updating transaction with ID:", editingId);
    console.log("Form data:", formData);
  
    try {
      const response = await fetch(`/api/transaksi/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error("Failed to update data");
      }
  
      const updatedTransaksi = await response.json();
      setTransaksi(
        transaksi.map((item) =>
          item.id === editingId ? updatedTransaksi : item
        )
      );
      setEditingId(null);
      setShowAddForm(false);
      setFormData({
        id_pelanggan: "",
        id_obat: "",
        jumlah: "",
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6 text-red-500">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>Daftar Transaksi</CardTitle>
        {!editingId && (
          <Button
            onClick={handleAdd}
            className="bg-blue-300 rounded-xl w-[100px] pt-3"
          >
            Add Data
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {(showAddForm || editingId) && (
          <form
            onSubmit={editingId ? handleUpdate : handleSubmit}
            className="mb-4 space-y-4"
          >
            <Input
              type="number"
              name="id_pelanggan"
              placeholder="ID Pelanggan"
              value={formData.id_pelanggan}
              onChange={handleInputChange}
              required
            />
            <Input
              type="number"
              name="id_obat"
              placeholder="ID Obat"
              value={formData.id_obat}
              onChange={handleInputChange}
              required
            />
            <Input
              type="integer"
              name="jumlah"
              placeholder="Jumlah"
              value={formData.jumlah}
              onChange={handleInputChange}
              required
            />
            <div className="space-x-2">
              <Button variant="outline" type="submit">
                {editingId ? "Update" : "Submit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData({
                    nama_transaksi: "",
                    alamat: "",
                    no_telepon: "",
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama Pelanggan</TableHead>
              <TableHead>Nama Obat</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transaksi.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nama_pelanggan}</TableCell>
                <TableCell>{item.nama_obat}</TableCell>
                <TableCell>{item.tanggal}</TableCell>
                <TableCell>{item.jumlah}</TableCell>
                <TableCell className="space-x-2">
                  <Button onClick={() => handleEdit(item)} variant="outline">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    variant="outline"
                    className="bg-red-500 rounded-xl text-white"
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
