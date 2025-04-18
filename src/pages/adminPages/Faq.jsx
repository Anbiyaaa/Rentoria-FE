import React, { useState, useEffect } from 'react';
import Header from '../../navigation/Header';
import SidebarAdmin from '../../navigation/SidebarAdmin';
import AxiosInstance from '../../axiosInstance/axios';
import { PlusCircle, X, Edit, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react';

const FAQApp = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  // Fetch FAQs from API
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get('/api/faq');
      setFaqs(response.data.map(faq => ({
        ...faq,
        isOpen: false,
        isEditing: false,
        editedQuestion: faq.question,
        editedAnswer: faq.answer
      })));
      setError(null);
    } catch (err) {
      setError('Gagal memuat data FAQ. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Function to display success notification
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000); // Hide after 3 seconds
  };

  // Function to display error notification
  const showErrorMessage = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000); // Hide after 3 seconds
  };

  // Toggle FAQ accordion
  const toggleFAQ = (id) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq
    ));
  };

  // Toggle edit mode
  const toggleEditMode = (id) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { 
        ...faq, 
        isEditing: !faq.isEditing,
        editedQuestion: faq.question,
        editedAnswer: faq.answer
      } : { ...faq, isEditing: false }
    ));
  };

  // Handle editing changes
  const handleEditChange = (id, field, value) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  // Add new FAQ
  const addFAQ = async (e) => {
    e.preventDefault();
    if (newQuestion.trim() === '' || newAnswer.trim() === '') return;

    try {
      const response = await AxiosInstance.post('/api/faq', {
        question: newQuestion,
        answer: newAnswer
      });

      setFaqs([...faqs, { 
        ...response.data, 
        isOpen: false, 
        isEditing: false,
        editedQuestion: response.data.question,
        editedAnswer: response.data.answer
      }]);
      setNewQuestion('');
      setNewAnswer('');
      setFormVisible(false);
      showSuccessMessage('✅ FAQ berhasil ditambahkan!');
    } catch (err) {
      showErrorMessage('❌ Gagal menambahkan FAQ. Silakan coba lagi.');
    }
  };

  // Update FAQ
  const updateFAQ = async (id) => {
    const faq = faqs.find(f => f.id === id);
    if (!faq) return;

    try {
      await AxiosInstance.put(`/api/faq/${id}`, {
        question: faq.editedQuestion,
        answer: faq.editedAnswer
      });

      setFaqs(
        faqs.map(f =>
          f.id === id
            ? { 
                ...f, 
                question: f.editedQuestion, 
                answer: f.editedAnswer, 
                isEditing: false 
              }
            : f
        )
      );
      showSuccessMessage('✅ FAQ berhasil diperbarui!');
    } catch (err) {
      showErrorMessage('❌ Gagal memperbarui FAQ. Silakan coba lagi.');
    }
  };

  // Delete FAQ with confirmation
  const confirmDeleteFAQ = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      deleteFAQ(id);
    }
  };

  // Delete FAQ
  const deleteFAQ = async (id) => {
    try {
      await AxiosInstance.delete(`/api/faq/${id}`);
      setFaqs(faqs.filter(faq => faq.id !== id));
      showSuccessMessage('✅ FAQ berhasil dihapus!');
    } catch (err) {
      showErrorMessage('❌ Gagal menghapus FAQ. Silakan coba lagi.');
    }
  };

  // Cancel editing
  const cancelEditing = (id) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { 
        ...faq, 
        isEditing: false,
        editedQuestion: faq.question,
        editedAnswer: faq.answer
      } : faq
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">FAQ Manager</h1>
              <button
                onClick={() => setFormVisible(!formVisible)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {formVisible ? (
                  <>
                    <X size={18} />
                    <span>Batal</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    <span>Tambah FAQ</span>
                  </>
                )}
              </button>
            </div>

            {/* Success Notification */}
            {successMessage && (
              <div className="fixed top-5 right-5 flex items-center gap-2 bg-green-500 text-white font-medium px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
                {successMessage}
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="fixed top-5 right-5 flex items-center gap-2 bg-red-500 text-white font-medium px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
                {error}
              </div>
            )}

            {/* Add New FAQ Form */}
            {formVisible && (
              <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Tambah FAQ Baru</h2>
                <form onSubmit={addFAQ}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Pertanyaan</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Masukkan pertanyaan"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">Jawaban</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Masukkan jawaban"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setFormVisible(false)}
                      className="py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Simpan FAQ
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Stats Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-bold text-2xl">{faqs.length}</p>
                  <p className="text-blue-600">Total FAQ</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-bold text-2xl">{new Date().toLocaleDateString('id-ID')}</p>
                  <p className="text-green-600">Terakhir Diperbarui</p>
                </div>
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Daftar FAQ</h2>
              
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : faqs.length > 0 ? (
                faqs.map(faq => (
                  <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {faq.isEditing ? (
                      <div className="p-5">
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2 font-medium">Pertanyaan</label>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            value={faq.editedQuestion}
                            onChange={(e) => handleEditChange(faq.id, 'editedQuestion', e.target.value)}
                            placeholder="Masukkan pertanyaan"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2 font-medium">Jawaban</label>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            value={faq.editedAnswer}
                            onChange={(e) => handleEditChange(faq.id, 'editedAnswer', e.target.value)}
                            placeholder="Masukkan jawaban"
                            rows="4"
                            required
                          ></textarea>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => cancelEditing(faq.id)}
                            className="flex items-center gap-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                          >
                            <X size={16} />
                            <span>Batal</span>
                          </button>
                          <button 
                            onClick={() => updateFAQ(faq.id)}
                            className="flex items-center gap-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700"
                          >
                            <Save size={16} />
                            <span>Simpan</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div 
                          className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleFAQ(faq.id)}
                        >
                          <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                          <div className="flex items-center">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleEditMode(faq.id);
                              }} 
                              className="mr-2 text-yellow-500 hover:text-yellow-600 p-1"
                              title="Edit FAQ"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDeleteFAQ(faq.id);
                              }} 
                              className="mr-2 text-red-500 hover:text-red-600 p-1"
                              title="Hapus FAQ"
                            >
                              <Trash2 size={18} />
                            </button>
                            {faq.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                        {faq.isOpen && (
                          <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700 whitespace-pre-line">{faq.answer}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
                  <p className="text-gray-500">Tidak ada FAQ yang ditemukan.</p>
                  <button
                    onClick={() => setFormVisible(true)}
                    className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    <PlusCircle size={18} />
                    <span>Tambah FAQ Pertama</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQApp;