"use client";

import { useEffect, useState } from "react";
import TitleContent from "../components/contents/title";
import { useUserStore } from "../stores/userStore";
import BaseTable from "../components/table/BaseTable";
import FilterLayout from "../components/contents/filterLayout";
import BaseInput from "../components/input/BaseInput";
import BaseModal from "../components/modal/baseModal";

export default function UserPage() {
  const { users, fetchUsers, addUser, isLoading, updateUser, deleteUser } =
    useUserStore();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [titleModal, setTitleModal] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (row: any) => {
    setOpen(true);
    setTitleModal(`Edit user ${row.name}`);
    setId(row.id);
    setName(row.name);
    setUsername(row.username);
  };

  const clearStare = () => {
    setId("");
    setName("");
    setOpen(false);
    setUsername("");
    setPassword("");
  };

  const handleSave = async () => {
    if (id) {
      await updateUser(Number(id), { name, username, password });
      clearStare();
    } else {
      await addUser({ name, username, password });
      clearStare();
    }
  };
  const handleRemove = (id: number) => {
    if (confirm("Delete this user?")) deleteUser(id);
  };

  const columns = [
    { key: "username", header: "Username" },
    { key: "name", header: "Name" },
    { key: "action", header: "Action" },
  ];

  const data = filtered.map((user) => ({
    ...user,
    action: (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(user)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleRemove(Number(user.id))}
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
        title="Users"
        contentButton="Tambah user baru"
        onClick={() => {
          clearStare();
          setOpen(true);
          setTitleModal("Tambah User Baru");
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
                !name.trim() ||
                !username.trim() ||
                !password.trim(),
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
              className="mb-2"
              id="username"
              label="Username"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <BaseInput
              type="password"
              id="password"
              className="mb-2"
              label="Password"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </BaseModal>
        </>
      )}
    </>
  );
}
