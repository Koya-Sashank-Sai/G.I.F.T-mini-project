import React from 'react';
import { X, CheckCircle2, Clock, Eye, Calculator, Send, ShieldCheck, User } from 'lucide-react';

interface CustomerHistoryModalProps {
  customerId: string;
  customerName: string;
  branch: string;
  onClose: () => void;
  events?: Array<{
    id: string;
    product_type: string;
    status: string;
    timestamp: string;
    details?: string;
  }>;
}

export const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({
  customerId,
  customerName,
  branch,
  onClose,
  events = []
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#FAF7F0] rounded-2xl max-w-2xl w-full border border-[#D9CDB9] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 bg-[#254D3A] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg">
              {customerName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif">{customerName}</h3>
              <p className="text-xs text-[#BED6C5]">
                Customer ID: {customerId} • {branch}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#343A35]">
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-white rounded-xl border border-[#E3DAC8]">
            <div>
              <span className="text-[#758477] block text-[11px]">Authorized Branch</span>
              <span className="font-semibold text-[#254D3A]">{branch}</span>
            </div>
            <div>
              <span className="text-[#758477] block text-[11px]">Audit Status</span>
              <span className="inline-flex items-center space-x-1 text-[#254D3A] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Customer Activity</span>
              </span>
            </div>
          </div>

          {/* Timeline of Recorded Events */}
          <div>
            <h4 className="font-bold text-[#254D3A] text-sm font-serif mb-3">
              Recorded Engagement History &amp; Audit Trail
            </h4>

            {events.length === 0 ? (
              <div className="p-4 bg-white rounded-xl border border-[#E3DAC8] text-center text-[#758477]">
                No detailed engagement events recorded yet.
              </div>
            ) : (
              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D5C9B5]">
                {events.map((ev, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5 relative">
                    <div className="w-7 h-7 rounded-full bg-[#E5EDE7] text-[#254D3A] border border-[#BACBBF] flex items-center justify-center shrink-0 z-10">
                      {ev.status === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#254D3A]" />
                      ) : ev.status === 'In Progress' ? (
                        <Calculator className="w-4 h-4 text-[#C2782A]" />
                      ) : (
                        <Eye className="w-4 h-4 text-[#39688F]" />
                      )}
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#E4DBCB] flex-1 shadow-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#254D3A]">{ev.product_type}</span>
                        <span className="text-[10px] text-[#869488]">{ev.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ev.status === 'Completed'
                              ? 'bg-[#E5F2E8] text-[#254D3A]'
                              : ev.status === 'In Progress'
                              ? 'bg-[#FDF4E6] text-[#A6611A]'
                              : 'bg-[#EBF3FA] text-[#255C86]'
                          }`}
                        >
                          {ev.status}
                        </span>
                        <span className="text-[#5B6B5E] text-[11px]">{ev.details}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EDE7DA] border-t border-[#DFD5C2] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#254D3A] hover:bg-[#1B3F2E] text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
