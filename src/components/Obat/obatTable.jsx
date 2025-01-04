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

export default function ObatTable() {
  const [obat, setObat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama_obat: "",
    kadaluarsa: "",
    harga: "",
  });

  useEffect(() => {
    fetchObat();
  }, []);

  const fetchObat = async () => {
    try {
      const response = await fetch("/api/obat");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setObat(data);
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
      nama_obat: "",
      kadaluarsa: "",
      harga: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/obat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to add data");
      }
      const addedObat = await response.json();
      setObat([...obat, addedObat]);
      setFormData({
        nama_obat: "",
        kadaluarsa: "",
        harga: "",
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

      const response = await fetch(`/api/obat?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      setObat(obat.filter((item) => item.id !== id));

      alert('Data berhasil dihapus');

    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setShowAddForm(true);
    setFormData({
      nama_obat: item.nama_obat,
      kadaluarsa: item.kadaluarsa,
      harga: item.harga,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/obat?id=${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update data");
      }
      const updatedObat = await response.json();
      setObat(obat.map((item) => (item.id === editingId ? updatedObat : item)));
      setEditingId(null);
      setShowAddForm(false);
      setFormData({
        nama_obat: "",
        kadaluarsa: "",
        harga: "",
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
        <CardTitle>Daftar Obat</CardTitle>
        {!editingId && <Button onClick={handleAdd} className="bg-blue-300 rounded-xl w-[100px] p-3">Add Data</Button>}
      </CardHeader>
      <CardContent>
        {(showAddForm || editingId) && (
          <form
            onSubmit={editingId ? handleUpdate : handleSubmit}
            className="mb-4 space-y-4"
          >
            <Input
              type="text"
              name="nama_obat"
              placeholder="Nama Obat"
              value={formData.nama_obat}
              onChange={handleInputChange}
              required
            />
            <Input
              type="date"
              name="kadaluarsa"
              value={formData.kadaluarsa}
              onChange={handleInputChange}
              required
            />
            <Input
              type="number"
              name="harga"
              placeholder="Harga"
              value={formData.harga}
              onChange={handleInputChange}
              required
            />
            <div className="space-x-2">
              <Button variant="outline" type="submit">{editingId ? "Update" : "Submit"}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData({
                    nama_obat: "",
                    kadaluarsa: "",
                    harga: "",
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
              <TableHead>Nama Obat</TableHead>
              <TableHead>Kadaluarsa</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obat.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nama_obat}</TableCell>
                <TableCell>{item.kadaluarsa}</TableCell>
                <TableCell>Rp {item.harga.toLocaleString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button onClick={() => handleEdit(item)} variant="outline">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)} variant="outline" className="bg-red-500 rounded-xl text-white">
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
