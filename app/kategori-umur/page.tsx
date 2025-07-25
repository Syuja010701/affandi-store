"use client";

import { useEffect, useState } from "react";
import TitleContent from "../components/contents/title";
import { useKategoriUmurStore } from "../stores/kategoriUmurStore";
import BaseTable from "../components/table/BaseTable";
import FilterLayout from "../components/contents/filterLayout";
import BaseInput from "../components/input/BaseInput";
import BaseModal from "../components/modal/baseModal";

export default function KategoriUmurPage() {
  const { items, fetchItems, addItem, isLoading, updateItem, deleteItem } =
    useKategoriUmurStore();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [titleModal, setTitleModal] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filtered = items.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (row: any) => {
    setOpen(true);
    setTitleModal(`Edit kategori Umur ${row.name}`);
    setId(row.id);
    setName(row.name);
  };

  const clearStare = () => {
    setId("");
    setName("");
    setOpen(false);
  };

  const handleSave = async () => {
    if (id) {
      await updateItem(Number(id), { name });
      clearStare();
    } else {
      await addItem({ name });
      clearStare();
    }
  };
  const handleRemove = (id: number) => {
    if (confirm("Delete this kategori umur?")) deleteItem(id);
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "action", header: "Action" },
  ];

  const data = filtered.map((kategoriUmur) => ({
    ...kategoriUmur,
    action: (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(kategoriUmur)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleRemove(Number(kategoriUmur.id))}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <>
      <TitleContent
        title="kategori umur"
        contentButton="Tambah kategori umur baru"
        onClick={() => {
          clearStare();
          setOpen(true);
          setTitleModal("Tambah kategori umur Baru");
        }}
      />
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <FilterLayout>
            <BaseInput
              type="search"
              id="search"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FilterLayout>
          <BaseTable columns={columns} data={data} />
          <BaseModal
            open={open}
            onClose={() => setOpen(false)}
            title={titleModal}
            size="lg"
            primaryAction={{
              label: isLoading ? "loading" : "Simpan",
              onClick: () => handleSave(),
              disableButton:
                isLoading ||
                !name.trim() 
            }}
            secondaryAction={{
              label: "Batal",
              disableButton: isLoading,
              onClick: () => setOpen(false),
            }}
          >
            <BaseInput
              type="text"
              id="name"
              className="mb-2"
              label="Name"
              placeholder="Masukkan nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
           
          </BaseModal>
        </>
      )}
    </>
  );
}
