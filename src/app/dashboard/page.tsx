"use client"

import Link from "next/link"

export default function Dashboard (){
    return (
        <div>
        <h1>Tax Hummer ERP Dashboard</h1>
        <nav>
        <ul>
          <li><Link href="/accounting">Accounting</Link></li>
          <li><Link href="/inventory">Inventory</Link></li>
          <li><Link href="/sales">Sales</Link></li>
          <li><Link href="/hr">HR</Link></li>
          <li><Link href="/purchasing">Purchasing</Link></li>
          <li><Link href="/it">IT</Link></li>
        </ul>
        </nav>
        </div>
    )
}