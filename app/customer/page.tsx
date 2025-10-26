"use client";

import { useEffect, useState } from "react";
import TitleContent from "../components/contents/title";
import { useCustomerStore } from "../stores/customerStore";
import BaseTable from "../components/table/BaseTable";
import FilterLayout from "../components/contents/filterLayout";
import BaseInput from "../components/input/BaseInput";
import BaseModal from "../components/modal/baseModal";
import BaseTextarea from "../components/input/BaseTextArea";

export default function CustomerPage() {
  const { items, fetchItems, addItem, isLoading, updateItem, deleteItem } =
    useCustomerStore();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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
    setTitleModal(`Edit Customer ${row.name}`);
    setId(row.id);
    setName(row.name);
    setPhone(row.phone);
    setAddress(row.address);
  };

  const clearStare = () => {
    setId("");
    setName("");
    setPhone("");
    setAddress("");
    setOpen(false);
  };

  const handleSave = async () => {
    if (id) {
      await updateItem(Number(id), { name, phone, address });
      clearStare();
    } else {
      await addItem({ name, phone, address });
      clearStare();
    }
  };
  const handleRemove = (id: number) => {
    if (confirm("Delete this customer?")) deleteItem(id);
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "phone", header: "Phone" },
    { key: "address", header: "Addres" },
    { key: "action", header: "Action" },
  ];

  const data = filtered.map((customer) => ({
    ...customer,
    action: (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(customer)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleRemove(Number(customer.id))}
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
        title="Customer"
        contentButton="Tambah jenis customer baru"
        onClick={() => {
          clearStare();
          setOpen(true);
          setTitleModal("Tambah Customer Baru");
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
            <BaseInput
              type="text"
              id="phone"
              className="mb-2"
              label="Phone"
              placeholder="Masukkan no hp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            /><BaseTextarea
              id="address"
              className="mb-2"
              label="Address"
              placeholder="Masukkan alamat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
           
          </BaseModal>
        </>
      )}
    </>
  );
}
