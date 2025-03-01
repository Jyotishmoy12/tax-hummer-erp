import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import BankStatement from "../../../db/models/BankStatement";
import Transaction from "../../../db/models/Transaction";
import BankReconciliation from "../../../db/models/BankReconciliation";

export async function GET() {
  await connectDB();
  try {
    // Fetch bank statements and accounting transactions.
    const bankStatements = await BankStatement.find({});
    const transactions = await Transaction.find({});

    // Simplified auto-reconciliation:
    // For each bank statement, try to find a matching transaction by comparing amounts.
    // (In a real app you might also compare dates and descriptions using fuzzy matching.)
    const reconciliationResults = await Promise.all(
      bankStatements.map(async (statement) => {
        const matchedTransaction = transactions.find(txn => {
          // For debit statements, compare with debit amount; for credit, compare with credit amount.
          if (statement.transactionType === 'debit') {
            return Math.abs(txn.debit - statement.amount) < 0.01;
          } else {
            return Math.abs(txn.credit - statement.amount) < 0.01;
          }
        });

        const status = matchedTransaction ? "reconciled" : "unreconciled";
        // Example fraud detection: flag a high-value unmatched statement.
        const fraudAlert = !matchedTransaction && statement.amount > 10000;

        // Optionally, you might want to save the reconciliation result to your database.
        // Here, we'll create (or upsert) a reconciliation record.
        const reconRecord = await BankReconciliation.findOneAndUpdate(
          { bankStatement: statement._id },
          {
            bankStatement: statement._id,
            transaction: matchedTransaction ? matchedTransaction._id : null,
            status,
            fraudAlert,
          },
          { new: true, upsert: true }
        );

        return {
          bankStatementId: statement._id,
          matchedTransactionId: matchedTransaction ? matchedTransaction._id : null,
          status,
          fraudAlert,
          statementAmount: statement.amount,
        };
      })
    );

    return NextResponse.json({ success: true, data: reconciliationResults });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
