"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { supabase } from "../../lib/supabase/client";

type Player = {
  id: number;
  registration_id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  city: string;
  role: string;
  experience: string;
  address: string;
  registration_fee: number;
  payment_method: string;
  transaction_id: string | null;
  payment_status: string;
  auction_status: string;
  created_at: string;
};

type NotificationItem = {
  id: number;
  registration_id: string;
  name: string;
  payment_method: string;
  transaction_id: string | null;
  registration_fee: number;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  // ============================================================
  // ADMIN AUTHENTICATION
  // ============================================================

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      await loadPlayers();
    } catch (error) {
      console.error(error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD ALL PLAYERS
  // ============================================================

  const loadPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        alert("Could not load players.");
        return;
      }

      setPlayers(data || []);

      updateNotifications(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ============================================================
  // UPDATE NOTIFICATIONS
  // ============================================================

  const updateNotifications = (playerList: Player[]) => {
    const pendingPlayers = playerList
      .filter(
        (player) =>
          player.payment_status === "Pending" &&
          player.transaction_id
      )
      .map((player) => ({
        id: player.id,
        registration_id: player.registration_id,
        name: player.name,
        payment_method: player.payment_method,
        transaction_id: player.transaction_id,
        registration_fee: player.registration_fee,
        created_at: player.created_at,
      }));

    setNotifications(pendingPlayers);
  };

  // ============================================================
  // AUTOMATIC NOTIFICATION CHECK
  // ============================================================

  useEffect(() => {
    if (loading) {
      return;
    }

    const interval = setInterval(() => {
      checkForNewPayments();
    }, 5000);

    return () => clearInterval(interval);
  }, [loading]);

  const checkForNewPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      const newPlayers = data || [];

      const currentPending = newPlayers.filter(
        (player) =>
          player.payment_status === "Pending" &&
          player.transaction_id
      );

      const previousPendingIds =
        JSON.parse(
          localStorage.getItem("adminPendingNotifications") || "[]"
        ) as number[];

      const currentPendingIds = currentPending.map(
        (player) => player.id
      );

      const newPendingPlayers = currentPending.filter(
        (player) => !previousPendingIds.includes(player.id)
      );

      // Show browser notification for newly detected payment
      if (newPendingPlayers.length > 0) {
        newPendingPlayers.forEach((player) => {
          showBrowserNotification(player);
        });
      }

      localStorage.setItem(
        "adminPendingNotifications",
        JSON.stringify(currentPendingIds)
      );

      setPlayers(newPlayers);
      updateNotifications(newPlayers);
    } catch (error) {
      console.error(error);
    }
  };

  // ============================================================
  // BROWSER NOTIFICATION
  // ============================================================

  const showBrowserNotification = (player: Player) => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window
    ) {
      if (Notification.permission === "granted") {
        new Notification("🏏 New Cricket Auction Payment", {
          body:
            `${player.name} submitted ₹${player.registration_fee} payment.\n` +
            `Registration: ${player.registration_id}`,
        });
      }
    }
  };

  // ============================================================
  // ENABLE BROWSER NOTIFICATIONS
  // ============================================================

  const enableNotifications = async () => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      alert("Your browser does not support notifications.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        alert("🔔 Browser notifications enabled!");
      } else {
        alert(
          "Browser notifications were not enabled. " +
          "You can still see notifications inside the Admin Panel."
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ============================================================
  // APPROVE / REJECT PAYMENT
  // ============================================================

  const updatePayment = async (
    id: number,
    status: "Paid" | "Rejected"
  ) => {
    try {
      const auctionStatus =
        status === "Paid"
          ? "Confirmed"
          : "Not Eligible";

      const { error } = await supabase
        .from("players")
        .update({
          payment_status: status,
          auction_status: auctionStatus,
        })
        .eq("id", id);

      if (error) {
        console.error(error);
        alert("Update failed: " + error.message);
        return;
      }

      if (status === "Paid") {
        alert(
          "✅ Payment approved successfully!\n\n" +
          "Auction Status: Confirmed"
        );
      } else {
        alert(
          "❌ Payment rejected successfully!\n\n" +
          "Auction Status: Not Eligible"
        );
      }

      await loadPlayers();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // ============================================================
  // REFRESH
  // ============================================================

  const refreshAdminPanel = async () => {
    try {
      setRefreshing(true);

      await loadPlayers();

      alert("Admin panel refreshed successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  // ============================================================
  // DOWNLOAD ALL PLAYERS EXCEL
  // ============================================================

  const downloadAllPlayersExcel = () => {
    if (players.length === 0) {
      alert("No player data available.");
      return;
    }

    const excelData = players.map((player) => ({
      "Registration ID": player.registration_id,
      "Full Name": player.name,
      Email: player.email,
      Mobile: player.mobile,
      "Date of Birth": player.dob,
      City: player.city,
      "Cricket Role": player.role,
      Experience: player.experience,
      Address: player.address,
      "Registration Fee": player.registration_fee,
      "Payment Method": player.payment_method,
      "UTR / Transaction ID":
        player.transaction_id || "Not submitted",
      "Payment Status": player.payment_status,
      "Auction Status": player.auction_status,
      "Registration Date": player.created_at,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "All Players"
    );

    XLSX.writeFile(
      workbook,
      "Cricket_Auction_All_Players.xlsx"
    );

    alert("📥 All players Excel downloaded successfully!");
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem(
      "adminPendingNotifications"
    );

    router.push("/login");
  };

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalPlayers = players.length;

  const pendingPlayers = players.filter(
    (player) => player.payment_status === "Pending"
  ).length;

  const approvedPlayers = players.filter(
    (player) => player.payment_status === "Paid"
  ).length;

  const rejectedPlayers = players.filter(
    (player) => player.payment_status === "Rejected"
  ).length;

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">
            🏏
          </div>

          <p className="text-slate-600 font-semibold">
            Loading Admin Panel...
          </p>
        </div>
      </main>
    );
  }

  // ============================================================
  // ADMIN PANEL
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-100">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="bg-slate-950 text-white px-6 py-4">

        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold">
              🏏 Cricket Auction
            </h1>

            <p className="text-xs text-slate-400">
              Admin Panel
            </p>
          </div>

          {/* Navbar Actions */}
          <div className="flex items-center gap-3">

            {/* Notification Bell */}
            <div className="relative">

              <button
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                className="relative bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition"
              >
                <span className="text-xl">
                  🔔
                </span>

                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-14 w-[380px] max-w-[90vw] bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">

                  {/* Notification Header */}
                  <div className="bg-slate-950 text-white px-5 py-4 flex justify-between items-center">

                    <div>
                      <h3 className="font-bold text-lg">
                        🔔 Notifications
                      </h3>

                      <p className="text-xs text-slate-400">
                        Pending payment approvals
                      </p>
                    </div>

                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {notifications.length}
                    </span>

                  </div>

                  {/* Notification List */}
                  <div className="max-h-[450px] overflow-y-auto">

                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">

                        <div className="text-4xl mb-3">
                          ✅
                        </div>

                        <p className="font-semibold text-slate-700">
                          No pending notifications
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          All payments are processed.
                        </p>

                      </div>
                    ) : (
                      notifications.map(
                        (notification) => (
                          <div
                            key={notification.id}
                            className="border-b border-slate-200 p-5 hover:bg-slate-50"
                          >

                            <div className="flex items-start gap-3">

                              <div className="text-2xl">
                                🟡
                              </div>

                              <div className="flex-1">

                                <h4 className="font-bold text-slate-900">
                                  New Payment Approval
                                </h4>

                                <p className="text-sm text-slate-700 mt-1">
                                  <strong>
                                    {notification.name}
                                  </strong>{" "}
                                  submitted payment.
                                </p>

                                <div className="mt-3 space-y-1 text-xs text-slate-600">

                                  <p>
                                    🆔{" "}
                                    <strong>
                                      Registration:
                                    </strong>{" "}
                                    {notification.registration_id}
                                  </p>

                                  <p>
                                    💰{" "}
                                    <strong>
                                      Amount:
                                    </strong>{" "}
                                    ₹
                                    {
                                      notification.registration_fee
                                    }
                                  </p>

                                  <p>
                                    💳{" "}
                                    <strong>
                                      Method:
                                    </strong>{" "}
                                    {
                                      notification.payment_method
                                    }
                                  </p>

                                  <p className="break-all">
                                    🔢{" "}
                                    <strong>
                                      UTR:
                                    </strong>{" "}
                                    {
                                      notification.transaction_id ||
                                      "Not submitted"
                                    }
                                  </p>

                                  <p>
                                    🕐{" "}
                                    <strong>
                                      Submitted:
                                    </strong>{" "}
                                    {new Date(
                                      notification.created_at
                                    ).toLocaleString()}
                                  </p>

                                </div>

                                {/* Notification Actions */}
                                <div className="flex gap-2 mt-4">

                                  <button
                                    onClick={() => {
                                      updatePayment(
                                        notification.id,
                                        "Paid"
                                      );

                                      setShowNotifications(
                                        false
                                      );
                                    }}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-3 py-2 rounded-lg"
                                  >
                                    ✅ Approve
                                  </button>

                                  <button
                                    onClick={() => {
                                      updatePayment(
                                        notification.id,
                                        "Rejected"
                                      );

                                      setShowNotifications(
                                        false
                                      );
                                    }}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-3 py-2 rounded-lg"
                                  >
                                    ❌ Reject
                                  </button>

                                </div>

                              </div>

                            </div>

                          </div>
                        )
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* Enable Browser Notifications */}
            <button
              onClick={enableNotifications}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-sm"
            >
              🔔 Enable Alerts
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>

          </div>

        </div>

      </nav>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="mb-8">

          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Admin Dashboard
              </h2>

              <p className="text-slate-600 mt-2">
                Manage player registrations and verify
                payment submissions.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={refreshAdminPanel}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-5 py-3 rounded-lg transition"
              >
                {refreshing
                  ? "Refreshing..."
                  : "🔄 Refresh"}
              </button>

              <button
                onClick={downloadAllPlayersExcel}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-lg transition"
              >
                📥 Download All Players Excel
              </button>

            </div>

          </div>

        </div>

        {/* ==================================================
            NOTIFICATION ALERT
        ================================================== */}

        {notifications.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 mb-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div className="flex items-start gap-4">

                <div className="text-3xl">
                  🔔
                </div>

                <div>
                  <h3 className="font-bold text-yellow-900 text-lg">
                    {notifications.length} Payment
                    Approval
                    {notifications.length > 1
                      ? "s"
                      : ""}{" "}
                    Required
                  </h3>

                  <p className="text-yellow-800 text-sm mt-1">
                    New payment submissions are waiting
                    for verification.
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  setShowNotifications(true)
                }
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-5 py-2 rounded-lg"
              >
                🔔 View Notifications
              </button>

            </div>

          </div>
        )}

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          {/* Total */}
          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-slate-500 text-sm">
              Total Players
            </p>

            <p className="text-4xl font-bold text-blue-600 mt-2">
              {totalPlayers}
            </p>

          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-slate-500 text-sm">
              Pending
            </p>

            <p className="text-4xl font-bold text-yellow-600 mt-2">
              {pendingPlayers}
            </p>

          </div>

          {/* Approved */}
          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-slate-500 text-sm">
              Approved
            </p>

            <p className="text-4xl font-bold text-green-600 mt-2">
              {approvedPlayers}
            </p>

          </div>

          {/* Rejected */}
          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-slate-500 text-sm">
              Rejected
            </p>

            <p className="text-4xl font-bold text-red-600 mt-2">
              {rejectedPlayers}
            </p>

          </div>

        </div>

        {/* ==================================================
            PLAYERS TABLE
        ================================================== */}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          <div className="bg-slate-950 text-white px-6 py-5">

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">

              <div>
                <h3 className="text-xl font-bold">
                  👥 Registered Players
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Review and manage player payment
                  submissions.
                </p>
              </div>

              {notifications.length > 0 && (
                <div className="bg-red-600 px-4 py-2 rounded-lg text-sm font-bold">
                  🔔 {notifications.length} Pending
                  Approval
                  {notifications.length > 1
                    ? "s"
                    : ""}
                </div>
              )}

            </div>

          </div>

          {/* Table */}
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="px-4 py-4 text-left text-sm font-bold text-slate-700">
                    Registration ID
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold text-slate-700">
                    Player
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold text-slate-700">
                    Mobile
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold text-slate-700">
                    Role
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold text-slate-700">
                    Payment
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold text-slate-700">
                    UTR
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-bold text-slate-700">
                    Auction
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-bold text-slate-700">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {players.length === 0 ? (
                  <tr>

                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <div className="text-4xl mb-3">
                        👥
                      </div>

                      <p className="font-semibold">
                        No players registered yet.
                      </p>
                    </td>

                  </tr>
                ) : (
                  players.map((player) => {

                    const isPending =
                      player.payment_status ===
                      "Pending";

                    const isPaid =
                      player.payment_status ===
                      "Paid";

                    const isRejected =
                      player.payment_status ===
                      "Rejected";

                    return (
                      <tr
                        key={player.id}
                        className={`border-b border-slate-200 hover:bg-slate-50 ${
                          isPending
                            ? "bg-yellow-50"
                            : ""
                        }`}
                      >

                        {/* Registration ID */}
                        <td className="px-4 py-4">

                          <span className="font-mono font-bold text-blue-600 text-sm">
                            {
                              player.registration_id
                            }
                          </span>

                        </td>

                        {/* Player */}
                        <td className="px-4 py-4">

                          <div>
                            <p className="font-bold text-slate-900">
                              {player.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {player.email}
                            </p>
                          </div>

                        </td>

                        {/* Mobile */}
                        <td className="px-4 py-4">

                          <p className="text-sm font-semibold">
                            {player.mobile}
                          </p>

                        </td>

                        {/* Role */}
                        <td className="px-4 py-4">

                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                            {player.role}
                          </span>

                        </td>

                        {/* Payment */}
                        <td className="px-4 py-4">

                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              isPaid
                                ? "bg-green-100 text-green-700"
                                : isRejected
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {
                              player.payment_status
                            }
                          </span>

                          <p className="text-xs text-slate-500 mt-1">
                            ₹
                            {
                              player.registration_fee
                            }
                          </p>

                        </td>

                        {/* UTR */}
                        <td className="px-4 py-4">

                          <span className="font-mono text-xs font-semibold break-all">
                            {player.transaction_id ||
                              "Not submitted"}
                          </span>

                        </td>

                        {/* Auction */}
                        <td className="px-4 py-4">

                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              player.auction_status ===
                              "Confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {
                              player.auction_status
                            }
                          </span>

                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">

                          {isPending ? (
                            <div className="flex flex-col gap-2">

                              <button
                                onClick={() =>
                                  updatePayment(
                                    player.id,
                                    "Paid"
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
                              >
                                ✅ Approve
                              </button>

                              <button
                                onClick={() =>
                                  updatePayment(
                                    player.id,
                                    "Rejected"
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
                              >
                                ❌ Reject
                              </button>

                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No action required
                            </span>
                          )}

                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ==================================================
            AUTO REFRESH INFO
        ================================================== */}

        <div className="mt-6 text-center">

          <p className="text-xs text-slate-500">
            🔄 Admin notifications automatically check
            for new payments every 5 seconds.
          </p>

        </div>

      </div>

    </main>
  );
}