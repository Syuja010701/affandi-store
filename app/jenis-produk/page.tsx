"use client";

import { useEffect, useState } from "react";
import TitleContent from "../components/contents/title";
import { useJenisProdukStore } from "../stores/jenisProdukStore";
import BaseTable from "../components/table/BaseTable";
import FilterLayout from "../components/contents/filterLayout";
import BaseInput from "../components/input/BaseInput";
import BaseModal from "../components/modal/baseModal";

export default function JenisProdukPage() {
  const { items, fetchItems, addItem, isLoading, updateItem, deleteItem } =
    useJenisProdukStore();

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
    setTitleModal(`Edit jenisProduk ${row.name}`);
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
    if (confirm("Delete this jenis produk?")) deleteItem(id);
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "action", header: "Action" },
  ];

  const data = filtered.map((jenisProduk) => ({
    ...jenisProduk,
    action: (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(jenisProduk)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleRemove(Number(jenisProduk.id))}
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
        title="Jenis Produk"
        contentButton="Tambah jenis produk baru"
        onClick={() => {
          clearStare();
          setOpen(true);
          setTitleModal("Tambah jenis produk Baru");
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
