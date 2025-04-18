import React, { useEffect, useState } from 'react'
import AxiosInstance from '../axiosInstance/axios';
import { ChevronDown } from 'lucide-react';

const Faq = () => {
    const [faqs, setFaqs] = useState([]);
    const [activeAccordion, setActiveAccordion] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const faqResponse = await AxiosInstance.get('/api/faq');
                setFaqs(faqResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    }

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-[#0D0D0D] to-black">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-green-500 pb-3 mb-2">Pertanyaan Umum (FAQ)</h2>
                    <p className="text-gray-400 max-w-lg mx-auto">Jawaban untuk pertanyaan yang sering ditanyakan</p>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                            <div 
                                onClick={() => toggleAccordion(index)}
                                className="p-4 cursor-pointer hover:bg-gray-800 transition-colors flex justify-between items-center"
                            >
                                <h3 className="font-bold text-lg text-lime-500">{faq.question}</h3>
                                <ChevronDown 
                                    className={`text-lime-500 transition-transform ${activeAccordion === index ? 'rotate-180' : ''}`}
                                    size={20}
                                />
                            </div>
                            {activeAccordion === index && (
                                <div className="p-4 pt-3 border-t border-gray-700 bg-gray-800">
                                    <p className="text-gray-400">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Faq