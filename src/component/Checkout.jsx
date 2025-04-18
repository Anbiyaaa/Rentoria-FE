import React, { useState } from 'react';
import { X } from 'lucide-react';
import AxiosInstance from '../axiosInstance/axios';
import Loading from '../component/Loading';

const Checkout = ({ selectedProduct, onClose }) => {
    const [rentalDuration, setRentalDuration] = useState('12_jam');
    const [loading, setLoading] = useState(false);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [error, setError] = useState(null);

    const handleCheckout = async () => {
        try {
            setLoading(true);
            const userId = parseInt(localStorage.getItem('userId'));

            if (!userId) {
                setError("User ID tidak ditemukan. Silakan login kembali.");
                return;
            }

            const checkoutData = {
                user_id: userId,
                product_id: selectedProduct.id,
                quantity: 1,
                duration: rentalDuration,
                price: selectedProduct[getPriceKey(rentalDuration)]
            };

            const response = await AxiosInstance.post('/api/rentals', checkoutData);
            setOrderId(response.data.order_id);
            setCheckoutSuccess(true);
        } catch (err) {
            setError(err.message || 'Gagal memproses checkout');
        } finally {
            setLoading(false);
        }
    };

    const getPriceKey = (duration) => {
        switch (duration) {
            case '12_jam': return 'price_12_jam';
            case '1_hari': return 'price_1_hari';
            case '2_hari': return 'price_2_hari';
            default: return 'price_12_jam';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-blue-900 rounded-xl max-w-md w-full relative shadow-2xl">
                {!checkoutSuccess ? (
                    <>
                        <div className="p-6 border-b border-blue-800">
                            <button onClick={onClose} className="absolute top-4 right-4 text-indigo-300 hover:text-white">
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-white">Checkout Cepat</h2>
                            <p className="text-slate-100 text-sm">Proses sewa langsung dari dashboard</p>
                        </div>

                        <div className="p-6">
                            <div className="flex mb-6">
                                <img
                                    src={selectedProduct.gambar}
                                    alt={selectedProduct.name}
                                    className="w-24 h-24 object-cover rounded-lg mr-4"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-white">{selectedProduct.name}</h3>
                                    <span className="inline-block bg-blue-700 text-white text-xs px-2 py-1 rounded-full mt-1 mb-2">
                                        {selectedProduct.category.name}
                                    </span>
                                    <p className="text-slate-100 text-sm">{selectedProduct.deskripsi}</p>
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className="block text-base-200 text-sm font-medium mb-2">Durasi Sewa:</label>
                                <select
                                    value={rentalDuration}
                                    onChange={(e) => setRentalDuration(e.target.value)}
                                    className="w-full bg-gray-800 text-white p-3 rounded-lg"
                                >
                                    <option value="12_jam">12 Jam - Rp {selectedProduct.price_12_jam?.toLocaleString()}</option>
                                    <option value="1_hari">1 Hari - Rp {selectedProduct.price_1_hari?.toLocaleString()}</option>
                                    <option value="2_hari">2 Hari - Rp {selectedProduct.price_2_hari?.toLocaleString()}</option>
                                </select>
                            </div>

                            {error && (
                                <p className="text-red-400 bg-red-800/50 p-2 rounded-md text-sm mb-4">{error}</p>
                            )}

                            <button
                                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center text-sm font-medium transition-colors shadow-md"
                                onClick={handleCheckout}
                                disabled={loading}
                            >
                                {loading ? <Loading /> : "Konfirmasi & Sewa"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">Checkout Berhasil!</h2>
                        <p className="text-slate-100 mb-4">Order ID: {orderId}</p>
                        <button
                            onClick={onClose}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-md w-full"
                        >
                            Selesai
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
