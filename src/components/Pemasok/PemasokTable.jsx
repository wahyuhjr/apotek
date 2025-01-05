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

export default function PemasokTable() {
  const [pemasok, setPemasok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama_pemasok: "",
    alamat: "",
    no_telepon: "",
  });

  useEffect(() => {
    fetchPemasok();
  }, []);

  const fetchPemasok = async () => {
    try {
      const response = await fetch("/api/pemasok");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setPemasok(data);
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
      nama_pemasok: "",
      alamat: "",
      no_telepon: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/pemasok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to add data");
      }
      const addedPemasok = await response.json();
      setPemasok([...pemasok, addedPemasok]);
      setFormData({
        nama_pemasok: "",
        alamat: "",
        no_telepon: "",
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

      const response = await fetch(`/api/pemasok?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      setPemasok(pemasok.filter((item) => item.id !== id));

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
      nama_pemasok: item.nama_pemasok,
      alamat: item.alamat,
      no_telepon: item.no_telepon,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/pemasok?id=${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update data");
      }
      const updatedPemasok = await response.json();
      setPemasok(pemasok.map((item) => (item.id === editingId ? updatedPemasok : item)));
      setEditingId(null);
      setShowAddForm(false);
      setFormData({
        nama_pemasok: "",
        alamat: "",
        no_telepon: "",
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
        <CardTitle>Daftar Pemasok</CardTitle>
        {!editingId && <Button onClick={handleAdd} className="bg-blue-300 rounded-xl w-[100px] pt-3">Add Data</Button>}
      </CardHeader>
      <CardContent>
        {(showAddForm || editingId) && (
          <form
            onSubmit={editingId ? handleUpdate : handleSubmit}
            className="mb-4 space-y-4"
          >
            <Input
              type="text"
              name="nama_pemasok"
              placeholder="Nama Pemasok"
              value={formData.nama_pemasok}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              required
            />
            <Input
              type="number"
              name="no_telepon"
              placeholder="no_telepon"
              value={formData.no_telepon}
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
                    nama_pemasok: "",
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
              <TableHead>Nama Pemasok</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>No telepon</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pemasok.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nama_pemasok}</TableCell>
                <TableCell>{item.alamat}</TableCell>
                <TableCell>{item.no_telepon.toLocaleString()}</TableCell>
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
