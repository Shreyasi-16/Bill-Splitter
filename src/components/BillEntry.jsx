import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const BillEntry = ({ groupName, members }) => {
  const [payments, setPayments] = useState({});
  const [total, setTotal] = useState(0);
  const [settlements, setSettlements] = useState([]);
  const [pdfBlob, setPdfBlob] = useState(null);

  useEffect(() => {
    const initial = {};
    members.forEach((m) => {
      initial[m] = { amount: "", purpose: "" };
    });
    setPayments(initial);
  }, [members]);

  const handleAmountChange = (name, value) => {
    const updated = {
      ...payments,
      [name]: { ...payments[name], amount: value === "" ? "" : Number(value) },
    };
    setPayments(updated);

    const sum = Object.values(updated).reduce(
      (a, b) => a + (Number(b.amount) || 0),
      0
    );
    setTotal(sum);
  };

  const handlePurposeChange = (name, value) => {
    setPayments({
      ...payments,
      [name]: { ...payments[name], purpose: value },
    });
  };

  const calculateSettlement = () => {
    const names = Object.keys(payments);
    const share = total / names.length;

    const balances = names.map((n) => ({
      name: n,
      balance: (Number(payments[n].amount) || 0) - share,
    }));

    const creditors = balances.filter((b) => b.balance > 0);
    const debtors = balances.filter((b) => b.balance < 0);

    const result = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(
        Math.abs(debtors[i].balance),
        creditors[j].balance
      );

      result.push({
        from: debtors[i].name,
        to: creditors[j].name,
        amount: amount.toFixed(2),
      });

      debtors[i].balance += amount;
      creditors[j].balance -= amount;

      if (debtors[i].balance === 0) i++;
      if (creditors[j].balance === 0) j++;
    }

    setSettlements(result);
  };

  // 🔹 Generate PDF (in memory)
const generatePDF = () => {
  if (settlements.length === 0) {
    alert("Please calculate the split before generating PDF.");
    return;
  }

  const doc = new jsPDF();

  
  doc.setFont("helvetica", "bold");
doc.setFontSize(18);
doc.text(
  "Bill Split Summary",
  doc.internal.pageSize.getWidth() / 2,
  20,
  { align: "center" }
);


 doc.setFont("helvetica", "normal");
doc.setFontSize(12);
doc.text(
  `Group: ${groupName}`,
  doc.internal.pageSize.getWidth() / 2,
  30,
  { align: "center" }
);


  // ✅ DEFINE tableData BEFORE using it
  const tableData = Object.keys(payments).map((name) => [
    name,
    payments[name].amount || 0,
    payments[name].purpose || "-",
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Member", "Amount (Rs.)", "Purpose"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [255, 159, 28] },
  });

  const finalY = doc.lastAutoTable.finalY || 60;

  doc.setFontSize(12);
  doc.text(`Total Bill: Rs. ${total}`, 14, finalY + 10);

  doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text("Settlement Summary", 14, finalY + 28);


  settlements.forEach((s, i) => {
    doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.text(
  `${i + 1}. ${s.from} pays ${s.to} Rs.${s.amount}`,
  14,
  finalY + 38 + i * 8
);

  });

  // Auto-download PDF
  doc.save(`${groupName}-bill-summary.pdf`);

  // Keep blob for sharing
  const blob = doc.output("blob");
  setPdfBlob(blob);
};


  // 🔹 Download PDF
  const downloadPDF = () => {
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${groupName}-bill-summary.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🔹 Share PDF directly (Mobile / supported browsers)
  const shareOnWhatsApp = () => {
  if (settlements.length === 0) {
    alert("Please calculate the split first.");
    return;
  }

  let message = `💸 Bill Split Summary\n\n`;
  message += `Group: ${groupName}\n`;
  message += `Total Bill: Rs. ${total}\n\n`;
  message += `Settlement:\n`;

  settlements.forEach((s, i) => {
    message += `${i + 1}. ${s.from} pays ${s.to} Rs. ${s.amount}\n`;
  });

  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-50 px-6 py-10">
      <h2 className="text-3xl font-bold text-blue-900 mb-2">
        Group: {groupName}
      </h2>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="grid grid-cols-3 font-semibold mb-4">
          <span>Member</span>
          <span>Amount (₹)</span>
          <span>Purpose</span>
        </div>

        {/* Inputs */}
        {members.map((member) => (
          <div
            key={member}
            className="grid grid-cols-3 gap-4 items-center mb-3"
          >
            <span>{member}</span>

            <input
              type="number"
              min="0"
              placeholder="0"
              value={payments[member]?.amount ?? ""}
              onChange={(e) =>
                handleAmountChange(member, e.target.value)
              }
              className="border border-gray-300 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              placeholder="e.g. Dinner, Taxi"
              value={payments[member]?.purpose ?? ""}
              onChange={(e) =>
                handlePurposeChange(member, e.target.value)
              }
              className="border border-gray-300 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        ))}

        <div className="border-t pt-4 mt-6 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>

        <button
          onClick={calculateSettlement}
          className="mt-6 bg-orange-500 text-white py-2 px-6 rounded-full"
        >
          Calculate Split →
        </button>

        <button
  onClick={generatePDF}
  disabled={settlements.length === 0}
  className="ml-10 mt-4 bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-blue-800 transition disabled:opacity-50"
>
  Generate PDF
</button>

        {/* Settlement Result */}
{settlements.length > 0 && (
  <div className="mt-8 border-t pt-6">
    <h3 className="text-lg font-bold mb-3 text-blue-900">
      Settlement Summary
    </h3>

    {settlements.map((s, idx) => (
      <p key={idx} className="text-gray-700 mb-1">
        💸 <b>{s.from}</b> pays <b>{s.to}</b> ₹{s.amount}
      </p>
    ))}
  </div>
)}


        {pdfBlob && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={downloadPDF}
              className="bg-gray-800 text-white px-6 py-2 rounded-full"
            >
              Download
            </button>

            <button
              onClick={shareOnWhatsApp}
              className="bg-green-600 text-white px-6 py-2 rounded-full"
            >
              Share on WhatsAPP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillEntry;
