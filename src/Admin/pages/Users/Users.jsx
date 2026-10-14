import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Users as UsersIcon,
  RefreshCw,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  X,
  AlertCircle,
  Ban,
  CheckCircle,
} from "lucide-react";

const API_URL = "http://localhost:3000/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Confirmation modal
  const [confirmUser, setConfirmUser] = useState(null);
  const [blocking, setBlocking] = useState(false);

  // ================================
  // FETCH USERS
  // ================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Users fetch error:", error);
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================================
  // FORMAT DATE
  // ================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ================================
  // SEARCH
  // ================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return users;
    }

    return users.filter((user) => {
      return (
        String(user.id || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(user.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(user.email || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(user.phone || "")
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [users, search]);

  // ================================
  // BLOCK / UNBLOCK USER
  // ================================

  const handleBlockUser = async (user) => {
    const newStatus = !user.isBlocked;

    try {
      setError("");

      const response = await fetch(`${API_URL}/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isBlocked: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Update users table
      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                isBlocked: newStatus,
              }
            : item
        )
      );

      // Update selected user
      setSelectedUser((currentUser) => {
        if (currentUser && currentUser.id === user.id) {
          return {
            ...currentUser,
            isBlocked: newStatus,
          };
        }

        return currentUser;
      });

      return true;
    } catch (error) {
      console.error("Block user error:", error);

      setError("Unable to update user status.");

      return false;
    }
  };

  // ================================
  // CONFIRM BLOCK / UNBLOCK
  // ================================

  const handleConfirmBlock = async () => {
    if (!confirmUser) return;

    setBlocking(true);

    const success = await handleBlockUser(confirmUser);

    setBlocking(false);

    if (success) {
      setConfirmUser(null);
    }
  };

  // ================================
  // STATISTICS
  // ================================

  const totalUsers = users.length;

  const blockedUsers = users.filter(
    (user) => user.isBlocked
  ).length;

  const activeUsers = totalUsers - blockedUsers;

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-[#ad4058]"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // ================================
  // UI
  // ================================

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#423640]">
            Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your registered customers.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 rounded-xl bg-[#423640] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#332933]"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* TOTAL */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#423640]">
                {totalUsers}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8e9ed]">
              <UsersIcon
                size={22}
                className="text-[#ad4058]"
              />
            </div>
          </div>
        </div>

        {/* ACTIVE */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Users
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {activeUsers}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
              <CheckCircle
                size={22}
                className="text-green-600"
              />
            </div>
          </div>
        </div>

        {/* BLOCKED */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Blocked Users
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-600">
                {blockedUsers}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <Ban
                size={22}
                className="text-red-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#ad4058]"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-[#f8f5f6]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  User
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Phone
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Registered
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {[...filteredUsers].reverse().map((user) => (

                <tr
                  key={user.id}
                  className="transition hover:bg-[#fdfafb]"
                >

                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8e9ed]">
                        <User
                          size={18}
                          className="text-[#ad4058]"
                        />
                      </div>

                      <div>
                        <p className="font-medium text-[#423640]">
                          {user.name || "No Name"}
                        </p>

                        <p className="text-xs text-gray-400">
                          ID: {user.id}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email || "N/A"}
                  </td>

                  {/* PHONE */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.phone || "N/A"}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(
                      user.createdAt ||
                        user.registeredAt ||
                        user.date
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">

                    {user.isBlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                        <Ban size={13} />
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                        <CheckCircle size={13} />
                        Active
                      </span>
                    )}

                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4">

                    <div className="flex items-center justify-end gap-2">

                      {/* BLOCK / UNBLOCK */}
                      <button
                        onClick={() => setConfirmUser(user)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                          user.isBlocked
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        {user.isBlocked ? (
                          <>
                            <CheckCircle size={14} />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban size={14} />
                            Block
                          </>
                        )}
                      </button>

                      {/* VIEW */}
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="flex items-center gap-1.5 rounded-lg bg-[#f8f5f6] px-3 py-2 text-xs font-medium text-[#423640] transition hover:bg-[#eee8ea]"
                      >
                        <Eye size={14} />
                        View
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* NO USERS */}
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">

            <UsersIcon
              size={40}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-medium text-gray-500">
              No users found
            </p>

          </div>
        )}

      </div>

      {/* ========================================= */}
      {/* USER DETAILS MODAL */}
      {/* ========================================= */}

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <h2 className="text-lg font-bold text-[#423640]">
                  User Details
                </h2>

                <p className="text-sm text-gray-500">
                  Customer information
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL BODY */}
            <div className="space-y-5 p-6">

              {/* PROFILE */}
              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8e9ed]">
                  <User
                    size={28}
                    className="text-[#ad4058]"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#423640]">
                    {selectedUser.name || "No Name"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    User ID: {selectedUser.id}
                  </p>
                </div>

              </div>

              {/* STATUS */}
              <div className="flex items-center justify-between rounded-xl bg-[#f8f5f6] p-4">

                <div>
                  <p className="text-xs text-gray-500">
                    Account Status
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${
                      selectedUser.isBlocked
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {selectedUser.isBlocked
                      ? "Blocked"
                      : "Active"}
                  </p>
                </div>

                <button
                  onClick={() => setConfirmUser(selectedUser)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                    selectedUser.isBlocked
                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  {selectedUser.isBlocked ? (
                    <>
                      <CheckCircle size={14} />
                      Unblock
                    </>
                  ) : (
                    <>
                      <Ban size={14} />
                      Block
                    </>
                  )}
                </button>

              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="text-gray-400"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="text-sm text-[#423640]">
                    {selectedUser.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="text-gray-400"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="text-sm text-[#423640]">
                    {selectedUser.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* DATE */}
              <div className="flex items-center gap-3">
                <Calendar
                  size={18}
                  className="text-gray-400"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Registered
                  </p>

                  <p className="text-sm text-[#423640]">
                    {formatDate(
                      selectedUser.createdAt ||
                        selectedUser.registeredAt ||
                        selectedUser.date
                    )}
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              {selectedUser.address && (
                <div>
                  <p className="text-xs text-gray-400">
                    Address
                  </p>

                  <p className="mt-1 text-sm text-[#423640]">
                    {selectedUser.address}
                  </p>
                </div>
              )}

            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t border-gray-100 px-6 py-4">

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg bg-[#423640] px-4 py-2 text-sm font-medium text-white hover:bg-[#332933]"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ========================================= */}
      {/* BLOCK / UNBLOCK CONFIRMATION MODAL */}
      {/* ========================================= */}

      {confirmUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* ICON */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                confirmUser.isBlocked
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              {confirmUser.isBlocked ? (
                <CheckCircle
                  size={24}
                  className="text-green-600"
                />
              ) : (
                <Ban
                  size={24}
                  className="text-red-600"
                />
              )}
            </div>

            {/* MESSAGE */}
            <h2 className="mt-5 text-xl font-bold text-[#423640]">
              {confirmUser.isBlocked
                ? "Unblock User?"
                : "Block User?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to{" "}
              {confirmUser.isBlocked
                ? "unblock"
                : "block"}{" "}
              <span className="font-semibold text-[#423640]">
                {confirmUser.name || "this user"}
              </span>
              ?
            </p>

            {/* BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setConfirmUser(null)}
                disabled={blocking}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBlock}
                disabled={blocking}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                  confirmUser.isBlocked
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {blocking
                  ? "Updating..."
                  : confirmUser.isBlocked
                  ? "Unblock"
                  : "Block"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Users;