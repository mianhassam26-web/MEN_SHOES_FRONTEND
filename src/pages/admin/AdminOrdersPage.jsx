import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { fetchAllOrdersAdmin } from '../../features/orders/ordersSlice';
import { Pagination } from '../../components/common/UI';
import { TableRowSkeleton } from '../../components/common/Skeletons';
import { formatPKR } from '../../utils/currency';

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const { adminList: orders, adminLoading: loading } = useSelector((s) => s.orders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  useEffect(() => { dispatch(fetchAllOrdersAdmin()); }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = !search || String(o.id).includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalRevenue = orders.reduce((s, o) => s + (o.total_amount || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl">Orders</h2>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="font-heading font-bold text-xl text-maroon">{formatPKR(totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by Order ID..." className="input-field pl-8 text-sm py-2 min-w-[200px]" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm py-2 pr-8 appearance-none cursor-pointer">
            <option value="all">All Status</option>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
              <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          if (count === 0) return null;
          return (
            <button key={s} onClick={() => { setStatusFilter(s === statusFilter ? 'all' : s); setPage(1); }}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${s === statusFilter ? 'ring-2 ring-offset-1 ring-maroon' : ''} ${STATUS_COLORS[s]}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}: {count}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-lgray overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-lgray bg-lgray/30">
              {['Order ID', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-button tracking-widest uppercase text-gray-500" style={{fontFamily:'Montserrat,sans-serif'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
            ) : paginated.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-gray-400">No orders found</td></tr>
            ) : (
              paginated.map((order) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-lgray hover:bg-lgray/20 transition-colors"
                >
                  <td className="py-3 px-4 font-bold">#{order.id}</td>
                  <td className="py-3 px-4 text-gray-600">{order.order_items?.length || 0} item(s)</td>
                  <td className="py-3 px-4 font-bold text-maroon">{formatPKR(order.total_amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination current={page} total={totalPages} onChange={setPage} />
    </div>
  );
}
