import React, { useEffect } from 'react';

const PaymentModal = ({ isOpen, onClose, rental, onPaymentSuccess }) => {
    useEffect(() => {
        if (!rental || !isOpen) return;

        const initiatePayment = async () => {
            try {
                const res = await axios.post(`/api/customer/payments/generate/${rental.id}`);
                const token = res.data.token;

                if (token) {
                    window.snap.pay(token, {
                        onSuccess: async () => {
                            onPaymentSuccess(); // refresh data di parent
                            onClose();
                        },
                        onPending: () => {
                            alert("Menunggu pembayaran.");
                            onClose();
                        },
                        onError: () => {
                            alert("Pembayaran gagal.");
                            onClose();
                        },
                        onClose: () => {
                            onClose();
                        }
                    });
                } else {
                    alert("Token tidak tersedia.");
                    onClose();
                }
            } catch (err) {
                console.error(err);
                alert("Gagal memproses pembayaran.");
                onClose();
            }
        };

        initiatePayment();
    }, [rental, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                <p className="mb-2">Memproses pembayaran untuk <strong>{rental?.data_barang?.name}</strong>...</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Batal</button>
            </div>
        </div>
    );
};

export default PaymentModal;
